import React, {useState} from "react";
import { Container, Row } from "react-bootstrap";
import { GeoJSON, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useStaticQuery, graphql, Link } from "gatsby";
import bbox from "@turf/bbox";
import CloseHover from '../../images/icons/close-hover.svg'
import CloseDefault from '../../images/icons/close-default.svg'

import useDataMaps from "../../hooks/useDataMaps";
import {
  findStateFeature,
  formatStateName,
  tierColors,
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

function StatePopout({ state, setPopoutAbbrevation }) {
  const [{ opoDataMap }] = useDataMaps();
  const [hover, setHover] = useState(false)

  return (
    <Container className={styles.popout}>
      <Row>
        <h3>{formatStateName(state)}</h3>
        <button
          className={styles.closeModal}
          onClick={() => setPopoutAbbrevation(null)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hover ? (
            <CloseHover />
          ) : (
            <CloseDefault />
          )}
        </button>
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
        <h5>OPOs Servicing {state.abbreviation.toLocaleUpperCase()} (2018)</h5>
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
            <Tier key={tier} className={styles.popoutTier} tier={tier} />
          </div>
        ))}
      <Row>
        <Link to={`/state/${state.abbreviation}`}>
          See more data for {state.abbreviation}
        </Link>
      </Row>
    </Container>
  );
}

export default function Map({
  dimensions = { height: "55vh", width: "100%" },
  interactive = false,
  legend = false,
  state = null,
  popoutAbbreviation = null,
  setPopoutAbbrevation,
}) {
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

  // Map bounding box: individual state or continential US (first 48)
  const [minX, minY, maxX, maxY] = bbox({
    ...stateGeoJson,
    features:
      stateGeoJson.features.length > 1
        ? stateGeoJson.features.slice(0, -3)
        : stateGeoJson.features,
  });

  return (
    <Row className={styles.map}>
      <div style={dimensions}>
        {popoutAbbreviation && (
          <StatePopout
            state={stateDataMap[popoutAbbreviation]}
            setPopoutAbbrevation
          ={setPopoutAbbrevation}/>
        )}
        {legend && <Legend />}
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              bounds={[
                [minY, minX],
                [maxY, maxX],
              ]}
              scrollWheelZoom={false}
              style={dimensions}
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
                  color: "white",
                  fillColor: tierColors[feature.properties.tier],
                  fillOpacity: 0.65,
                  opacity: 0.75,
                  weight: 0.75,
                })}
              />
              <GeoJSON
                key={popoutAbbreviation}
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
                                  color: "#373737",
                                  fillOpacity: 0.3,
                                  weight: 2,
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
                        mouseout: ({ target }) => target?.resetStyle(),
                        click: ({ propagatedFrom }) => {
                          setPopoutAbbrevation(
                            propagatedFrom?.feature?.properties?.abbreviation
                          );
                        },
                      }
                    : null
                }
                style={{
                  color: "#373737",
                  fillOpacity: 0,
                  opacity: 0.75,
                  weight: 1,
                }}
              />
            </MapContainer>
          )
        }
      </div>
    </Row>
  );
}
