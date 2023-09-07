import React from "react";
import { navigate } from "gatsby";
import { Col, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";

import Layout from "../../components/layout/layout";
import SelectState from "../../components/selectState/selectState";
import OpoTable from "../../components/opoTable/opoTable";
import ThumnailMap from "../../components/map/thumbnailMap";
import {
  LegendItem,
  OPO_PERFORMANCE_TIER_FILL,
} from "../../components/map/legend";
import {
  formatName,
  formatOPORank,
  formatNumber,
  formatMoney,
  getRankedOPOCount,
} from "../../utils/utils";

import News from "../../images/icons/news.svg";
import Data from "../../images/icons/data.svg";

import useDataMaps from "../../hooks/useDataMaps";
import stateContent from "../state/[state].content.yml";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import opoContent from "./[opo].content.yml";

import * as styles from "./opo.module.css";

export default function Opo({ opo }) {
  const { opoDataMap } = useDataMaps();

  const opoData = opoDataMap[opo?.toLocaleUpperCase()];
  if (!opoData) {
    if (!opo) return null;
    navigate("/404");
    return null;
  }

  const { notes } = stateContent;
  const { opoHeadings, stateHeadings, stats, takeaways, videos } = opoContent;

  const opoHeadlines = notes.filter(note =>
    note.tags?.includes(opo.toUpperCase()),
  );

  const opoTakeaways = takeaways.filter(
    takeaway => takeaway.opo === opo.toUpperCase(),
  );

  const opoVideos = videos?.filter(video =>
    video.tags?.includes(opo.toUpperCase()),
  );

  // All states serviced by this OPO
  const thisOPOStates = Object.keys(opoData.statesWithRegions);
  // All opos servicing these same states (for comparison)
  // TODO: if OPO services only one state, compare to OPOs servicing
  // bordering states (see [state].js line)
  //   - All opos servicing bordering states if this OPO only services one

  const comparisonOPOs = Object.values(opoDataMap).filter(opo =>
    thisOPOStates.some(s => !!opo.statesWithRegions[s]),
  );

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

  // Only include state headings in sources if the state comparison
  // table will be displayed on the page (if inStateOpos.length > 0)
  let contentSources = [stats, opoHeadings];
  if (comparisonOPOs.length > 0)
    contentSources = contentSources.concat(stateHeadings);

  return (
    <Layout
      className="opoPage"
      crumbLabel={formatName(opoData)}
      contentWithSources={contentSources}
      social={true}
    >
      {/* OPO Name, top-level stats, select OPO menu, and map */}
      <Row className={styles.hero}>
        <Row>
          <h2 className={styles.title}>{formatName(opoData)}</h2>
        </Row>
        <Row className={styles.region}>
          <Col>
            Region:{" "}
            <strong>
              {Object.entries(opoData.statesWithRegions).map(
                ([state, region], idx) => {
                  const regionStr = !!region ? `${state}: ${region}` : state;

                  return `${regionStr}${
                    idx === Object.keys(opoData.statesWithRegions).length - 1
                      ? ""
                      : ", "
                  }`;
                },
              )}
            </strong>
          </Col>
          <Col lg={7} xs={12}>
            <SelectState
              label={"See OPO performance for:"}
              link={opoData.name}
              opo={true}
            />
          </Col>
        </Row>
        <Row className={styles.mapStats}>
          <Row className={styles.map}>
            <ThumnailMap
              key={opo}
              dimensions={{ height: "24rem", width: "24rem" }}
              dataId={opo.toUpperCase()}
              view="opo"
            />
          </Row>
          <Row className={styles.stats}>
            <Row className={styles.statsTier}>
              <Col>
                <h3>
                  <ReactMarkdown>{stats.tier.title}</ReactMarkdown>
                </h3>
              </Col>
              <Col>
                <LegendItem
                  className={styles[opoData.tier.split(" ")[1]]}
                  background={
                    OPO_PERFORMANCE_TIER_FILL[opoData.tier.split(" ")[1]].fill
                  }
                  text={`Tier ${opoData.tier.split(" ").join(" - ")}`}
                />
              </Col>
            </Row>
            <Row className={styles.statsHeading}>
              <Col>
                <h3>
                  <ReactMarkdown>
                    {stats.rank.title.replace(
                      /XX/,
                      getRankedOPOCount(opoDataMap),
                    )}
                  </ReactMarkdown>
                </h3>
              </Col>
              <Col>
                <h3 className="red">
                  <ReactMarkdown>{stats.shadow.title}</ReactMarkdown>
                </h3>
              </Col>
              <Col>
                <h3>
                  <ReactMarkdown>{stats.investigation.title}</ReactMarkdown>
                </h3>
              </Col>
              <Col>
                <h3>
                  <ReactMarkdown>
                    {stats.investigation_senate.title}
                  </ReactMarkdown>
                </h3>
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
                {!!opoData.investigation ? (
                  <a
                    href={opoData.investigation_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    Yes <BoxArrowUpRight />{" "}
                  </a>
                ) : (
                  <p>No</p>
                )}
              </Col>
              <Col>
                {!!opoData.investigation_senate ? (
                  <>
                    {/* <a
                    href={opoData.investigation_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    Yes <BoxArrowUpRight />{" "}
                  </a> */}
                    <p>Yes</p>
                  </>
                ) : (
                  <p>No</p>
                )}
              </Col>
            </Row>
            <div className={styles.statsDivider}></div>
            <Row className={styles.statsComp}>
              <Col>
                <span className={styles.ceo}>
                  <ReactMarkdown>{stats.ceo.title}</ReactMarkdown>
                </span>
                <b>
                  {`${opoData.ceo ?? "No Data"} ${
                    opoData.compensation
                      ? `- ${formatMoney(opoData.compensation)}`
                      : ""
                  }`}
                </b>
              </Col>
            </Row>
            <Row className={styles.statsComp}>
              <Col>
                <span className={styles.ceo}>
                  <ReactMarkdown>{stats.board.title}</ReactMarkdown>
                </span>
                <b>{opoData.board ?? "No Data"}</b>
              </Col>
            </Row>
          </Row>
        </Row>
      </Row>
      <div className={styles.opoContent}>
        {/* Headlines about OPO */}
        {opoHeadlines?.length || opoTakeaways?.length || opoVideos?.length ? (
          <h2 className={styles.sectionHeader}>
            <News />
            ABOUT THIS OPO
          </h2>
        ) : null}
        <Row className={styles.about}>
          {opoTakeaways?.length ? (
            <>
              <h3>Key takeaways for {opoData.name}</h3>
              <Row>
                <ul>
                  {opoTakeaways.map(({ body }, i) => (
                    <li key={`opo-takeaway-${i}`}>
                      <ReactMarkdown>{body}</ReactMarkdown>
                    </li>
                  ))}
                </ul>
              </Row>
            </>
          ) : null}
          {opoHeadlines?.length ? (
            <>
              <h3>News and notes</h3>
              <Row>
                <ul>
                  {opoHeadlines.map(({ note }, i) => (
                    <li key={`statewide-note-${i}`}>
                      <ReactMarkdown>{note}</ReactMarkdown>
                    </li>
                  ))}
                </ul>
              </Row>
            </>
          ) : null}
          {opoVideos?.length
            ? opoVideos.map(({ link, title, description }, i) => (
                <Row key={`opo-videos-${i}`} className={styles.video}>
                  <ReactPlayer url={link} width={594} height={361} />
                  <h4>{title}</h4>
                  {description && (
                    <ReactMarkdown className={styles.description}>
                      {description}
                    </ReactMarkdown>
                  )}
                </Row>
              ))
            : null}
        </Row>
        {opoHeadlines?.length || opoTakeaways?.length ? <hr /> : null}
        {/* Ethnicity data */}
        <h2 className={styles.sectionHeader}>
          {" "}
          <Data /> OPO DATA
        </h2>
        <Row className={styles.opoTables}>
          <Row>
            {ethnicityData.length > 0 && (
              <OpoTable
                headings={opoHeadings}
                opos={ethnicityData}
                title={`${opoData.name} procurement performance data by ethnicity (2019) — note: 2020 data will be updated as it becomes available`}
              />
            )}
          </Row>
          <Row>
            {comparisonOPOs.length > 0 ? (
              <OpoTable
                headings={stateHeadings}
                opos={comparisonOPOs}
                title={`OPO performance comparison`}
              />
            ) : null}
          </Row>
        </Row>
      </div>
    </Layout>
  );
}
