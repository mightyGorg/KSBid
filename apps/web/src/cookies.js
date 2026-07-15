const KEY = "auth_token";
const AGE = 3600;

export const getToken = () => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${KEY}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
};

export const setToken = (t) =>
  (document.cookie = `${KEY}=${encodeURIComponent(t)}; max-age=${AGE}; path=/; SameSite=Strict`);

export const clearToken = () =>
  (document.cookie = `${KEY}=; max-age=0; path=/; SameSite=Strict`);
