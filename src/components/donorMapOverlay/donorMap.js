import React from "react";
import { Container, Row } from "react-bootstrap";
import { GeoJSON, MapContainer, ZoomControl } from "react-leaflet";
import { useStaticQuery, graphql, navigate } from "gatsby";
import bbox from "@turf/bbox";
import useWindowDimensions from "../../hooks/useWindowDimensions";

import useDataMaps from "../../hooks/useDataMaps";
import {
  findStateFeature,
  tierColors,
  donorMapColors,
  findOpoFeature,
} from "../../utils/utils";
import DonorTier from "../tier/donorTier";

import * as styles from "../map/map.module.css";

function Legend() {
  return (
    <Container className={styles.legend}>
      <Row>
        <h3>OPO Performance Tier</h3>
      </Row>
      {Object.keys(tierColors).map(tier => (
        <DonorTier key={tier} className={styles.legendTier} tier={tier} />
      ))}
    </Container>
  );
}

export default function Map({
  dimensions = { height: "55vh", width: "100%" },
  interactive = false,
  legend = false,
  page = "main",
  data,
  zoomControl = false,
}) {
  const windowWidth = useWindowDimensions().width;

  const [{ opoDataMap, stateDataMap }] = useDataMaps();
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
                opo
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

  // State geojson: either individual state or whole US, mapped to hoverable name
  const stateGeoJson = {
    ...statesGeoData.childGeoJson,
    features: (page === "state"
      ? [findStateFeature(statesGeoData, data)]
      : statesGeoData.childGeoJson.features
    ).map(f => ({
      ...f,
      properties: {
        ...f.properties,
        name: stateDataMap[f.properties.abbreviation].name,
      },
    })),
  };

  const opoGeoJson = {
    ...dsaGeoData.childGeoJson,
    features: (page === "opo"
      ? [findOpoFeature(dsaGeoData, data)]
      : dsaGeoData.childGeoJson.features
    ).map(f => ({
      ...f,
      properties: {
        ...f.properties,
        tier: opoDataMap[f.properties.opo].tier,
      },
    })),
  };

  console.log("opoGeoJson", opoGeoJson);
  console.log("stateGeoJson", stateGeoJson);

  // Map bounding box: individual state or continential US (first 48)
  const [minX, minY, maxX, maxY] = bbox(
    page === "opo"
      ? {
          ...opoGeoJson,
          features: opoGeoJson.features,
        }
      : {
          ...stateGeoJson,
          features: stateGeoJson.features,
        }
  );

  console.log("opoDataMap", opoDataMap);
  console.log("stateDataMap", stateDataMap);

  return (
    <Row className={styles.map}>
      <div style={dimensions}>
        {/* {legend && <Legend />} */}
        {page !== "main" ? null : <hr />}
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              key={page === "main" ? "state container" : data + "container"}
              bounds={[
                [minY, minX],
                [maxY, maxX],
              ]}
              scrollWheelZoom={false}
              style={Object.assign(dimensions, { backgroundColor: "#fff" })}
              zoomControl={false}
              dragging={windowWidth > 800}
              className={styles.mapContainer}
            >
              {zoomControl && <ZoomControl position="bottomright" />}

              <GeoJSON
                key={page === "main" ? data + "opos" : "state opos"}
                data={(page === "state"
                  ? dsaGeoData?.childGeoJson?.features.filter(
                      f =>
                        opoDataMap[f.properties.opo].statesWithRegions[data] !==
                        undefined
                    )
                  : dsaGeoData?.childGeoJson?.features
                ).map(f => ({
                  ...f,
                  properties: {
                    ...f.properties,
                    tier: opoDataMap[f.properties.opo].tier,
                    rank: opoDataMap[f.properties.opo].nhb_rank,
                  },
                }))}
                style={feature => ({
                  color: "white",
                  fillColor: tierColors[feature.properties.tier.split(" ")[1]],
                  //   fillColor: donorMapColors[feature.properties.rank],
                  fillOpacity: 0.85,
                  opacity: 0.75,
                  weight: 0.75,
                })}
              />
              <GeoJSON
                key={page === "main" ? "state" : data}
                data={stateGeoJson}
              />
            </MapContainer>
          )
        }
        {page !== "main" ? null : <hr />}
      </div>
    </Row>
  );
}
