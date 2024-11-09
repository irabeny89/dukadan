const searchParams = new URLSearchParams(window.location.search);
const currPage = searchParams.get("page");

const prevBtn = document.getElementById("previous-button");
const nextBtn = document.getElementById("next-button");
const pagingNumbers = document.querySelectorAll("[id^=table_pager_]");
// add click event to navigate on every page numbers on pagination
pagingNumbers.forEach((el) => {
  el.addEventListener("click", () => {
    searchParams.set("page", el.textContent);
    window.location.search = searchParams;
  });
});

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
