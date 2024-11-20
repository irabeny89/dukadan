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
  const feedbacks = Feedback.findAll();
  if (!feedbacks.length) return renderNoFeedbackYet();

  const { data, metadata } = paginator(feedbacks, {
    page: +(query.page ?? 1),
    pageSize: +(query.pagesize ?? 10),
  });
  const tableFeedbacks = data.map(
    ({ id, updatedAt, userId, createdAt, ...rest }) => {
      return {
        username: Customer.findById(userId)?.username,
        createdAt: new Date(createdAt ?? "").toLocaleString(),
        ...rest,
      };
    },
  );
  const headerTitles: string[] = createTitleFromObjectKeys(tableFeedbacks[0]);
  const bodyRows = tableFeedbacks.map(Object.values);

  return (
    <div>
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
        headerTitles={headerTitles}
        bodyRows={bodyRows}
        hasNextPage={metadata.hasNextPage}
        hasPrevPage={metadata.hasPrevPage}
        page={metadata.page}
        pageCount={metadata.pageCount}
        pageSize={metadata.pageSize}
        totalItems={metadata.totalItems}
        allowAdd={false}
        allowDelete={false}
      />
    </div>
  );
}
