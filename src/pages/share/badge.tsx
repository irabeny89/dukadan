import { Html } from "@elysiajs/html";

type PropsT = {
  content: JSX.Element;
};
export default function Badge(props: PropsT) {
  return <div class="badge">{props.content as "safe"}</div>;
}
