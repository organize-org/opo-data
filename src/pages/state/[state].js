import React from "react";
import { Row, Col } from "react-bootstrap";
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
    ({ abbreviation }) => abbreviation === state.toLocaleUpperCase()
  );
  const stateFeature = statesGeoData?.childGeoJson?.features?.find(
    ({ properties: { abbreviation } }) =>
      abbreviation === stateData.abbreviation
  );
  // Get the videos tagged for the state, or fallback to those tagged 'All'
  const { allVideos, stateVideos } = content?.videos?.reduce(
    (videoMap, video) => {
      if (video.tags.includes(stateData.abbreviation)) {
        return { ...videoMap, stateVideos: [...videoMap.stateVideos, video] };
      } else if (video.tags.includes("All")) {
        return { ...videoMap, allVideos: [...videoMap.allVideos, video] };
      } else {
        return videoMap;
      }
    },
    { allVideos: [], stateVideos: [] }
  );
  const videos = stateVideos.length ? stateVideos : allVideos;

  // Use Turf to find bordering states by their geojson polygon
  const borderingStates = statesGeoData?.childGeoJson?.features
    ?.filter(feature => booleanIntersects(stateFeature, feature))
    ?.map(({ properties: { abbreviation } }) => abbreviation);

  // Filter into in- and out-of-state (or neither); add region and notes (in), or formatted state list (out)
  const { inStateOpos, outOfStateOpos } = opoData?.nodes.reduce(
    (filter, opo) => {
      // `states` field: newline-delineated state(s) with an optional `-`-delineated region.
      // Transform -> Array<Array<state, region>>. e.g. `states: 'OH - West\n'` -> `states: [['OH', 'West']]`.
      const statesWithRegion = opo.states
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
              ...opo,
              notes: notesByOpo[opo.opo],
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
              ...opo,
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
    monthlyDead: stateData.monthlyDead,
    waitlist: parseInt(stateData.waitlist),
  };

  // TODO: use
  console.log({ videos });

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
                <p>{statePopoutStats.waitlist} </p>
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
                <p className="red">{statePopoutStats.monthlyDead} </p>
              </Col>
            </Row>
          </Row>
          <OpoTable
            citation="* Every organ that is not recovered because of OPO ineffective practices, transportation errors, or understaffing, results in another person dying while on the waitlist is a shadow death"
            heading={`OPOS Servicing ${stateData.name}`}
            opos={inStateOpos}
          />
          <OpoTable
            heading="OPO Performance in Nearby States"
            inState={false}
            opos={outOfStateOpos}
          />
        </Col>
        <Col>
          <Row className="justify-content-center">
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
          </Row>
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
    opoData: allOposCsv {
      nodes {
        compensation
        donors
        name
        opo
        shadows
        states
        tier
      }
    }
    statesData: allStatesCsv {
      nodes {
        abbreviation
        name
        waitlist
      }
    }
  }
`;
