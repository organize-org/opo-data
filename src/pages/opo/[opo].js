import React from "react";
import { navigate } from "gatsby";
import { Col, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

import Layout from "../../components/layout/layout";
import SelectState from "../../components/selectState/selectState";
import OpoTable from "../../components/opoTable/opoTable";
import {
  formatOpoName,
  formatOPORank,
  formatNumber,
  formatMoney,
} from "../../utils/utils";

import useDataMaps from "../../hooks/useDataMaps";
import stateContent from "../state/[state].content.yml";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import opoContent from "./[opo].content.yml";

import * as styles from "./opo.module.css";
import ThumnailMap from "../../components/map/thumbnailMap";
import { LegendItem, OPO_PERFORMANCE_TIER_FILL } from "../../components/map/legend";

export default function Opo({ opo }) {
  const [{ opoDataMap }] = useDataMaps();

  const opoData = opoDataMap[opo?.toLocaleUpperCase()];
  if (!opoData) {
    if (!opo) return null;
    navigate("/404");
    return null;
  }

  const { notes } = stateContent;
  const { opoHeadings, stateHeadings, stats, sources } = opoContent;

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
    const formattedData = {
      ethnicity: ethnicityKeys[prefix],
      donors: opoData[prefix + "donors"],
      recovery: opoData[prefix + "recovery"],
      death: opoData[prefix + "death"],
      rank: opoData[prefix + "rank"],
    };
    return [...acc, formattedData];
  }, []);

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
            <ThumnailMap
              dimensions={{ height: "24rem", width: "24rem" }}
              dataId={opo}
              view="opo"
            />
          </Row>
          <Row className={styles.stats}>
            <Row className={styles.statsTier}>
              <Col>
                <h4>
                  <ReactMarkdown>{stats.performance}</ReactMarkdown>
                </h4>
              </Col>
              <Col>
                <LegendItem
                  className={styles[opoData.tier.split(" ")[1]]}
                  background={OPO_PERFORMANCE_TIER_FILL[opoData.tier.split(" ")[1]].fill}
                  text={`Tier ${opoData.tier.split(" ").join(" - ")}`}
                />
              </Col>
            </Row>
            <Row className={styles.statsHeading}>
              <Col>
                <h4>
                  <ReactMarkdown>{stats.rank}</ReactMarkdown>
                </h4>
              </Col>
              <Col>
                <h4 className="red">
                  <ReactMarkdown>{stats.preventable}</ReactMarkdown>
                </h4>
              </Col>
              <Col>
                <h4>
                  <ReactMarkdown>{stats.investigation}</ReactMarkdown>
                </h4>
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
                  {!!opoData.investigation
                    ? <a href={opoData.investigation_url} target="_blank" rel="noreferrer"> Yes <BoxArrowUpRight /> </a>
                    : <p>No</p>
                  }
              </Col>
            </Row>
            <Row className={styles.statsComp}>
              <Col>
                <span className={styles.ceo}>
                  <ReactMarkdown>{stats.ceo}</ReactMarkdown>
                </span>
                {`${opoData.ceo ?? "No Data"} ${
                  opoData.compensation
                    ? `- ${formatMoney(opoData.compensation)}`
                    : ""
                }`}
              </Col>
            </Row>
            <Row className={styles.statsComp}>
              <Col>
                <span className={styles.ceo}>
                  <ReactMarkdown>{stats.board}</ReactMarkdown>
                </span>
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
            headings={opoHeadings}
            opos={ethnicityData}
            title={`${opoData.name} RECOVERY PERFORMANCE DATA by ethnicity (2019)`}
          />
        )}
      </Row>
      <Row className={styles.serviceTable}>
        {inStateOpos.length > 0 && (
          <OpoTable
            headings={stateHeadings}
            opos={inStateOpos}
            title={`OPO PERFORMANCE COMPARISON IN THIS STATE`}
          />
        )}
      </Row>
    </Layout>
  );
}
