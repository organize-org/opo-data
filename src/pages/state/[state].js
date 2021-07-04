import React from "react";
import { graphql } from "gatsby";
import booleanIntersects from "@turf/boolean-intersects";
import center from "@turf/center";

import Layout from "../../components/layout";
import Map from "../../components/map";

export default function Dashboard({
  data: { dsaGeoData, statesGeoData, opoData, statesData },
  state = "DC",
}) {
  // Find associated state data and feature by abbreviation
  const stateData = statesData?.nodes?.find(
    ({ abbreviation }) => abbreviation === state.toLocaleUpperCase()
  );
  const stateFeature = statesGeoData?.childGeoJson?.features?.find(
    ({ properties: { abbreviation } }) =>
      abbreviation === stateData.abbreviation
  );

  // Use Turf to find bordering states by their geojson polygon
  const borderingStates = statesGeoData?.childGeoJson?.features
    ?.filter(feature => booleanIntersects(stateFeature, feature))
    ?.map(({ properties: { abbreviation } }) => abbreviation);

  // Filter into in- and out-of-state (or neither), add formatted states or region
  const { inStateOpos, outOfStateOpos } = opoData?.nodes.reduce(
    (filter, opo) => {
      // `states` field: newline-delineated state(s) with an optional `-`-delineated region,
      // e.g. `states: 'PA\nOH - Northeast'`. Transform -> Array<{ state, region }>
      const statesWithRegion = opo.states.split("\n").map(swr => {
        const [state, region] = swr.split("-").map(sor => sor.trim());
        return { state, region };
      });

      const inState = statesWithRegion.find(
        ({ state }) => state === stateData.abbreviation
      );
      if (inState) {
        // In state: pull region
        return {
          ...filter,
          inStateOpos: [
            ...filter.inStateOpos,
            { ...opo, region: inState.region },
          ],
        };
      } else if (
        statesWithRegion.filter(({ state }) => borderingStates.includes(state))
          .length
      ) {
        // Out of state (but nearby): pull and format state(s)
        return {
          ...filter,
          outOfStateOpos: [
            ...filter.outOfStateOpos,
            {
              ...opo,
              states: statesWithRegion.map(({ state }) => state).join(", "),
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
    avgCeoComp:
      inStateOpos?.reduce(
        (sum, { compensation }) => sum + parseInt(compensation),
        0
      ) / inStateOpos.length,
    monthlyDead: 0, // TODO ?
    waitlist: parseInt(stateData.waitlist),
  };

  // TODO: use
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
