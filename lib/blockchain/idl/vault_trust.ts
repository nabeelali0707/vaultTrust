/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vault_trust.json`.
 */
export type VaultTrust = {
  "address": "Bb8QJuK5CvWrhFW8S6Y1Djsmyn8L9jUXiVWEoEDqZDSu",
  "metadata": {
    "name": "vaultTrust",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "VaultTrust - Consent-based income verification"
  },
  "instructions": [
    {
      "name": "grantConsent",
      "discriminator": [
        174,
        67,
        143,
        95,
        73,
        190,
        40,
        141
      ],
      "accounts": [
        {
          "name": "consent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  115,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "userAuthority"
              },
              {
                "kind": "account",
                "path": "bankWallet"
              }
            ]
          }
        },
        {
          "name": "userAuthority",
          "signer": true
        },
        {
          "name": "bankWallet"
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "consentId",
          "type": "string"
        },
        {
          "name": "purposeHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "scopeHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "expiry",
          "type": "i64"
        }
      ]
    },
    {
      "name": "logBankAccess",
      "discriminator": [
        222,
        122,
        152,
        90,
        171,
        104,
        123,
        228
      ],
      "accounts": [
        {
          "name": "consent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  115,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "userAuthority"
              },
              {
                "kind": "account",
                "path": "bankWallet"
              }
            ]
          }
        },
        {
          "name": "userAuthority"
        },
        {
          "name": "bankWallet",
          "signer": true,
          "relations": [
            "consent"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "revokeConsent",
      "discriminator": [
        36,
        0,
        100,
        148,
        132,
        131,
        112,
        76
      ],
      "accounts": [
        {
          "name": "consent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  115,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "userAuthority"
              },
              {
                "kind": "account",
                "path": "bankWallet"
              }
            ]
          }
        },
        {
          "name": "userAuthority",
          "signer": true,
          "relations": [
            "consent"
          ]
        },
        {
          "name": "bankWallet"
        }
      ],
      "args": []
    },
    {
      "name": "updateConsent",
      "discriminator": [
        98,
        24,
        115,
        204,
        222,
        141,
        66,
        115
      ],
      "accounts": [
        {
          "name": "consent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  115,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "userAuthority"
              },
              {
                "kind": "account",
                "path": "bankWallet"
              }
            ]
          }
        },
        {
          "name": "userAuthority",
          "signer": true,
          "relations": [
            "consent"
          ]
        },
        {
          "name": "bankWallet"
        }
      ],
      "args": [
        {
          "name": "purposeHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "scopeHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "expiry",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "consentAccount",
      "discriminator": [
        129,
        26,
        32,
        122,
        68,
        134,
        146,
        154
      ]
    }
  ],
  "events": [
    {
      "name": "bankAccessLogged",
      "discriminator": [
        61,
        215,
        27,
        196,
        84,
        140,
        6,
        85
      ]
    },
    {
      "name": "consentGranted",
      "discriminator": [
        151,
        98,
        229,
        56,
        36,
        111,
        88,
        46
      ]
    },
    {
      "name": "consentRevoked",
      "discriminator": [
        56,
        245,
        136,
        57,
        212,
        252,
        122,
        43
      ]
    },
    {
      "name": "consentUpdated",
      "discriminator": [
        61,
        124,
        224,
        3,
        170,
        177,
        128,
        187
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "consentNotActive",
      "msg": "This consent is not active (already revoked)."
    },
    {
      "code": 6001,
      "name": "consentExpired",
      "msg": "This consent has expired."
    },
    {
      "code": 6002,
      "name": "unauthorized",
      "msg": "Signer is not authorized to perform this action on this consent."
    },
    {
      "code": 6003,
      "name": "consentIdTooLong",
      "msg": "consent_id exceeds the maximum allowed length."
    }
  ],
  "types": [
    {
      "name": "bankAccessLogged",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "consent",
            "type": "pubkey"
          },
          {
            "name": "bankWallet",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "consentAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "consentId",
            "type": "string"
          },
          {
            "name": "userAuthority",
            "type": "pubkey"
          },
          {
            "name": "bankWallet",
            "type": "pubkey"
          },
          {
            "name": "purposeHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "scopeHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "expiry",
            "type": "i64"
          },
          {
            "name": "grantedAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "lastAccessedAt",
            "type": "i64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "consentStatus"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "consentGranted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "consent",
            "type": "pubkey"
          },
          {
            "name": "consentId",
            "type": "string"
          },
          {
            "name": "userAuthority",
            "type": "pubkey"
          },
          {
            "name": "bankWallet",
            "type": "pubkey"
          },
          {
            "name": "purposeHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "scopeHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "expiry",
            "type": "i64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "consentRevoked",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "consent",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "consentStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "revoked"
          }
        ]
      }
    },
    {
      "name": "consentUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "consent",
            "type": "pubkey"
          },
          {
            "name": "purposeHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "scopeHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "expiry",
            "type": "i64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
