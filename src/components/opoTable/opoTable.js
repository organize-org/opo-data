import React from "react";
import { Container, Row, Table } from "react-bootstrap";

import { formatNumber } from "../../utils/utils";

import Tier from "../tier/tier";

import * as styles from "./opoTable.module.css";

export default function OpoTable({
  citations,
  headings,
  inState = true,
  opos,
  title,
}) {
  if (!opos.length) return null;

  const Heading = ({ color, title }) => (
    <th scope="col" className={color ?? null}>
      {headings[title].heading}
      {citations[title] && (
        <sup>
          <a
            className={color ?? null}
            href={`#citations-${citations[title].index}`}
            target="_self"
          >
            {citations[title].index + 1}
          </a>
        </sup>
      )}
    </th>
  );

  return (
    <Row className={styles.opoTable}>
      <h3>{title}</h3>
      <Table striped>
        <thead>
          <tr>
            {inState ? (
              <>
                <Heading title="name" />
                <Heading title="region" />
              </>
            ) : (
              <>
                <Heading title="states" />
                <Heading title="name" />
              </>
            )}
            <Heading title="tier" />
            <Heading title="donors" />
            <Heading title="shadow" color="red" />
            {inState && <Heading title="investigation" />}
          </tr>
        </thead>
        <tbody>
          {opos.map(
            ({
              donors,
              investigation,
              name,
              region,
              shadows,
              states,
              tier,
            }) => (
              <tr key={name}>
                {inState ? (
                  <>
                    <td>{name}</td>
                    <td>{region}</td>
                  </>
                ) : (
                  <>
                    <td>{states}</td>
                    <td>{name}</td>
                  </>
                )}
                <td>
                  <Container>
                    <Tier className={styles.tierCol} tier={tier} />
                  </Container>
                </td>
                <td className="text-center">{formatNumber(donors)}</td>
                <td className={styles.shadows}>{formatNumber(shadows)}</td>
                {inState && (
                  <td className="text-center">
                    {investigation ? "Yes" : "--"}
                  </td>
                )}
              </tr>
            )
          )}
        </tbody>
      </Table>
    </Row>
  );
}
