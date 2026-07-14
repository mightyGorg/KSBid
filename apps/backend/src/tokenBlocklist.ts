const blocklist = new Set<string>();

export const blockToken = (token: string) => blocklist.add(token);
export const isTokenBlocked = (token: string) => blocklist.has(token);
