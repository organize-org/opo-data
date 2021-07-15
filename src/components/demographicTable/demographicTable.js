import React from "react";
import { Row, Table } from "react-bootstrap";

import { racialDemographics, formatPercent } from "../../utils/utils";

import * as styles from "./demographicTable.module.css";

export default function DemographicTable({ opos }) {
  // Show table if some non-0 data
  if (
    !opos.length ||
    !opos.some(opo =>
      Object.keys(racialDemographics).some(demographic => opo[demographic])
    )
  )
    return null;

  return (
    <Row className={styles.demographicsTable}>
      <Row>
        <h3>Organs Received Compared to Potential Organs By Ethnicity</h3>
        <h4>See disparities in how OPOs serve patients in need of organs.</h4>
      </Row>
      <Row>
        <Table striped>
          <thead>
            <tr>
              <th scope="col">Ethnicity</th>
              {opos.map(({ name }) => (
                <th scope="col" key={name}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(racialDemographics).map(([key, value]) => (
              <tr key={key}>
                <td>{value}</td>
                {opos.map(opo => (
                  <td key={`${opo.name}-${key}`}>{formatPercent(opo[key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Row>
  );
}
