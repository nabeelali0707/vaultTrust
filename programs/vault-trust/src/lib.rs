use anchor_lang::prelude::*;

declare_id!("Bb8QJuK5CvWrhFW8S6Y1Djsmyn8L9jUXiVWEoEDqZDSu");

// Privacy-conscious consent program: only SHA-256 hashes of purpose/scope are
// ever stored here. Plaintext purpose/scope and all financial data live in
// Firestore (see lib/db.ts), keyed by consent_id, and are never sent on-chain.
#[program]
pub mod vault_trust {
    use super::*;

    pub fn grant_consent(
        ctx: Context<GrantConsent>,
        consent_id: String,
        purpose_hash: [u8; 32],
        scope_hash: [u8; 32],
        expiry: i64,
    ) -> Result<()> {
        require!(consent_id.len() <= ConsentAccount::MAX_CONSENT_ID_LEN, VaultTrustError::ConsentIdTooLong);

        let now = Clock::get()?.unix_timestamp;
        let consent = &mut ctx.accounts.consent;

        consent.consent_id = consent_id.clone();
        consent.user_authority = ctx.accounts.user_authority.key();
        consent.bank_wallet = ctx.accounts.bank_wallet.key();
        consent.purpose_hash = purpose_hash;
        consent.scope_hash = scope_hash;
        consent.expiry = expiry;
        consent.granted_at = now;
        consent.updated_at = now;
        consent.last_accessed_at = 0;
        consent.status = ConsentStatus::Active;
        consent.bump = ctx.bumps.consent;

        emit!(ConsentGranted {
            consent: consent.key(),
            consent_id,
            user_authority: consent.user_authority,
            bank_wallet: consent.bank_wallet,
            purpose_hash,
            scope_hash,
            expiry,
            timestamp: now,
        });

        Ok(())
    }

    pub fn update_consent(
        ctx: Context<UpdateConsent>,
        purpose_hash: [u8; 32],
        scope_hash: [u8; 32],
        expiry: i64,
    ) -> Result<()> {
        let consent = &mut ctx.accounts.consent;
        require!(consent.status == ConsentStatus::Active, VaultTrustError::ConsentNotActive);

        let now = Clock::get()?.unix_timestamp;
        consent.purpose_hash = purpose_hash;
        consent.scope_hash = scope_hash;
        consent.expiry = expiry;
        consent.updated_at = now;

        emit!(ConsentUpdated {
            consent: consent.key(),
            purpose_hash,
            scope_hash,
            expiry,
            timestamp: now,
        });

        Ok(())
    }

    pub fn revoke_consent(ctx: Context<RevokeConsent>) -> Result<()> {
        let consent = &mut ctx.accounts.consent;
        require!(consent.status == ConsentStatus::Active, VaultTrustError::ConsentNotActive);

        let now = Clock::get()?.unix_timestamp;
        consent.status = ConsentStatus::Revoked;
        consent.updated_at = now;

        emit!(ConsentRevoked {
            consent: consent.key(),
            timestamp: now,
        });

        Ok(())
    }

