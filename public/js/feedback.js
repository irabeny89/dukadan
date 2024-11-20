import { apiClient } from "./utils.js";

const feedbackDialog = document.querySelector("#feedback-dialog");
const feedbackBtn = document.getElementById("feedback-btn");
const feedbackForm = document.querySelector("#feedback-dialog form");
const feedbackCloseBtn = document.getElementById("feedback-dialog-close");
const feedbackResponse = document.getElementById("feedback-response");

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
  if (feedbackDialog.checkVisibility()) feedbackDialog.close();
  else {
    feedbackDialog.showModal();
    // show feedback form again
    feedbackForm.style.display = "block";
    // hide feedback response
    feedbackResponse.style.display = "none";
  }
};

// send feedback
feedbackForm.onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const formdata = new FormData(form);
  const message = formdata.get("feedback-msg");
  try {
    const res = await apiClient.feedback.create({ message });
    feedbackResponse.textContent = res.message;
  } catch (error) {
    console.error(error.message);
    feedbackResponse.textContent = "Something went wrong.";
  }
  form.reset();
  // hide feedback form
  feedbackForm.style.display = "none";
  // show feedback response
  feedbackResponse.style.display = "block";
};
