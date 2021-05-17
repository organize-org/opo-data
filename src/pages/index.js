import React from "react";
import { Image } from "react-bootstrap";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Table from "../components/table";
import NotesMarkdown from "../components/notes";

import Map from "../images/state_opo_performance.png";

export default function Dashboard({ data }) {
  return (
    <Layout>
      <NotesMarkdown />

      <div>
        <h2>Highest and Lowest Performing OPOs by Location</h2>

        <Image
          src={Map}
          style={{ height: "auto", maxWidth: "70%", marginBottom: "60px" }}
        />
      </div>
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
  }
`;
