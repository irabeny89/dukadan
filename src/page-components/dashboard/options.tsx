import { Html } from "@elysiajs/html";
import type { StoreT } from "../../pages/dashboard";
import { Feedback } from "../share/feedback";
import Logout from "../share/logout";

type PropsT = {
  store: StoreT;
};
export function Options({ store }: PropsT) {
  const isOwnerOrAdmin = ["owner", "admin"].includes(store.user.role);
  return (
    <div id="options">
      {isOwnerOrAdmin ? null : <Feedback />}
      <Logout />
    </div>
  );
}
