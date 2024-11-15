import { Html } from "@elysiajs/html";
import Modal from "./modal";

const FeedbackForm = () => (
  <>
    <form method="dialog">
      <textarea
        required
        name="feedback-msg"
        placeholder="Enter message here..."
      />
      <button type="submit">send</button>
    </form>
    <div id="feedback-response">
      <p />
    </div>
  </>
);
export function Feedback() {
  return (
    <div>
      <script type="module" src="public/js/feedback.js" />
      <link rel="stylesheet" href="public/css/feedback.css" />
      <Modal
        title="Feedback"
        id="feedback-dialog"
        closeBtnId="feedback-dialog-close"
      >
        <FeedbackForm />
      </Modal>
      <small id="feedback-btn" title="Send a feedback">
        Feedback
      </small>
    </div>
  );
}
