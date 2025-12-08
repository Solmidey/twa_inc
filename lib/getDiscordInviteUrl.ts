export function getDiscordInviteUrl() {
  return (
    process.env.DISCORD_INVITE_URL ||
    process.env.DISCORD_INVITE_LINK ||
    process.env.DISCORD_INVITE ||
    ""
  );
}
