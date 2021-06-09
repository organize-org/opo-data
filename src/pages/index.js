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

  const transformed = {
    ...geoData[0],
    features: geoData[0].features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        tier: tierData[feature.properties.name]?.Tier,
      },
    })),
  };

  const getColor = tier => {
    switch (tier) {
      case "3 Failing":
        return "#D43C37";
      case "2 Underperforming":
        return "#FFB042";
      case "1 Passing":
        return "#C4C4C4";
      default:
        return "green";
    }
  };

  return (
    <Layout>
      <Map
        geoData={geoData}
        tableData={tableData}
        transformed={transformed}
        getColor={getColor}
      />
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
