import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Map from "../components/map";
import Home from "../components/home/home";
import HomeImage from "../components/home/homeImage";
import Editorial from "../components/home/editorial";
import Articles from "../components/home/articles";

export default function Dashboard({ data }) {
  const geoData = data.allGeoJson.edges.map(({ node }) => ({ ...node }));
  const tableData = data.allMetricsCsv.edges.map(({ node }) => ({ ...node }));

  const tierData = tableData.reduce(
    (tableDataMap, { Tier, OPO }) => ({
      ...tableDataMap,
      [OPO]: Tier,
    }),
    {}
  );

  const transformedGeoData = {
    ...geoData[0],
    features: geoData[0].features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        tier: tierData[feature.properties.name],
      },
    })),
  };

  return (
    <Layout>
      <Map geoData={transformedGeoData} />
      <Home />
      <HomeImage />
      <Editorial />
      <Articles />
    </Layout>
  );
}

export const query = graphql`
  query {
    allMetricsCsv {
      edges {
        node {
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
    allGeoJson {
      edges {
        node {
          features {
            geometry {
              type
              coordinates
            }
            properties {
              name
            }
            type
          }
        }
      }
    }
  }
`;
