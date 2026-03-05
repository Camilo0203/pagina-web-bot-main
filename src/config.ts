export const config = {
  botName: import.meta.env.VITE_BOT_NAME || 'DiscordBot',
  discordClientId: import.meta.env.VITE_DISCORD_CLIENT_ID || '',
  discordPermissions: import.meta.env.VITE_DISCORD_PERMISSIONS || '8',
  supportServerUrl: import.meta.env.VITE_SUPPORT_SERVER_URL || '',
  dashboardUrl: import.meta.env.VITE_DASHBOARD_URL || '',
  docsUrl: import.meta.env.VITE_DOCS_URL || '',
  statusUrl: import.meta.env.VITE_STATUS_URL || '',
  githubUrl: import.meta.env.VITE_GITHUB_URL || '',
  twitterUrl: import.meta.env.VITE_TWITTER_URL || '',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  siteUrl: import.meta.env.VITE_SITE_URL || '',
};

export function getDiscordInviteUrl(): string {
  if (!config.discordClientId) {
    return '';
  }

  const clientId = encodeURIComponent(config.discordClientId);
  const permissions = encodeURIComponent(config.discordPermissions);

  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot%20applications.commands`;
}
