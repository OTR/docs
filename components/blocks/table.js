import React from "react";
import ReactDOMServer from "react-dom/server";
import classNames from "classnames";

import Cloud from "./cloud.js";

import styles from "./table.module.css";

const Table = ({
  head,
  body,
  bodyRows,
  foot,
  footRows,
  additionalClass,
  footers = [],
}) => {
  const createMarkup = (html) => {
    return { __html: html };
  };
  const createTrees = (rows) => {
    return <p>{rows}</p>;
  };

  let trees;
  let thead;
  let tbody;
  let tfoot;

  trees = createTrees(bodyRows);

  if (body && body.title) {
    tbody = (
      <React.Fragment>
        <tr className={classNames(styles.Row, styles.HeadingRow)}>
          <td className={classNames(styles.Cell, styles.TitleCell)} colSpan="2">
            {body.title}
          </td>
        </tr>
        {bodyRows.map((row, index) => (
          <tr key={`${row.title}-${index}`} className={styles.Row}>
            <td className={classNames(styles.Cell, styles.SmallCell)}>
              <div dangerouslySetInnerHTML={createMarkup(row.title)} />{" "}
            </td>
            <td className={classNames(styles.Cell, styles.BigCell)}>
              <div dangerouslySetInnerHTML={createMarkup(row.body)} />
            </td>
          </tr>
        ))}
      </React.Fragment>
    );
  }

  if (head && head.title) {
    thead = (
      <React.Fragment key="thead">
        <tr className={classNames(styles.Row, styles.HeadingRow)}>
          <th className={classNames(styles.Cell, styles.TitleCell)} colSpan="2">
            {head.title}
          </th>
        </tr>
        <tr className={styles.Row}>
          <th
            className={styles.Cell}
            colSpan="2"
            dangerouslySetInnerHTML={createMarkup(head.content)}
          />
        </tr>
      </React.Fragment>
    );
  }

  if (foot && foot.length > 0) {
    tfoot = foot.map((footSection, index) => (
      <React.Fragment key={`tfoot-${index}`}>
        <tr className={classNames(styles.Row, styles.HeadingRow)}>
          <td className={classNames(styles.Cell, styles.TitleCell)} colSpan="2">
            {footSection.title}
          </td>
        </tr>
        {footRows[index].map((row, rowIndex) => (
          <tr key={`${row.title}-${rowIndex}`} className={styles.Row}>
            <td className={classNames(styles.Cell, styles.SmallCell)}>
              <div dangerouslySetInnerHTML={createMarkup(row.title)} />{" "}
            </td>
            <td className={classNames(styles.Cell, styles.BigCell)}>
              <div dangerouslySetInnerHTML={createMarkup(row.body)} />
            </td>
          </tr>
        ))}
      </React.Fragment>
    ));
  }

  return (
    <section className={styles.TableContainer}>
      <table className={classNames(additionalClass, styles.Table)}>
        <thead>{thead}</thead>
        <tbody>{tbody}</tbody>
        <tfoot>{tfoot}</tfoot>
      </table>
      {footers.map((footer, index) => {
        const body = footer.jsx ? (
          footer.body
        ) : (
          <section
            dangerouslySetInnerHTML={createMarkup(insertIframes(footer.body))}
          />
        );
        return (
          <React.Fragment key={`footer-${index}`}>
            <section className={styles.FooterContainer}>
              <h4 className={classNames(styles.TitleCell)} colSpan="2">
                {footer.title}
              </h4>
              {body}
            </section>
          </React.Fragment>
        );
      })}
    </section>
  );
};

// Regex capturing the stoutput iframe directive:
//
//   .. output::
//      https://foo.bar.baz/bleep/bloop?plim=plom
//      height: 5rem; border: 1px solid red;
//
// This Regex defines the following capture groups:
//
//   Description   Group   Example
//   ------------------------------------------------------------
//   domain        $1      "foo.bar.baz"
//   path          $2      "bleep/bloop"
//   query         $3      "plim=plom"
//   styles        $4      "height: 5rem; border: 1px solid red;"
//
const OUTPUT_DIRECTIVE_RE = new RegExp(
  [
    "\\.\\. output::", // ".. output::"
    " *\\n", // Trailing whitespace and newline
    " *", // Indentation
    "https?:\\/\\/", // "https://"
    "([^\\/\\s]+)", // --> Capture domain
    "\\/?", // Path separator "/"
    "([^?\\s]+)?", // --> Capture path
    "\\??", // Query separator "?"
    "([\\S]+)?", // --> Capture query
    " *\\n", // Trailing whitespaces and newline
    " *", // Indentation
    "([^\\n<]+)?", // --> Capture styles (and avoid capturing next HTML tag)
  ].join(""),
  "g",
);

const CLOUD_EMBED_HTML = ReactDOMServer.renderToString(
  <Cloud domain="$1" path="$2" query="$3" stylePlaceholder="$4" />,
);

function insertIframes(htmlStr) {
  return htmlStr.replace(OUTPUT_DIRECTIVE_RE, CLOUD_EMBED_HTML);
}

export default Table;
