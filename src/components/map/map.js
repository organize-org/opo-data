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
  findOpoFeature,
} from "../../utils/utils";
import Tier from "../tier/tier";

import * as styles from "./map.module.css";

function Legend() {
  return (
    <Container className={styles.legend}>
      <Row>
        <h3>OPO Performance Tier</h3>
      </Row>
      {Object.keys(tierColors).map(tier => (
        <Tier key={tier} className={styles.legendTier} tier={tier} />
      ))}
    </Container>
  );
}

export default function Map({
  dimensions = { height: "55vh", width: "100%" },
  interactive = false,
  legend = false,
  state = null,
  opo = null,
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
    features: (state
      ? [findStateFeature(statesGeoData, state)]
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
    features: (opo
      ? [findOpoFeature(dsaGeoData, opo)]
      : dsaGeoData.childGeoJson.features
    ).map(f => ({
      ...f,
      properties: {
        ...f.properties,
        tier: opoDataMap[f.properties.opo].tier,
      },
    })),
  };

  // Map bounding box: individual state or continential US (first 48)
  const [minX, minY, maxX, maxY] = bbox(
    opo
      ? {
          ...opoGeoJson,
          features: opoGeoJson.features,
        }
      : {
          ...stateGeoJson,
          features: stateGeoJson.features,
        }
  );

  return (
    <Row className={styles.map}>
      <div style={dimensions}>
        {legend && <Legend />}
        {state || opo ? null : <hr />}
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              key={
                state
                  ? state + "container"
                  : opo
                  ? opo + "container"
                  : "state container"
              }
              bounds={[
                [minY, minX],
                [maxY, maxX],
              ]}
              scrollWheelZoom={false}
              style={dimensions}
              zoomControl={false}
              dragging={windowWidth > 800}
              className={styles.mapContainer}
            >
              {zoomControl && <ZoomControl position="bottomright" />}
              <GeoJSON
                key={state ? state + "opos" : opo ? opo + "opos" : "state opos"}
                data={
                  opo
                    ? {
                        ...opoGeoJson,
                        properties: {
                          ...opoGeoJson.properties,
                          tier: opo.tier,
                        },
                      }
                    : (state
                        ? dsaGeoData?.childGeoJson?.features.filter(
                            f =>
                              opoDataMap[f.properties.opo].statesWithRegions[
                                state
                              ] !== undefined
                          )
                        : dsaGeoData?.childGeoJson?.features
                      ).map(f => ({
                        ...f,
                        properties: {
                          ...f.properties,
                          tier: opoDataMap[f.properties.opo].tier,
                        },
                      }))
                }
                style={feature => ({
                  color: "white",
                  fillColor: tierColors[feature.properties.tier.split(" ")[1]],
                  fillOpacity: 0.85,
                  opacity: 0.75,
                  weight: 0.75,
                })}
                onEachFeature={(feature, layer) =>
                  state
                    ? layer.bindTooltip(layer => layer.feature.properties.opo, {
                        permanent: true,
                        direction: "center",
                        className: styles.opoLabel,
                      })
                    : layer
                }
              />
              <GeoJSON
                key={state ? state : opo ? opo : "state"}
                data={stateGeoJson}
                eventHandlers={
                  interactive
                    ? {
                        mouseover: ({ propagatedFrom, target }) =>
                          target
                            ?.setStyle(
                              f =>
                                f?.properties?.name ===
                                  propagatedFrom?.feature?.properties?.name && {
                                  color: "white",
                                  fillColor: "black",
                                  fillOpacity: 0.2,
                                  weight: 4,
                                }
                            )
                            .bindTooltip(
                              `<div class="${styles.tooltip}">
                              <h4>
                                ${propagatedFrom?.feature?.properties?.name}
                              </h4>
                              <p>State waitlist: <strong>${
                                stateDataMap[
                                  propagatedFrom?.feature?.properties
                                    ?.abbreviation
                                ].waitlist ?? "No Data"
                              }</strong></p>
                              <p>OPOs servicing: <strong>${
                                Object.values(opoDataMap).filter(
                                  ({ statesWithRegions }) =>
                                    statesWithRegions[
                                      propagatedFrom?.feature?.properties
                                        ?.abbreviation
                                    ] !== undefined
                                ).length ?? "No Data"
                              }</strong></p>
                              <p>People dying every month waiting for an organ: <strong>${
                                stateDataMap[
                                  propagatedFrom?.feature?.properties
                                    ?.abbreviation
                                ].monthly ?? "No Data"
                              }</strong></p>
                              </div>`,
                              {
                                sticky: true,
                                offset: [10, 0],
                              }
                            )
                            .openTooltip(),
                        mouseout: ({ target }) => target?.resetStyle(),
                        click: ({ propagatedFrom }) => {
                          navigate(
                            `/state/${propagatedFrom?.feature?.properties?.abbreviation}`
                          );
                        },
                      }
                    : null
                }
                style={{
                  color: opo ? "black" : "white",
                  fillOpacity: 0,
                  weight: 2,
                }}
              />
            </MapContainer>
          )
        }
        {state || opo ? null : <hr />}
      </div>
    </Row>
  );
}
