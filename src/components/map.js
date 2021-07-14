import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { GeoJSON, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useStaticQuery, graphql, Link } from "gatsby";

import useDataMaps from "../hooks/useDataMaps";
import * as styles from "../styles/map.module.css";
import { formatStateName, tierColors } from "../utils/utils";
import Tier from "./tier";

function Legend() {
  return (
    <Container className={styles.legend}>
      <Row>
        <h3>OPO Performance Tier</h3>
      </Row>
      {Object.keys(tierColors).map(tier => (
        <Tier key={tier} className={styles.legendTier} size={20} tier={tier} />
      ))}
    </Container>
  );
}

function StatePopout({ state }) {
  const [{ opoDataMap }] = useDataMaps();

  return (
    <Container className={styles.popout}>
      <Row>
        <h3>{formatStateName(state)}</h3>
      </Row>
      <Row>
        {state.waitlist ? (
          <h4>
            State waitlist:
            {state.waitlist.toLocaleString("en-US")}
          </h4>
        ) : null}
      </Row>
      <Row>
        <h5>OPOs Servicing {state.abbreviation.toLocaleUpperCase()} (2019)</h5>
      </Row>
      {Object.values(opoDataMap)
        .filter(
          ({ statesWithRegions }) =>
            statesWithRegions[state.abbreviation] !== undefined
        )
        .map(({ name, tier }) => (
          <div key={name}>
            <Row>
              <h4>{name}</h4>
            </Row>
            <Tier
              key={tier}
              className={styles.popoutTier}
              size={20}
              tier={tier}
            />
          </div>
        ))}
      <Row>
        <Link to={`/state/${state.abbreviation}`}>
          See all data for {state.abbreviation}
        </Link>
      </Row>
    </Container>
  );
}

// TODO: now that we have the data pulled in anyway, these should not be props, dynamically generated from the data
export default function Map({
  center = [37.09024, -95.712891],
  dimensions = { height: "60vh", width: "100%" },
  interactive = false,
  legend = true,
  maxZoom = 7,
  minZoom = 3,
  state,
  zoom = 4,
}) {
  const [selectedState, setSelectedState] = useState(null);
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
          }
        }
      }
    `
  );

  return (
    <Row className="justify-content-center">
      <div style={dimensions}>
        {selectedState && <StatePopout state={selectedState} />}
        {legend && <Legend />}
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              center={center}
              maxZoom={maxZoom}
              minZoom={minZoom}
              scrollWheelZoom={false}
              style={dimensions}
              zoom={zoom}
              zoomControl={false}
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              />
              <GeoJSON
                data={(state
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
                }))}
                style={feature => ({
                  weight: 0.5,
                  opacity: 1,
                  color: "white",
                  fillColor: tierColors[feature.properties.tier],
                  fillOpacity: 0.7,
                })}
              />
              <GeoJSON
                data={(state
                  ? statesGeoData?.childGeoJson?.features.filter(
                      f =>
                        f.properties.abbreviation.toLocaleUpperCase() === state
                    )
                  : statesGeoData?.childGeoJson?.features
                ).map(f => ({
                  ...f,
                  properties: {
                    ...f.properties,
                    name: stateDataMap[f.properties.abbreviation].name,
                  },
                }))}
                eventHandlers={
                  interactive
                    ? {
                        mouseover: ({ propagatedFrom, target }) =>
                          target
                            ?.setStyle(
                              f =>
                                f?.properties?.name ===
                                  propagatedFrom?.feature?.properties?.name && {
                                  color: "#373737",
                                  fillOpacity: 0.3,
                                  weight: 3,
                                }
                            )
                            .bindTooltip(
                              propagatedFrom?.feature?.properties?.name,
                              {
                                direction: "bottom",
                                offset: [0, 20],
                                sticky: true,
                              }
                            )
                            .openTooltip(),
                        mouseout: ({ target }) => {
                          target?.resetStyle();
                        },
                        click: ({ propagatedFrom, target }) => {
                          target.unbindTooltip();
                          setSelectedState(
                            stateDataMap[
                              propagatedFrom?.feature?.properties?.abbreviation
                            ]
                          );
                        },
                      }
                    : null
                }
                style={{
                  color: "#373737",
                  fillOpacity: 0,
                  weight: 1.5,
                }}
              />
            </MapContainer>
          )
        }
      </div>
    </Row>
  );
}
