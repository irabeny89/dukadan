// constants
export const DASHBOARD_ORDER_TAB_LINK = "/dashboard?tab=orders";
export const DASHBOARD_PATH = "/dashboard";
const SETTING_API_PATH = "/api/settings";
const FEEDBACK_API_PATH = "/api/feedbacks";
const ORDER_API_PATH = "/api/orders";
const LOGOUT_API_PATH = "/api/logout";
const LOGIN_CUSTOMER_API_PATH = "/api/customers/login";
const ACCESS_TOKEN_KEY = "access";

const createHeaders = () => {
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  return new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });
};
const findById = async (path, id) => {
  const res = await fetch(`${path}/${id}`, {
    method: "GET",
    headers: createHeaders(),
  });
  return await res.json();
};
const findAll = async (path) => {
  const res = await fetch(`${path}`, {
    method: "GET",
    headers: createHeaders(),
  });
  return await res.json();
};
const create = async (path, body) => {
  const res = await fetch(`${path}`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify(body),
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

const setting = {
  getAll: () => findAll(SETTING_API_PATH),
};
const feedback = {
  getAll: () => findAll(FEEDBACK_API_PATH),
  create: (body) => create(FEEDBACK_API_PATH, body),
};
const order = {
  create: (body) => create(ORDER_API_PATH, body),
};
const auth = {
  logout: async () => {
    const res = await fetch(LOGOUT_API_PATH);
    return await res.json();
  },
  loginCustomer: async (body) => {
    const res = await fetch(LOGIN_CUSTOMER_API_PATH, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return await res.json();
  },
};
export const apiClient = {
  setting,
  feedback,
  order,
  auth,
};

export const convertToNaira = (amount) =>
  `\u20A6${Intl.NumberFormat().format(amount / 100)}`;
