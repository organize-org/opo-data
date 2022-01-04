import React from "react";
import { Col, Row } from "react-bootstrap";
import { graphql, navigate } from "gatsby";
import ReactMarkdown from "react-markdown";

import Layout from "../../components/layout/layout";
import Map from "../../components/map/map";
import SelectState from "../../components/selectState/selectState";
import OpoTable from "../../components/opoTable/opoTable";
import Tier from "../../components/tier/tier";
import {
  formatOpoName,
  formatOPORank,
  formatNumber,
  formatMoney,
} from "../../utils/utils";

import * as styles from "./opo.module.css";
import useDataMaps from "../../hooks/useDataMaps";
import content from "../state/[state].content.yml";

export default function Opo({ data: { oposGeoData }, opo }) {
  const [{ opoDataMap, stateDataMap }] = useDataMaps();

  const opoData = opoDataMap[opo?.toLocaleUpperCase()];
  if (!opoData) {
    if (!opo) return null;
    navigate("/404");
    return null;
  }

  const { headings, notes, stats, sources } = content;
  const ethnicityHeadings = {
    ethnicity: "Ethnicity",
    donors: "Number of Donors",
    recovery: "Recovery Rate",
    death: "CALC Deaths",
  };

  const opoHeadlines = notes.filter(note =>
    note.tags?.includes(opo.toUpperCase())
  );

  const inStateOpos = Object.values(opoDataMap)
    .filter(
      opoFromMap =>
        opoFromMap.statesWithRegions[opoData.states.split(" ")[0]] !== undefined
    )
    .map(opoFromMap => ({
      ...opoFromMap,
      region: opoFromMap.statesWithRegions[opoData.states.split(" ")[0]],
    }));

  const ethnicityKeys = {
    nhw_: "Non-Hispanic White",
    nhb_: "Non-Hispanic Black",
    h_: "Hispanic",
    a_: "Asian",
  };
  const ethnicityData = ["nhw_", "nhb_", "h_", "a_"].reduce((acc, prefix) => {
    const data = Object.fromEntries(
      Object.entries(opoData).filter(([key]) => key.includes(prefix))
    );
    const formattedData = {
      ethnicity: ethnicityKeys[prefix],
      donors: opoData[prefix + "donors"],
      recovery: opoData[prefix + "recovery"],
      death: opoData[prefix + "death"],
    };
    return [...acc, formattedData];
  }, []);

  console.log("ethnicityData", ethnicityData);
  console.log("opoDataMap", opoDataMap);
  console.log("opoData", opoData);
  console.log("inStateOpos", inStateOpos);

  return (
    <Layout crumbLabel={formatOpoName(opoData)} sources={sources} social={true}>
      <Row className={styles.hero}>
        <Row>
          <h2 className={styles.title}>{formatOpoName(opoData)}</h2>
        </Row>
        <Row className={styles.region}>
          <span>
            Region: <strong>{opoData.states}</strong>
          </span>
          <div className={styles.navToOpo}>
            <SelectState
              label={"See OPO performance for:"}
              link={opoData.name}
              opo={true}
            />
          </div>
        </Row>
        <Row className={styles.mapStats}>
          <Row className={styles.map}>
            <Map
              dimensions={{ height: "24rem", width: "24rem" }}
              opo={opo}
              zoomControl={false}
            />
          </Row>
          <Row className={styles.stats}>
            <Row className={styles.statsTier}>
              <Col>
                <h3>Performance Tier (2019)</h3>
              </Col>
              <Col>
                <Tier
                  className={styles[opoData.tier.split(" ")[1]]}
                  tier={opoData.tier.split(" ")[1]}
                  altText={`Tier ${opoData.tier.split(" ").join(" - ")}`}
                />
              </Col>
            </Row>
            <Row className={styles.statsHeading}>
              <Col>
                <h3>OPO Rank (of {Object.keys(opoDataMap).length})</h3>
              </Col>
              <Col>
                <h3 className="red">Preventable Deaths (2019)</h3>
              </Col>
              <Col>
                <h3>Under Congressional Investigation</h3>
              </Col>
            </Row>
            <Row className={styles.statsPopout}>
              <Col>
                <p>{formatOPORank(opoData)}</p>
              </Col>
              <Col>
                <p className="red">{formatNumber(opoData.shadows)}</p>
              </Col>
              <Col>
                <p>
                  {opoData.investigation
                    ? "Yes"
                    : opoData.investigation === null
                    ? "No Data"
                    : "No"}
                </p>
              </Col>
            </Row>
            <Row className={styles.statsComp}>
              <Col>
                <span className={styles.ceo}> CEO & Compensation: </span>
                {opoData.ceo ?? "No Data"}{" "}
                {opoData.compensation
                  ? `- ${formatMoney(opoData.compensation)}`
                  : ""}
              </Col>
            </Row>
            <Row className={styles.statsComp}>
              <Col>
                <span className={styles.ceo}>Board Compensation: </span>
                {opoData.board ?? "No Data"}
              </Col>
            </Row>
          </Row>
        </Row>
      </Row>
      {opoHeadlines?.length > 0 && (
        <Row className={styles.headlines}>
          <Row>
            <h3>HEADLINES</h3>
          </Row>
          <Row>
            <ul>
              {opoHeadlines.map(({ note }, i) => (
                <li key={`statewide-note-${i}`}>
                  <ReactMarkdown>{note}</ReactMarkdown>
                </li>
              ))}
            </ul>
          </Row>
          <hr />
        </Row>
      )}
      <Row className={styles.ethnicityTable}>
        {ethnicityData.length > 0 && (
          <OpoTable
            inState={false}
            inOpo={true}
            headings={ethnicityHeadings}
            opos={ethnicityData}
            title={`${opoData.name} RECOVERY PERFORMANCE DATA by ethnicity (2019)`}
          />
        )}
      </Row>
      <Row className={styles.serviceTable}>
        {inStateOpos.length > 0 && (
          <OpoTable
            headings={headings}
            opos={inStateOpos}
            title={`OPO PERFORMANCE COMPARISON IN THIS STATE`}
          />
        )}
      </Row>
    </Layout>
  );
}

export const query = graphql`
  query {
    oposGeoData: file(relativePath: { eq: "data/dsas.geojson" }) {
      childGeoJson {
        features {
          geometry {
            type
            coordinates
          }
          properties {
            opo
          }
          type
        }
      }
    }
  }
`;
