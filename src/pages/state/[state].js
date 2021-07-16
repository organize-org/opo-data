import React from "react";
import { Col, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import { graphql, navigate } from "gatsby";
import booleanIntersects from "@turf/boolean-intersects";

import DemographicTable from "../../components/demographicTable/demographicTable";
import Layout from "../../components/layout/layout";
import Map from "../../components/map/map";
import OpoTable from "../../components/opoTable/opoTable";
import Social from "../../components/social/social";
import useDataMaps from "../../hooks/useDataMaps";
import {
  findStateFeature,
  formatStateName,
  formatNumber,
} from "../../utils/utils";

import * as styles from "./state.module.css";
import content from "./[state].content.yml";

export default function Dashboard({ data: { statesGeoData }, state = "DC" }) {
  const [{ opoDataMap, stateDataMap }] = useDataMaps();

  const notesByOpo = content?.notes?.reduce(
    (notesMap, { note, tags }) => ({
      ...notesMap,
      ...tags.reduce(
        (_, tag) => ({ [tag]: [...(notesMap[tag] ?? []), note] }),
        {}
      ),
    }),
    {}
  );

  // Find associated state data and feature by abbreviation, redirect if not found
  const stateData = stateDataMap[state.toLocaleUpperCase()];
  if (!stateData) {
    navigate("/404");
    return null;
  }
  stateData.feature = findStateFeature(statesGeoData, stateData.abbreviation);

  // Use Turf to find bordering states by their geojson polygon
  const borderingStates = statesGeoData?.childGeoJson?.features
    ?.filter(feature => booleanIntersects(stateData.feature, feature))
    ?.map(({ properties: { abbreviation } }) => abbreviation);

  // Filter into in- and out-of-state (or neither); add region and notes (in), or formatted state list (out)
  const { inStateOpos, outOfStateOpos } = Object.values(opoDataMap).reduce(
    (filter, opo) => {
      // In state
      if (opo.statesWithRegions[stateData.abbreviation] !== undefined) {
        return {
          ...filter,
          inStateOpos: [
            ...filter.inStateOpos,
            {
              ...opo,
              // Add notes and region
              notes: notesByOpo[opo.opo],
              region: opo.statesWithRegions[stateData.abbreviation],
            },
          ],
        };
      } else if (borderingStates?.some(bs => opo.statesWithRegions[bs])) {
        // Out of state (but nearby)
        return {
          ...filter,
          outOfStateOpos: [
            ...filter.outOfStateOpos,
            // Add formatted state list
            { ...opo, states: Object.keys(opo.statesWithRegions).join(", ") },
          ],
        };
      } else {
        // Else, not nearby
        return filter;
      }
    },
    { inStateOpos: [], outOfStateOpos: [] }
  );

  // Popout stats
  const comps = inStateOpos
    .map(({ compensation }) => compensation)
    .filter(comp => !isNaN(comp));
  stateData.popoutStats = {
    avgCeoComp: comps.length
      ? Math.floor(comps.reduce((sum, comp) => sum + comp, 0) / comps.length)
      : 0,
    monthlyDead: stateData.monthly,
    waitlist: parseInt(stateData.waitlist),
  };
  // State-level the notes and videos
  stateData.notes = content?.notes?.filter(({ tags }) =>
    tags.includes(stateData.abbreviation)
  );
  stateData.videos = content?.videos?.filter(({ tags }) =>
    tags.includes(stateData.abbreviation)
  );

  return (
    <Layout>
      <Row className={styles.title}>
        <Col>
          <h2>{formatStateName(stateData)}</h2>
        </Col>
        <Social />
      </Row>
      <Row className={styles.state}>
        <Col>
          <Row className={styles.stats}>
            <Row className={styles.statsHeading}>
              <Col>
                <h3>State Waitlist in 2021</h3>
              </Col>
              <Col>
                <h3>Average CEO Compensation (2019)</h3>
              </Col>
              <Col>
                <h3 className="red">
                  {`Number of people in ${stateData.name} who died each month waiting for an organ`}
                </h3>
              </Col>
            </Row>
            <Row className={styles.statsPopout}>
              <Col>
                <p>{formatNumber(stateData.popoutStats.waitlist)}</p>
              </Col>
              <Col>
                <p>
                  {formatNumber(stateData.popoutStats.avgCeoComp, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </Col>
              <Col>
                <p className="red">
                  {formatNumber(stateData.popoutStats.monthlyDead)}
                </p>
              </Col>
            </Row>
          </Row>
          <OpoTable
            citation="* Every organ that is not recovered because of OPO ineffective practices, transportation errors, or understaffing, results in another person dying while on the waitlist is a shadow death"
            heading={`OPOS Servicing ${stateData.name}`}
            opos={inStateOpos}
          />
          {stateData.notes.length ||
          inStateOpos.some(({ notes }) => notes?.length) ? (
            <Row>
              <Row>
                <h3>{stateData.name} OPO Updates</h3>
              </Row>
              {stateData.notes.length ? (
                <Row>
                  <ul>
                    {stateData.notes.map(({ note }, i) => (
                      <li key={`statewide-note-${i}`}>
                        <ReactMarkdown>{note}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </Row>
              ) : null}
              {inStateOpos
                .filter(({ notes }) => notes?.length)
                .map(({ name, notes }) => (
                  <Row key={name}>
                    <h4>{name}</h4>
                    <ul>
                      {notes?.map((note, i) => (
                        <li key={`${name}-note-${i}`}>
                          <ReactMarkdown>{note}</ReactMarkdown>
                        </li>
                      ))}
                    </ul>
                  </Row>
                ))}
            </Row>
          ) : null}
          {stateData.videos?.length ? (
            <Row className={styles.voices}>
              <Row>
                <h3>Voices For Organ Donation Reform</h3>
              </Row>
              {stateData.videos.map(({ link, title, description }, i) => (
                <Row key={`statewide-videos-${i}`}>
                  <ReactPlayer url={link} width={594} height={361} />
                  <h4>{title}</h4>
                  <p>{description}</p>
                </Row>
              ))}
            </Row>
          ) : null}
          <DemographicTable opos={inStateOpos} />
          <OpoTable
            heading="OPO Performance in Nearby States"
            inState={false}
            opos={outOfStateOpos}
          />
        </Col>
        <Col>
          <Map
            dimensions={{ height: "30rem", width: "35rem" }}
            state={stateData.abbreviation}
          />
        </Col>
      </Row>
    </Layout>
  );
}

export const query = graphql`
  query {
    statesGeoData: file(relativePath: { eq: "data/states.geojson" }) {
      childGeoJson {
        features {
          geometry {
            type
            coordinates
          }
          properties {
            abbreviation
          }
          type
        }
      }
    }
  }
`;
