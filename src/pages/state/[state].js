import React from "react";
import { graphql } from "gatsby";
import booleanInersects from "@turf/boolean-intersects";
import center from "@turf/center";

import Layout from "../../components/layout";
import Map from "../../components/map";

export default function Dashboard({
  data: { dsaGeoData, statesGeoData, opoData },
  state = "DC",
}) {
  const stateFeature = statesGeoData?.childGeoJson?.features?.find(
    ({ properties }) => properties.abbreviation === state
  );
  const dsaFeatures = dsaGeoData?.childGeoJson?.features?.filter(dsaFeature =>
    booleanInersects(dsaFeature, stateFeature)
  );
  const opos = opoData?.nodes?.filter(({ OPO }) =>
    dsaFeatures.map(({ properties }) => properties.name).includes(OPO)
  );

  const tierData = opos.reduce(
    (opoDataMap, { Tier, OPO }) => ({
      ...opoDataMap,
      [OPO]: Tier,
    }),
    {}
  );
  const transformedDSAFeatures = dsaFeatures.map(feature => ({
    ...feature,
    properties: {
      ...feature.properties,
      tier: tierData[feature.properties.name],
    },
  }));

  return (
    <Layout>
      <Map
        center={center(stateFeature).geometry.coordinates.reverse()}
        dimensions={{ height: "75vh", width: "100vh" }}
        dsaGeoJSON={transformedDSAFeatures}
        statesGeoJSON={stateFeature}
        zoom={5.5}
      />
      <h2>
        {stateFeature.properties.name} ({state})
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
            name
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
            name
            abbreviation
          }
          type
        }
      }
    }
    opoData: allMetricsCsv {
      nodes {
        Board
        CEO
        Donors
        Notes
        OPO
        Organs
        States
        Tier
        Waitlist
      }
    }
  }
`;
