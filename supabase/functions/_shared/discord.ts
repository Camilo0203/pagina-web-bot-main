// Discord OAuth2 and API utilities

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string | null;
  verified?: boolean;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

const DISCORD_API_BASE = 'https://discord.com/api/v10';
const DISCORD_CDN_BASE = 'https://cdn.discordapp.com';

export class DiscordClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCode(code: string): Promise<DiscordTokenResponse> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
    });

    const response = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Discord token exchange failed: ${error}`);
    }

    return await response.json();
  }

  /**
   * Get current user information
   */
  async getCurrentUser(accessToken: string): Promise<DiscordUser> {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch Discord user: ${error}`);
    }

    return await response.json();
  }

  /**
   * Get user's guilds
   */
  async getUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch Discord guilds: ${error}`);
    }

    return await response.json();
  }

  /**
   * Filter guilds where user has MANAGE_GUILD permission
   */
  filterManageableGuilds(guilds: DiscordGuild[]): DiscordGuild[] {
    const MANAGE_GUILD = 0x00000020; // 32 in decimal
    
    return guilds.filter(guild => {
      if (guild.owner) return true;
      
      const permissions = BigInt(guild.permissions);
      return (permissions & BigInt(MANAGE_GUILD)) === BigInt(MANAGE_GUILD);
    });
  }

  /**
   * Get avatar URL for user
   */
  getAvatarUrl(userId: string, avatarHash: string | null, size = 128): string | null {
    if (!avatarHash) return null;
    
    const extension = avatarHash.startsWith('a_') ? 'gif' : 'png';
    return `${DISCORD_CDN_BASE}/avatars/${userId}/${avatarHash}.${extension}?size=${size}`;
  }

  /**
   * Get guild icon URL
   */
  getGuildIconUrl(guildId: string, iconHash: string | null, size = 128): string | null {
    if (!iconHash) return null;
    
    const extension = iconHash.startsWith('a_') ? 'gif' : 'png';
    return `${DISCORD_CDN_BASE}/icons/${guildId}/${iconHash}.${extension}?size=${size}`;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<DiscordTokenResponse> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Discord token refresh failed: ${error}`);
    }

    return await response.json();
  }

  /**
   * Revoke access token
   */
  async revokeToken(accessToken: string): Promise<void> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      token: accessToken,
    });

    const response = await fetch(`${DISCORD_API_BASE}/oauth2/token/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Discord token revocation failed: ${error}`);
    }
  }
}

/**
 * Create Discord OAuth2 authorization URL
 */
export function createAuthorizationUrl(
  clientId: string,
  redirectUri: string,
  scopes: string[] = ['identify', 'email', 'guilds'],
  state?: string
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
  });

  if (state) {
    params.set('state', state);
  }

  return `${DISCORD_API_BASE}/oauth2/authorize?${params.toString()}`;
}

/**
 * Validate Discord webhook signature (for bot webhooks, not OAuth)
 */
export async function validateDiscordWebhook(
  body: string,
  signature: string,
  timestamp: string,
  publicKey: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const message = encoder.encode(timestamp + body);
  
  try {
    const signatureBytes = hexToBytes(signature);
    const publicKeyBytes = hexToBytes(publicKey);
    
    const key = await crypto.subtle.importKey(
      'raw',
      publicKeyBytes,
      { name: 'Ed25519' },
      false,
      ['verify']
    );
    
    return await crypto.subtle.verify(
      'Ed25519',
      key,
      signatureBytes,
      message
    );
  } catch {
    return false;
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
