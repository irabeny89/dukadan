import { Html } from "@elysiajs/html";
import type { StoreT } from "../../pages/dashboard";
import { Feedback } from "../share/feedback";

type PropsT = {
  store: StoreT;
};
export function Options({ store }: PropsT) {
  const isOwnerOrAdmin = ["owner", "admin"].includes(store.user.role);
  return (
    <div id="options">
      <Feedback />
      <small id="setting-btn">{isOwnerOrAdmin ? "Settings" : ""}</small>
    </div>
  );
}
