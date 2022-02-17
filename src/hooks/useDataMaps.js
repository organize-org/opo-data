import { useStaticQuery, graphql } from "gatsby";

export default function useDataMaps() {
  const { opoData, statesData } = useStaticQuery(
    graphql`
      query {
        opoData: allAirtable(filter: { table: { eq: "OPOs" } }) {
          nodes {
            data {
              compensation
              donors
              investigation
              investigation_url
              name
              abbreviation: opo
              nhw_donors
              nhb_donors
              h_donors
              a_donors
              nhw_recovery
              nhb_recovery
              h_recovery
              a_recovery
              nhw_death
              nhb_death
              h_death
              a_death
              nhw_rank
              nhb_rank
              h_rank
              a_rank
              shadows
              states
              tier
              ceo
              board
              rank
            }
          }
        }
        statesData: allAirtable(filter: { table: { eq: "States" } }) {
          nodes {
            data {
              abbreviation
              monthly
              name
              waitlist
            }
          }
        }
      }
    `
  );

  const a_count = opoData.nodes.filter(node => node.data.a_rank).length;
  const h_count = opoData.nodes.filter(node => node.data.h_rank).length;
  const nhw_count = opoData.nodes.filter(node => node.data.nhw_rank).length;
  const nhb_count = opoData.nodes.filter(node => node.data.nhb_rank).length;

  return [
    {
      // OPO data by OPO code
      opoDataMap: opoData?.nodes?.reduce(
        (opoDataMap, { data }) => ({
          ...opoDataMap,
          [data.abbreviation]: {
            ...data,
            a_rank: data?.a_rank ? `${data.a_rank} of ${a_count}` : "N/A",
            h_rank: data?.h_rank ? `${data.h_rank} of ${h_count}` : "N/A",
            nhw_rank: data?.nhw_rank ? `${data.nhw_rank} of ${nhw_count}` : "N/A",
            nhb_rank: data?.nhb_rank ? `${data.nhb_rank} of ${nhb_count}` : "N/A",
            // `states` field: newline-delineated state(s) with an optional `-`-delineated region.
            // Transform -> { [state]: region }. e.g. `states: 'OH - West\n'` -> `{ 'OH': 'West' }`.
            statesWithRegions: data.states.split("\n").reduce((swrMap, swr) => {
              const [state, region = ""] = swr
                .split("-")
                .map(sor => sor.trim());
              return {
                ...swrMap,
                [state]: region,
              };
            }, {}),
            states: data.states
              .split("\n")
              .map(swr => swr.split("-")[0].trim())
              .join(", "),
          },
        }),
        {}
      ),
      // State data by abbreviation
      stateDataMap: statesData?.nodes?.reduce(
        (stateNameMap, { data }) => ({
          ...stateNameMap,
          [data.abbreviation]: data,
        }),
        {}
      ),
    },
  ];
}
