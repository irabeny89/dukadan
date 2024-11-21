// constants
export const DASHBOARD_ORDER_TAB_LINK = "/dashboard?tab=orders";
export const DASHBOARD_FEEDBACKS_TAB_LINK = "/dashboard?tab=feedbacks";
export const DASHBOARD_PATH = "/dashboard";
const SETTING_API_PATH = "/api/settings";
const FEEDBACK_API_PATH = "/api/feedbacks";
const ORDER_API_PATH = "/api/orders";
const LOGOUT_API_PATH = "/api/logout";
const LOGIN_CUSTOMER_API_PATH = "/api/customers/login";
const LOGIN_OWNER_API_PATH = "/api/owners/login";
const LOGIN_ADMIN_API_PATH = "/api/admins/login";
const LOGIN_DRIVER_API_PATH = "/api/drivers/login";
const ACCESS_TOKEN_KEY = "access";
const APP_MAIN_SETTING_ID = 1;
const createHeaders = () => {
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  return new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });
};
const findAll = (path) =>
  fetch(`${path}`, {
    method: "GET",
    headers: createHeaders(),
  });

const create = (path, body) =>
  fetch(`${path}`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify(body),
  });

const updateById = (path, id, body) =>
  fetch(`${path}/${id}`, {
    method: "PATCH",
    headers: createHeaders(),
    body: JSON.stringify(body),
  });

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
  update: (body) => updateById(SETTING_API_PATH, APP_MAIN_SETTING_ID, body),
};
const feedback = {
  getAll: () => findAll(FEEDBACK_API_PATH),
  create: (body) => create(FEEDBACK_API_PATH, body),
};
const order = {
  create: (body) => create(ORDER_API_PATH, body),
  update: (id, body) => updateById(ORDER_API_PATH, id, body),
};

const createAuthRequest = (role) => {
  const pathMap = {
    admin: LOGIN_ADMIN_API_PATH,
    customer: LOGIN_CUSTOMER_API_PATH,
    driver: LOGIN_DRIVER_API_PATH,
    owner: LOGIN_OWNER_API_PATH,
  };
  if (role in pathMap)
    return (body) =>
      fetch(pathMap[role], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  throw new Error("role not implemented", role);
};
const auth = {
  logout: async () => {
    const res = await fetch(LOGOUT_API_PATH);
    return await res.json();
  },
  loginOwner: createAuthRequest("owner"),
  loginAdmin: createAuthRequest("admin"),
  loginDriver: createAuthRequest("driver"),
  loginCustomer: createAuthRequest("customer"),
};
export const apiClient = {
  setting,
  feedback,
  order,
  auth,
};

export const convertToNaira = (amount) =>
  `\u20A6${Intl.NumberFormat().format(amount / 100)}`;
