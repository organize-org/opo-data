import React from "react";
import { Col, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import { graphql, navigate } from "gatsby";
import booleanIntersects from "@turf/boolean-intersects";

import DemographicTable from "../../components/demographicTable/demographicTable";
import EquitySection from "../../components/equitySection/equitySection";
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

export default function State({ data: { statesGeoData }, state = "DC" }) {
  const [{ opoDataMap, stateDataMap }] = useDataMaps();
  const { headings, notes, stats, videos, sources } = content;

  const notesByOpo = notes?.reduce(
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
    .filter(comp => !isNaN(parseInt(comp)));
  stateData.popoutStats = {
    avgCeoComp: comps.length
      ? Math.floor(comps.reduce((sum, comp) => sum + comp, 0) / comps.length)
      : 0,
    monthlyDead: stateData.monthly,
    waitlist: parseInt(stateData.waitlist),
  };
  // State-level the notes and videos
  stateData.allNotes = notes?.filter(({ tags }) =>
    tags.includes(stateData.abbreviation)
  );
  stateData.notes = stateData?.allNotes.filter(note => !note.voicesForReform);
  stateData.voicesForReform = stateData?.allNotes.filter(
    note => note.voicesForReform
  );
  stateData.videos = videos?.filter(({ tags }) =>
    tags.includes(stateData.abbreviation)
  );

  return (
    <Layout crumbLabel={formatStateName(stateData)} sources={sources}>
      <Row className={styles.title}>
        <h2>{formatStateName(stateData)}</h2>
        <Social />
      </Row>
      <Row className={styles.state}>
        <Col md="7">
          <Row className={styles.stats}>
            <Row className={styles.statsHeading}>
              <Col>
                <h3>
                  <ReactMarkdown>{stats.waitlist}</ReactMarkdown>
                </h3>
              </Col>
              <Col>
                <h3>
                  <ReactMarkdown>{stats.comp}</ReactMarkdown>
                </h3>
              </Col>
              <Col>
                <h3 className="red">
                  <ReactMarkdown>{stats.monthly}</ReactMarkdown>
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
          {inStateOpos.length > 0 && (
            <OpoTable
              headings={headings}
              opos={inStateOpos}
              title={`OPOS Servicing ${stateData.name}`}
            />
          )}
          {stateData.notes.length ||
          inStateOpos.some(({ notes }) => notes?.length) ? (
            <Row>
              <Row>
                <h3>OPO News and Notes in {stateData.name}</h3>
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
          <DemographicTable opos={inStateOpos} />
          {outOfStateOpos.length > 0 && (
            <OpoTable
              headings={headings}
              inState={false}
              opos={outOfStateOpos}
              title="OPO Performance in Neighboring States"
            />
          )}
        </Col>
        <Col md="4">
          <Map
            dimensions={{ height: "30rem", width: "100%" }}
            state={stateData.abbreviation}
          />
          <EquitySection page="state" />
          {stateData.videos?.length || stateData.voicesForReform?.length ? (
            <Row className={styles.voices}>
              <Row>
                <h3>Voices For Reform</h3>
              </Row>
              {stateData.voicesForReform?.length ? (
                <Row>
                  <ul>
                    {stateData.voicesForReform.map(({ note }, i) => (
                      <li key={"vfr-notes-" + i}>
                        <ReactMarkdown>{note}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </Row>
              ) : null}
              {stateData.videos?.length
                ? stateData.videos.map(({ link, title, description }, i) => (
                    <Row key={`statewide-videos-${i}`}>
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
          ) : null}
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
