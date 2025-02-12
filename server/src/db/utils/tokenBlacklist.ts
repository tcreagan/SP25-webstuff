//gpt helped

//creates a blacklist of expired tokens
const tokenBlacklist: Set<string> = new Set();

// Add a token to the blacklist
export function addTokenToBlacklist(token: string) {
  tokenBlacklist.add(token);
}

// Check if a token is blacklisted
export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token);
}
