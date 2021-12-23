import React from "react";
import { Col, Row } from "react-bootstrap";
import { graphql, navigate } from "gatsby";

import Layout from '../../components/layout/layout'
import Map from "../../components/map/map";
import SelectState from "../../components/selectState/selectState";
import { formatOpoName, formatOPORank, formatNumber } from "../../utils/utils";

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

    const opoHeadlines = notes.filter( note => note.tags?.includes(opo.toUpperCase()))

    console.log("opoHeadlines", opoHeadlines);
    console.log("oposGeoData", oposGeoData);
    console.log("opoDataMap", opoDataMap);
    console.log("opoData", opoData);

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
              dimensions={{ height: "16rem", width: "24rem" }}
              opo={opoData}
              zoomControl={false}
            />
          </Row>
          <Row className={styles.stats}>
            <Row className={styles.statsHeading}>
              <Col>
                <h3>OPO Rank (of {oposGeoData.length})</h3>
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
                <p>{opoData.investigation ? "Yes" : opoData.investigation === null ? "No Data" : "No"}</p>
              </Col>
            </Row>
          </Row>
        </Row>
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