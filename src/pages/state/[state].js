import React from "react";
import { Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { graphql } from "gatsby";
import booleanIntersects from "@turf/boolean-intersects";
import center from "@turf/center";

import Layout from "../../components/layout";
import Map from "../../components/map";
import OpoTable from "../../components/opoTable";

import * as styles from "./state.module.css";

import content from "./[state].content.yml";

export default function Dashboard({
  data: { dsaGeoData, statesGeoData, opoData, statesData },
  state = "DC",
}) {
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

  // Find associated state data and feature by abbreviation
  const stateData = statesData?.nodes?.find(
    ({ data: { abbreviation } }) => abbreviation === state.toLocaleUpperCase()
  )?.data;
  const stateFeature = statesGeoData?.childGeoJson?.features?.find(
    ({ properties: { abbreviation } }) =>
      abbreviation === stateData.abbreviation
  );

  // Get the notes tagged at the state level
  stateData.notes = content?.notes?.filter(({ tags }) =>
    tags.includes(stateData.abbreviation)
  );
  stateData.videos = content?.videos?.filter(({ tags }) =>
    tags.includes(stateData.abbreviation)
  );

  // Use Turf to find bordering states by their geojson polygon
  const borderingStates = statesGeoData?.childGeoJson?.features
    ?.filter(feature => booleanIntersects(stateFeature, feature))
    ?.map(({ properties: { abbreviation } }) => abbreviation);

  // Filter into in- and out-of-state (or neither); add region and notes (in), or formatted state list (out)
  const { inStateOpos, outOfStateOpos } = opoData?.nodes.reduce(
    (filter, { data }) => {
      // `states` field: newline-delineated state(s) with an optional `-`-delineated region.
      // Transform -> Array<Array<state, region>>. e.g. `states: 'OH - West\n'` -> `states: [['OH', 'West']]`.
      const statesWithRegion = data.states
        .split("\n")
        .map(swr => swr.split("-").map(sor => sor.trim()));

      const inState = statesWithRegion.find(
        ([state]) => state === stateData.abbreviation
      );
      if (inState) {
        // In state: pull region and tagged notes
        return {
          ...filter,
          inStateOpos: [
            ...filter.inStateOpos,
            {
              ...data,
              notes: notesByOpo[data.opo],
              region: inState[1],
            },
          ],
        };
      } else if (
        statesWithRegion.filter(([state]) => borderingStates.includes(state))
          .length
      ) {
        // Out of state (but nearby): pull and format state list
        return {
          ...filter,
          outOfStateOpos: [
            ...filter.outOfStateOpos,
            {
              ...data,
              states: statesWithRegion.map(([state]) => state).join(", "),
            },
          ],
        };
      } else {
        // Else, not nearby
        return filter;
      }
    },
    { inStateOpos: [], outOfStateOpos: [] }
  );

  // Get nearby DSA geojson features, colored by tier
  const opoTiers = inStateOpos.reduce(
    (tierMap, { opo, tier }) => ({ ...tierMap, [opo]: tier }),
    {}
  );
  const dsaFeatures = dsaGeoData?.childGeoJson?.features
    ?.filter(({ properties: { opo } }) => opoTiers[opo])
    ?.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        tier: opoTiers[feature.properties.opo],
      },
    }));

  const statePopoutStats = {
    avgCeoComp: Math.floor(
      inStateOpos?.reduce((sum, { compensation }) => {
        const comp = parseInt(compensation);
        return isNaN(comp) ? sum : sum + comp;
      }, 0) / inStateOpos.length
    ),
    monthlyDead: stateData.monthly,
    waitlist: parseInt(stateData.waitlist),
  };

  // TODO: use .videos
  console.log({ stateData });

  return (
    <Layout>
      <Row className={styles.title}>
        <h2>
          {stateData.name} ({stateData.abbreviation})
        </h2>
      </Row>
      <Row className={styles.state}>
        <Col>
          <Row className={styles.stats}>
            <Row className={styles.statsHeading}>
              <Col>
                <h3>State Waitlist in 2021 </h3>
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
                <p>
                  {isNaN(statePopoutStats.waitlist)
                    ? "--"
                    : statePopoutStats.waitlist}
                </p>
              </Col>
              <Col>
                <p>
                  {statePopoutStats.avgCeoComp.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </Col>
              <Col>
                <p className="red">{statePopoutStats.monthlyDead ?? "--"}</p>
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
                <h3>OPO News and Notes in {stateData.name}</h3>
              </Row>
              {stateData.notes.length ? (
                <Row>
                  <h4>Statewide</h4>
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
          <OpoTable
            heading="OPO Performance in Nearby States"
            inState={false}
            opos={outOfStateOpos}
          />
        </Col>
        <Col>
          <Map
            center={center(stateFeature).geometry.coordinates.reverse()}
            dimensions={{ height: "30rem", width: "35rem" }}
            dsaGeoJSON={dsaFeatures}
            statesGeoJSON={stateFeature}
            legend={false}
            maxZoom={7}
            minZoom={5}
            zoom={7}
          />
        </Col>
      </Row>
    </Layout>
  );
}

export const query = graphql`
  query {
    dsaGeoData: file(relativePath: { eq: "data/dsas.geojson" }) {
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
    opoData: allAirtable(filter: { table: { eq: "OPOs" } }) {
      nodes {
        data {
          compensation
          donors
          name
          opo
          shadows
          states
          tier
        }
      }
    }
    statesData: allAirtable(filter: { table: { eq: "States" } }) {
      nodes {
        data {
          abbreviation
          monthly
          name
          waitlist
        }
      }
    }
  }
`;
