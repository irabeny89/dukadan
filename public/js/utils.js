const BASE_URL = "http://127.0.0.1:3000";
const ACCESS_TOKEN_KEY = "access";

const createHeaders = () => {
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  return new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });
};
const findById = async (path, id) => {
  const res = await fetch(`${BASE_URL}${path}/${id}`, {
    method: "GET",
    headers: createHeaders(),
  });
  return await res.json();
};
const findAll = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: createHeaders(),
  });
  return await res.json();
};

/**
 * Decode and returns the encoded payload in a token.
 * @param {string} token JWt token
 * @returns parsed payload
 */
export const decodeJwt = (token) => {
  // jwt format in base64 => header.payload.signature
  const payload = token.split(".")[1];
  const decodedPayloadStr = window.atob(payload);
  // return parsed json data
  return JSON.parse(decodedPayloadStr);
};

/**
 * Stores access and refresh token on browser storage or memory.
 * @param {object} data access & refresh tokens
 */
export const storeTokens = (data) => {
  if (window && "access" in data && "refresh" in data) {
    window.localStorage.setItem("access", data.access);
    window.sessionStorage.setItem("refresh", data.refresh);
  } else console.error("window or tokens data not found.");
};

const settings = {
  getAll: () => findAll("/api/settings"),
};

export const apiClient = {
  settings,
};

export const convertToNaira = (amount) =>
  `\u20A6${Intl.NumberFormat().format(amount / 100)}`;
