// Public demo credentials only; never use this matching rule for real accounts.
export function validDemoCredentials(username: unknown, password: unknown): boolean {
  const matches = (value: unknown) => typeof value === 'string' && value.trim().toLowerCase() === 'admin';
  return matches(username) && matches(password);
}
