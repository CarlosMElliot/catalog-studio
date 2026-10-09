/** Founder identity comes only from trusted server authentication + runtime config. */
export function isFounderEmail(authenticatedEmail: string | null | undefined, configuredEmail: string | null | undefined): boolean {
  if (!authenticatedEmail?.trim() || !configuredEmail?.trim()) return false;
  return authenticatedEmail.trim().toLowerCase() === configuredEmail.trim().toLowerCase();
}
