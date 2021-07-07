import React from "react";
import { graphql } from "gatsby";
import booleanIntersects from "@turf/boolean-intersects";
import center from "@turf/center";

import Layout from "../../components/layout";
import Map from "../../components/map";

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
  const nearbyOpoTiers = [...inStateOpos, ...outOfStateOpos].reduce(
    (nearbyMap, { opo, tier }) => ({ ...nearbyMap, [opo]: tier }),
    {}
  );
  const dsaFeatures = dsaGeoData?.childGeoJson?.features
    ?.filter(({ properties: { opo } }) => nearbyOpoTiers[opo])
    ?.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        tier: nearbyOpoTiers[feature.properties.opo],
      },
    }));

  const statePopoutStats = {
    avgCeoComp: Math.floor(
      inStateOpos?.reduce((sum, { compensation }) => {
        const comp = parseInt(compensation);
        return isNaN(comp) ? sum : sum + comp;
      }, 0) / inStateOpos.length
    ),
    monthlyDead: 0, // TODO ?
    waitlist: parseInt(stateData.waitlist),
  };

  // TODO: use
  console.log({ videos });
  console.log({ inStateOpos });
  console.log({ outOfStateOpos });
  console.log({ statePopoutStats });

  return (
    <Layout>
      <Map
        center={center(stateFeature).geometry.coordinates.reverse()}
        dimensions={{ height: "75vh", width: "100vh" }}
        dsaGeoJSON={dsaFeatures}
        statesGeoJSON={stateFeature}
        zoom={5.5}
      />
      <h2>
        {stateData.name} ({stateData.abbreviation})
      </h2>
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
