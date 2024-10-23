export const decodeJwt = (token) => {
  // jwt format in base64 => header.payload.signature
  const payload = token.split(".")[1];
  const decodedPayloadStr = window.atob(payload);
  // return parseed json data
  return JSON.parse(decodedPayloadStr);
};

export const storeTokens = (data) => {
  if (window && "access" in data && "refresh" in data) {
    window.localStorage.setItem("access", data.access);
    window.sessionStorage.setItem("refresh", data.refresh);
  } else console.error("window or tokens data not found.");
};