    // Bank-signed: the requesting bank's own custodial key must sign, so the
    // on-chain record of "who accessed this data" is cryptographically the
    // bank, not just a claim in an off-chain log.
    pub fn log_bank_access(ctx: Context<LogBankAccess>) -> Result<()> {
        let consent = &mut ctx.accounts.consent;
        require!(consent.status == ConsentStatus::Active, VaultTrustError::ConsentNotActive);

        let now = Clock::get()?.unix_timestamp;
        if consent.expiry != 0 {
            require!(now < consent.expiry, VaultTrustError::ConsentExpired);
        }

        consent.last_accessed_at = now;

        emit!(BankAccessLogged {
            consent: consent.key(),
            bank_wallet: ctx.accounts.bank_wallet.key(),
            timestamp: now,
        });

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ConsentStatus {
    Active,
    Revoked,
}

#[account]
#[derive(InitSpace)]
pub struct ConsentAccount {
    #[max_len(96)]
    pub consent_id: String,
    pub user_authority: Pubkey, // freelancer's custodial wallet — signing authority
    pub bank_wallet: Pubkey,    // bank officer's custodial wallet — identifies the counterparty
    pub purpose_hash: [u8; 32], // SHA-256(purpose) — plaintext lives only in Firestore
    pub scope_hash: [u8; 32],   // SHA-256(scope) — plaintext lives only in Firestore
    pub expiry: i64,            // unix timestamp; 0 = no expiry
    pub granted_at: i64,
    pub updated_at: i64,
    pub last_accessed_at: i64,
    pub status: ConsentStatus,
    pub bump: u8,
}

impl ConsentAccount {
    pub const MAX_CONSENT_ID_LEN: usize = 96;
}

#[derive(Accounts)]
pub struct GrantConsent<'info> {
    #[account(
        init,
        payer = fee_payer,
        space = 8 + ConsentAccount::INIT_SPACE,
        seeds = [b"consent", user_authority.key().as_ref(), bank_wallet.key().as_ref()],
        bump
    )]
    pub consent: Account<'info, ConsentAccount>,

    // Freelancer's custodial wallet: must sign to authorize granting consent
    // under their own on-chain identity.
    pub user_authority: Signer<'info>,

    /// CHECK: only used to derive the PDA seeds and stored as a reference pubkey; no data is read from it.
    pub bank_wallet: UncheckedAccount<'info>,

    // Backend service wallet: pays account-creation rent only, never recorded
    // as the consent's authority.
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConsent<'info> {
    #[account(
        mut,
        seeds = [b"consent", user_authority.key().as_ref(), bank_wallet.key().as_ref()],
        bump = consent.bump,
        has_one = user_authority @ VaultTrustError::Unauthorized,
    )]
    pub consent: Account<'info, ConsentAccount>,

    pub user_authority: Signer<'info>,

    /// CHECK: only used to re-derive the PDA seeds.
    pub bank_wallet: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct RevokeConsent<'info> {
    #[account(
        mut,
        seeds = [b"consent", user_authority.key().as_ref(), bank_wallet.key().as_ref()],
        bump = consent.bump,
        has_one = user_authority @ VaultTrustError::Unauthorized,
    )]
    pub consent: Account<'info, ConsentAccount>,

    pub user_authority: Signer<'info>,

    /// CHECK: only used to re-derive the PDA seeds.
    pub bank_wallet: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct LogBankAccess<'info> {
    #[account(
        mut,
        seeds = [b"consent", user_authority.key().as_ref(), bank_wallet.key().as_ref()],
        bump = consent.bump,
        has_one = bank_wallet @ VaultTrustError::Unauthorized,
    )]
    pub consent: Account<'info, ConsentAccount>,

    /// CHECK: only used to re-derive the PDA seeds; the freelancer does not need to sign a bank's access event.
    pub user_authority: UncheckedAccount<'info>,

    // The bank's own custodial wallet must sign, so this instruction proves
    // cryptographically which bank accessed the data, not just an off-chain claim.
    pub bank_wallet: Signer<'info>,
}

#[event]
pub struct ConsentGranted {
    pub consent: Pubkey,
    pub consent_id: String,
    pub user_authority: Pubkey,
    pub bank_wallet: Pubkey,
    pub purpose_hash: [u8; 32],
    pub scope_hash: [u8; 32],
    pub expiry: i64,
    pub timestamp: i64,
}

#[event]
pub struct ConsentUpdated {
    pub consent: Pubkey,
    pub purpose_hash: [u8; 32],
    pub scope_hash: [u8; 32],
    pub expiry: i64,
    pub timestamp: i64,
}

#[event]
pub struct ConsentRevoked {
    pub consent: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct BankAccessLogged {
    pub consent: Pubkey,
    pub bank_wallet: Pubkey,
    pub timestamp: i64,
}

#[error_code]
pub enum VaultTrustError {
    #[msg("This consent is not active (already revoked).")]
    ConsentNotActive,
    #[msg("This consent has expired.")]
    ConsentExpired,
    #[msg("Signer is not authorized to perform this action on this consent.")]
    Unauthorized,
    #[msg("consent_id exceeds the maximum allowed length.")]
    ConsentIdTooLong,
}
