import { apiClient } from "./utils.js";

const feedbackDialog = document.querySelector("#feedback-dialog");
const feedbackBtn = document.getElementById("feedback-btn");
const feedbackForm = document.querySelector("#feedback-dialog form");
const feedbackCloseBtn = document.getElementById("feedback-dialog-close");

feedbackDialog.onclick = (e) => {
  const rect = feedbackDialog.getBoundingClientRect();
  const isInDialog =
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width;

  if (!isInDialog) {
    feedbackDialog.close();
  }
};
// handle feedback dialog modal
feedbackCloseBtn.onclick = () => feedbackDialog.close();
// enable feedback button toggling
feedbackBtn.onclick = () => {
  feedbackDialog.showModal();
};

// send feedback
feedbackForm.onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const formdata = new FormData(form);
  const message = formdata.get("feedback-msg");
  const res = await apiClient.feedback.create({ message });
  if (res.ok) {
    form.reset();
    const data = await res.json();
    alert(data.message);
    feedbackDialog.close();
  } else alert("Something went wrong. Contact support.");
};
