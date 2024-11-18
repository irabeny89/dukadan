import { Html } from "@elysiajs/html";
import type { PropsT } from "../../../pages/dashboard";
import { Orders } from "./orders";

export const TabBody = ({ query, store }: PropsT) => {
  if (query.tab === "orders") return <Orders query={query} store={store} />;
  if (query.tab === "feedbacks")
    return (
      <div>
        No feedback implementation yet
        {/* <Table
          cssId="feedback-table"
          headerTitles={headerTitles}
          bodyRows={bodyRows}
          hasNextPage={metadata.hasNextPage}
          hasPrevPage={metadata.hasPrevPage}
          page={metadata.page}
          pageCount={metadata.pageCount}
          pageSize={metadata.pageSize}
          title="Orders"
          totalItems={metadata.totalItems}
          allowAdd={true}
          allowDelete={false}
        /> */}
      </div>
    );
  return null;
};
