import React from "react";
import { Container, Row, Table } from "react-bootstrap";

import { formatNumber } from "../../utils/utils";

import Tier from "../tier/tier";

import * as styles from "./opoTable.module.css";

export default function OpoTable({ citeIndex, opos, inState = true, heading }) {
  if (!opos.length) return null;

  return (
    <Row className={styles.opoTable}>
      <Row>
        <h3>{heading}</h3>
      </Row>
      <Row>
        <Table striped>
          <thead>
            <tr>
              {inState ? (
                <>
                  <th scope="col">OPO Name</th>
                  <th scope="col">Region</th>
                </>
              ) : (
                <>
                  <th scope="col">States</th>
                  <th scope="col">OPO Name</th>
                </>
              )}
              <th scope="col">Tier (2019)</th>
              <th scope="col" className="center">
                Donors Needed{citeIndex[3]}
              </th>
              <th scope="col" className={`red center`}>
                Shadow Deaths {citeIndex[0]}
              </th>
              {inState && <th scope="col">Under Investigation</th>}
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
      {/* {citation && (
        <Row>
          <h4 className="red">{citationsByHeading.shadows.citation}</h4>
        </Row>
      )} */}
    </Row>
  );
}
