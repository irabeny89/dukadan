import { Html } from "@elysiajs/html";

export function Feedback() {
  return (
    <div>
      <script type="module" src="public/js/feedback.js" />
      <link rel="stylesheet" href="public/css/feedback.css" />
      <dialog id="feedback-dialog">
        <h4>
          <span>Feedback</span>
          <span id="feedback-dialog-close">Close</span>
        </h4>
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
      </dialog>
      <small id="feedback-btn" title="Send a feedback">
        Feedback
      </small>
    </div>
  );
}
