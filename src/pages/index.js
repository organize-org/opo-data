import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default function MyFiles({ data }) {
  console.log(data)
  return (
    <Layout>
      <div>
        <h1>Dashboard Chart</h1>
        <table>
          <thead>
            <tr>
              <th>OPO</th>
              <th>Tier </th>
              <th>State(s)</th>
              <th>Patients on waitlist</th>
              <th>Donors needed</th>
              <th>Organs needed</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.allExampledataCsv.edges.map(({ node }, index) => (
              <tr key={index}>
                <td>{node.OPO}</td>
                <td>{node.Tier}</td>
                <td>{node.State_s_}</td>
                <td>{node.Patients_on_waitlist}</td>
                <td>{node.Donors_needed}</td>
                <td>{node.Organs_needed}</td>
                <td>{node.Notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allExampledataCsv {
      edges {
        node {
          Donors_needed
          Notes
          OPO
          Organs_needed
          Patients_on_waitlist
          State_s_
          Tier
        }
      }
    }
  }
`
