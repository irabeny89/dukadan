type PropsT = {
  pageTitle: string;
  pageCssPath?: string;
};
export default function Head(props: PropsT) {
  return (
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title safe>Dukadan | {props.pageTitle}</title>
      <link rel="stylesheet" href="public/css/styles.css" />
      <link rel="stylesheet" href={props.pageCssPath} />
    </head>
  );
}
