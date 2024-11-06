import { Html } from "@elysiajs/html";
import type { StoreT } from "../../pages/dashboard";

type Props = {
  store: StoreT;
};
export function Greeting({ store }: Props) {
  const adminEmoji = "👮🏽";
  const customerEmoji = "😎";
  const driverEmoji = "🚚";
  const ownerEmoji = "🫅🏿";
  const userEmoji =
    store.user?.role === "admin"
      ? adminEmoji
      : store.user?.role === "customer"
        ? customerEmoji
        : store.user?.role === "driver"
          ? driverEmoji
          : ownerEmoji;

  return (
    <h4 id="greeting">
      Welcome{" "}
      <span safe id="username">
        {`${store.user?.username} ${userEmoji}`}
      </span>
    </h4>
  );
}
