const feedbackDialog = document.querySelector("#feedback-dialog");
const feedbackBtn = document.getElementById("feedback-btn");
const feedbackForm = document.querySelector("#feedback-dialog form");
const feedbackCloseBtn = document.getElementById("feedback-dialog-close");
const feedbackResponse = document.getElementById("feedback-response");

// handle feedback dialog modal
feedbackCloseBtn.onclick = () => feedbackDialog.close();
// enable feedback button toggling
feedbackBtn.onclick = () => {
  if (feedbackDialog.checkVisibility()) feedbackDialog.close();
  else {
    feedbackDialog.show();
    // show feedback form again
    feedbackForm.style.display = "block";
    // hide feedback response
    feedbackResponse.style.display = "none";
  }
};

// send feedback
feedbackForm.onsubmit = async (e) => {
  try {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);
    const message = formdata.get("feedback-msg");
    const res = await apiClient.feedback.create({ message });
    form.reset();
    // hide feedback form
    feedbackForm.style.display = "none";
    // show feedback response
    feedbackResponse.style.display = "block";
    feedbackResponse.textContent = res.message;
  } catch (error) {
    console.error(error.message);
    feedbackResponse.textContent = "Something went wrong.";
  }
};