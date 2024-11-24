import { Html } from "@elysiajs/html";
import paginator from "../../../lib/paginator";
import { Customer } from "../../../models/customer.model";
import { Feedback } from "../../../models/feedback.model";
import type { QueryT } from "../../../pages/dashboard";
import { convertToNaira, createTitleFromObjectKeys } from "../../../utils";
import Modal from "../../share/modal";
import Table from "../../share/table";

type FeedbackPropsT = {
  query: QueryT;
};
const MessageDisplay = () => (
  <div>
    <p id="message" safe />
    <hr />
    <small id="createdAt" safe />
  </div>
);

const renderNoFeedbackYet = () => {
  return (
    <div style="text-align:center">
      <p>No feedback yet.</p>
    </div>
  );
};

export function Feedbacks({ query }: FeedbackPropsT) {
  const { data: feedbacks, metadata } = Feedback.findAll();
  if (!feedbacks.length) return renderNoFeedbackYet();

  const data = feedbacks
    .reverse()
    .map(({ id, updatedAt, userId, createdAt, ...rest }) => {
      return {
        id,
        username: Customer.findById(userId)?.username,
        createdAt: new Date(createdAt ?? "").toLocaleString(),
        ...rest,
      };
    });

  return (
    <div>
      <script type="module" src="public/js/feedbacks.js" />

      <Modal
        id="message-dialog"
        closeBtnId="message-dialog-close"
        title="Feedback"
      >
        <MessageDisplay />
      </Modal>

      <Table
        title="Feedbacks"
        cssId="feedback-table"
        cssAddId=""
        data={data}
        metadata={metadata}
        page={query.page}
        pageSize={query.size}
        allowAdd={false}
        allowDelete={false}
      />
    </div>
  );
}
