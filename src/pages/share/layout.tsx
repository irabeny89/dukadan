import Head from "./head";
import Header from "./header";
import Footer from "./footer";

type PropsT = {
  /** html head title */
  title: string;
  children: JSX.Element;
  pageCssPath?: string;
};
export default function Layout(props: PropsT) {
  return (
    <html lang="en">
      <Head pageTitle="Home" pageCssPath={props.pageCssPath} />
      <body>
        <Header />
        {props.children as "safe"}
        <Footer />
      </body>
    </html>
  );
}
