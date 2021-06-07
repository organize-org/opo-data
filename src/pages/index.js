import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Table from "../components/table";
import Map from "../components/map";

export default function Dashboard({ data }) {
  console.log("query", data);

  return (
    <Layout>
      <Map data={data.allGeoJson.edges.map(({ node }) => ({ ...node }))} />
      <Table data={data.allMetricsCsv.edges.map(({ node }) => ({ ...node }))} />
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
