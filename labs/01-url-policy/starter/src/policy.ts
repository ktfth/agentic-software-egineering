// TODO: enforce the acceptance contract described in ../README.md.
export function validateMonitorUrl(input: string): string {
  return new URL(input).href;
}
