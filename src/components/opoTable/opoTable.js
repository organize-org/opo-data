import React from "react";
import { Container, Row, Table } from "react-bootstrap";

import { formatNumber } from "../../utils/utils";

import Tier from "../tier/tier";

import * as styles from "./opoTable.module.css";

const Heading = ({ heading, citation, color }) => (
  <th scope="col" className={color ?? null}>
    {heading}
    {citation && (
      <sup>
        <a
          className={color ?? null}
          href={`#citations-${citation.index}`}
          target="_self"
        >
          {citation.index}
        </a>
      </sup>
    )}
  </th>
);

export default function OpoTable({ headings, inState = true, opos, title }) {
  if (!opos.length) return null;

  return (
    <Row className={styles.opoTable}>
      <Row>
        <h3>{title}</h3>
      </Row>
      <Row>
        <Table striped>
          <thead>
            <tr>
              {inState ? (
                <>
                  <Heading {...headings.name} />
                  <Heading {...headings.region} />
                </>
              ) : (
                <>
                  <Heading {...headings.states} />
                  <Heading {...headings.name} />
                </>
              )}
              <Heading {...headings.tier} />
              <Heading {...headings.donors} />
              <Heading {...{ ...headings.shadow, color: "red" }} />
              {inState && <Heading {...headings.investigation} />}
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
    </Row>
  );
}
