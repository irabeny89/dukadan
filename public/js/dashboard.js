const DASHBOARD_ORDER_TAB_LINK = "/dashboard?tab=orders";

const searchParams = new URLSearchParams(window.location.search);

// handle tabs selection
const orderTable = document.getElementById("order");
const ordersTabMarker = document.getElementById("radio-1");
// add other tabs
// const profileTabMarker = document.getElementById("radio-2"); //e.g

// order tab
if (searchParams.get("tab") === "orders") {
  ordersTabMarker.checked = true;
  orderTable.style.display = "block";
}

// clicking order tab event
ordersTabMarker.onclick = (e) => {
  window.location.href = DASHBOARD_ORDER_TAB_LINK;
};
// profileTabMarker.onclick = (e) => {
//   // disable other tabs
//   // ordersTabMarker.checked = false;
//   e.target.checked = true;
//   orderTable.style.display = "none";
// };
