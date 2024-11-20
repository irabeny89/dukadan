const searchParams = new URLSearchParams(window.location.search);
const currPage = searchParams.get("page");

const allTr = document.querySelectorAll("tr");
const prevBtn = document.getElementById("previous-button");
const nextBtn = document.getElementById("next-button");
const pagingNumbers = document.querySelectorAll("[id^=table_pager_]");
const msgDialog = document.getElementById("message-dialog");
const msgDialogCloseBtn = document.getElementById("message-dialog-close");

// add click event to navigate on every page numbers on pagination
pagingNumbers.forEach((el) => {
  el.addEventListener("click", () => {
    searchParams.set("page", el.textContent);
    window.location.search = searchParams;
  });
});

allTr.forEach((tr) => {
  tr.onclick = () => {
    const msg = tr.querySelector("[key='2']").textContent;
    const createdAt = tr.querySelector("[key='1']").textContent;
    document.getElementById("message").textContent = msg;
    document.getElementById("createdAt").textContent = createdAt;

    msgDialog.showModal();
  };
});

msgDialogCloseBtn.onclick = () => {
  msgDialog.close();
};

document.onclick = (e) => {
  if (e.target === msgDialog) {
    console.log(e.target);
    msgDialog.close();
  }
};

prevBtn.onclick = () => {
  if (currPage > 1) {
    searchParams.set("page", +currPage - 1);
    window.location.search = searchParams;
  }
};

nextBtn.onclick = () => {
  if (currPage >= 0) {
    searchParams.set("page", +currPage + 1);
    window.location.search = searchParams;
  }
};
