export function validateMonitorUrl(input: string): string {
  const url = new URL(input);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only HTTP and HTTPS URLs are supported');
  }
  if (url.username || url.password) throw new Error('Credentials are forbidden');
  url.hash = '';
  return url.href;
}
