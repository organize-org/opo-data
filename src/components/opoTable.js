import React from "react";
import { Row, Table } from "react-bootstrap";

import Tier from "./tier";

export default function OpoTable({ citation, opos, inState = true, heading }) {
  return (
    <Row className="opo-table">
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
              <th scope="col" className="text-center">
                Donors Needed
              </th>
              <th scope="col" className={`text-center red`}>
                Shadow Deaths*
              </th>
            </tr>
          </thead>
          <tbody>
            {opos.map(({ donors, name, region, shadows, states, tier }) => (
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
                <td className="tierCol">
                  <Tier tier={tier} />
                </td>
                <td className="text-center">{donors ?? "----"}</td>
                <td>{shadows ?? "----"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      {citation && (
        <Row>
          <h4 className="red">{citation}</h4>
        </Row>
      )}
    </Row>
  );
}
