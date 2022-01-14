import { useStaticQuery, graphql } from "gatsby";

export default function useGeoJson() {
  const { dsaGeoData, statesGeoData } = useStaticQuery(
    graphql`
      query {
        dsaGeoData: file(relativePath: { eq: "data/dsas.geojson" }) {
          childGeoJson {
            features {
              geometry {
                type
                coordinates
              }
              properties {
                abbreviation: opo
              }
              type
            }
            type
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
            type
          }
        }
      }
    `
  );

  return { dsaGeoData, statesGeoData };
}