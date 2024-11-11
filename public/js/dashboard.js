const DASHBOARD_ORDER_TAB_LINK = "/dashboard?tab=orders";

const searchParams = new URLSearchParams(window.location.search);

const addOrderBtn = document.getElementById("order-add");
const refillDialog = document.getElementById("refill-dialog");
const refillCloseBtn = document.getElementById("refill-dialog-close");
const refillForm = document.querySelector("#refill-dialog form");
const refillResponse = document.getElementById("refill-response");

refillCloseBtn.onclick = refillDialog.close();

addOrderBtn.onclick = () => {
  if (refillDialog.checkVisibility()) refillDialog.close();
  else {
    refillDialog.show();
    // show refill form
    refillForm.style.display = "block";
    // hide refill response
    refillResponse.style.display = "none";
  }

  // try {
  //   const res = await apiClient.order.create({
  //     cylinderSize: 5,
  //     fullAddress: "Elepe, along Ijede rd",
  //     phone: "09020951797",
  //   });
  //   alert(res.message);
  // } catch (error) {
  //   alert(error.message);
  //   console.error(error);
  // }
};

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
