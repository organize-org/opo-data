import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Table from "../components/table";
import Map from "../components/map";

export default function Dashboard({ data }) {
  const geoData = data.allGeoJson.edges.map(({ node }) => ({ ...node }));
  const tableData = data.allMetricsCsv.edges.map(({ node }) => ({ ...node }));

  const tierData = tableData.reduce(
    (tableDataMap, tableRow) => ({
      ...tableDataMap,
      [tableRow.OPO]: tableRow,
    }),
    {}
  );

  const transformedGeoData = {
    ...geoData[0],
    features: geoData[0].features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        tier: tierData[feature.properties.name]?.Tier,
      },
    })),
  };

  return (
    <Layout>
      <Map transformedGeoData={transformedGeoData} />
      <Table data={tableData} />
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
