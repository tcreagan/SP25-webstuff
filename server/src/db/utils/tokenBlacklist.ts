// Enhanced in-memory token blacklist with expiration support
interface BlacklistEntry {
  token: string;
  expiresAt: number;
}

class TokenBlacklist {
  private blacklist: Map<string, BlacklistEntry>;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.blacklist = new Map();
    // Clean up expired tokens every hour
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  // Add a token to the blacklist with expiration
  addToken(token: string, expiresIn: number = 7 * 24 * 60 * 60 * 1000) {
    const expiresAt = Date.now() + expiresIn;
    this.blacklist.set(token, { token, expiresAt });
  }

  // Check if a token is blacklisted
  isBlacklisted(token: string): boolean {
    const entry = this.blacklist.get(token);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.blacklist.delete(token);
      return false;
    }
    
    return true;
  }

  // Remove a token from the blacklist
  removeToken(token: string) {
    this.blacklist.delete(token);
  }

  // Clean up expired tokens
  private cleanup() {
    const now = Date.now();
    for (const [token, entry] of this.blacklist.entries()) {
      if (now > entry.expiresAt) {
        this.blacklist.delete(token);
      }
    }
  }

  // Get the size of the blacklist
  getSize(): number {
    return this.blacklist.size;
  }

  // Clear the entire blacklist
  clear() {
    this.blacklist.clear();
  }
}

// Create a singleton instance
const tokenBlacklist = new TokenBlacklist();

export function addTokenToBlacklist(token: string, expiresIn?: number) {
  tokenBlacklist.addToken(token, expiresIn);
}

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.isBlacklisted(token);
}

export function removeTokenFromBlacklist(token: string) {
  tokenBlacklist.removeToken(token);
}

export default tokenBlacklist;
