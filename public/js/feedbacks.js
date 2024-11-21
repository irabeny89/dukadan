const msgDialog = document.getElementById("message-dialog");
const msgDialogCloseBtn = document.getElementById("message-dialog-close");
const allTr = document.querySelectorAll("tr");

msgDialogCloseBtn.onclick = () => {
  msgDialog.close();
};

document.onclick = (e) => {
  if (e.target === msgDialog) {
    msgDialog.close();
  }
};

allTr.forEach((tr) => {
  tr.onclick = () => {
    const msg = tr.querySelector("[key='2']").textContent;
    const createdAt = tr.querySelector("[key='1']").textContent;
    document.getElementById("message").textContent = msg;
    document.getElementById("createdAt").textContent = createdAt;

    msgDialog.showModal();
  };
});
