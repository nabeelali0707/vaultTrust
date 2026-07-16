const rateLimitMap = new Map<string, number[]>();

/**
 * Sliding window rate limiter.
 * Returns true if the user has exceeded the limit within the specified window.
 */
export function isRateLimited(uid: string, limit = 5, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(uid) || [];
  
  // Filter out timestamps older than the window
  const activeTimestamps = timestamps.filter((t) => now - t < windowMs);
  
  if (activeTimestamps.length >= limit) {
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(uid, activeTimestamps);
  return false;
}
