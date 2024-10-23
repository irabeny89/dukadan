import { decodeJwt } from "./utils.js";

try {
  const accessToken = window.localStorage.getItem("access");
  if (!accessToken) throw new Error("Token not found with name `access`");
  const user = decodeJwt(accessToken);
  document.getElementById("greeting").textContent = `Welcome ${user.username}`;
} catch (error) {
  console.error(error.message);
  // redirect to home page
  document.location.href = "/?error=true";
}
