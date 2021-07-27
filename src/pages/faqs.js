import React from "react";
import { Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

import Layout from "../components/layout/layout";

import * as styles from "./faqs.module.css";
import content from "./faqs.content.yml";

export default function FAQs({ location }) {
  return (
    <Layout location={location} crumbLabel="FAQs">
      <Row className={styles.faqs}>
        <h2>FAQs</h2>
        {content.sections.map(({ heading, qanda }, i) => (
          <div key={`qanda-${i}`}>
            <h3>{heading}</h3>
            {qanda.map(({ answer, question }, j) => (
              <div key={`qanda-${i}-${j}`}>
                <h4>
                  {j + 1}. {question}
                </h4>
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            ))}
          </div>
        ))}
      </Row>
    </Layout>
  );
}
