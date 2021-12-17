import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { Link } from "gatsby";

import Layout from "../components/layout/layout";

import * as styles from "./404.module.css";

export default function NotFound() {
  const [isMount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!isMount) {
    return <h2>Loading...</h2>;
  }

  return (
    <Layout crumbLabel="Page Not Found">
      <div className={styles.error}>
        <Row>
          <h3>404</h3>
        </Row>
        <Row>
          <h4>Not Found</h4>
        </Row>
        <Row>
          <p>We could not find the requested resource.</p>
        </Row>
        <Row>
          <p>
            <Link to="/">Head back to the main site</Link>
          </p>
        </Row>
      </div>
    </Layout>
  );
}
