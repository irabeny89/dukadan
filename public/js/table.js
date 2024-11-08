const searchParams = new URLSearchParams(window.location.search);
const currPage = searchParams.get("page");

const prevBtn = document.getElementById("previous-button");
const nextBtn = document.getElementById("next-button");

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
