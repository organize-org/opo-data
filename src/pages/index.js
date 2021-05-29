import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Table from "../components/table";
import Map from "../components/map";

export default function Dashboard({ data }) {
  return (
    <div>
      <Layout>
        <Map />
        <Table
          data={data.allMetricsCsv.edges.map(({ node }) => ({ ...node }))}
        />
      </Layout>
    </div>
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
  }
`;
