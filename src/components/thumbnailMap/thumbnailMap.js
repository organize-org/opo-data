import React from "react";
import { Row } from "react-bootstrap";
import { GeoJSON, MapContainer } from "react-leaflet";
import { useStaticQuery, graphql } from "gatsby";
import bbox from "@turf/bbox";
import useWindowDimensions from "../../hooks/useWindowDimensions";

import useDataMaps from "../../hooks/useDataMaps";
import {
  tierColors,
} from "../../utils/utils";

import * as styles from "./thumbnailMap.module.css";

export default function ThumnailMap({
  dimensions = { height: "55vh", width: "100%" },
  dataId, // state or OPO abbr (e.g. AZ or ALOB)
  page, // "state" or "opo"
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

  // for state map:
  // - bounding box: state
  // - fill layer: OPO (only OPOs servicing / in region)
  // - boundary layer: state (white)

  // for OPO map:
  // - bounding box: OPO
  // - fill layer: OPO
  // - boundary layer: state (black)


  const fillGeoJson =
  {
    ...dsaGeoData?.childGeoJson,
    features: getOpoFeatures(page, dsaGeoData.childGeoJson.features, opoDataMap, dataId)
      .map(f => ({
        ...f,
        properties: {
          ...f.properties,
          tier: opoDataMap[f.properties.opo].tier,
        }
      }))
  };

  const boundaryGeoJson = {
    ...statesGeoData.childGeoJson,
    features: getStateFeatures(page, statesGeoData.childGeoJson.features, dataId)
      .map(f => ({
        ...f,
        properties: {
          ...f.properties,
          name: stateDataMap[f.properties.abbreviation].name,
        },
      })),
  };

  // Map bounding box
  // For state page, use boundary geoms (given state)
  // For OPO page, use fill geoms (given boundary)
  const [minX, minY, maxX, maxY] = bbox(
    page === "state"
      ? boundaryGeoJson
      : fillGeoJson
  );

  return (
    <Row className={styles.map}>
      <div style={dimensions}>
      <hr />
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              key={dataId.name + "container"}
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
              <GeoJSON
                key={dataId.name + "opo-fill-layer"}
                data={fillGeoJson}
                style={feature => ({
                  color: "white",
                  fillColor: tierColors[feature.properties.tier.split(" ")[1]],
                  fillOpacity: 0.85,
                  opacity: 0.75,
                  weight: 0.75,
                })}
                onEachFeature={(_, layer) =>
                  page === "state"
                    ? layer.bindTooltip(layer => layer.feature.properties.opo, {
                        permanent: true,
                        direction: "center",
                        className: styles.opoLabel,
                      })
                    : layer
                }
              />
              <GeoJSON
                key={dataId.name + "boundaries"}
                data={boundaryGeoJson}
                style={{
                  color: page === "opo" ? "black" : "white",
                  fillOpacity: 0,
                  weight: 2,
                }}
              />
            </MapContainer>
          )
        }
        <hr />
      </div>
    </Row>
  );
}

/**
 * For state page, all OPOs that service the given state
 * For OPO page, the given OPO
 */
const getOpoFeatures = (page, allFeatures, opoDataMap, dataId) => {
  if (page === "state") {
    return allFeatures.filter(
      f =>
        opoDataMap[f.properties.opo].statesWithRegions[
          dataId
        ] !== undefined
    )
  }

  console.log(dataId, allFeatures)
  return [allFeatures.find(({ properties: { opo } }) => opo === dataId)]; 
}

/**
 * For state page, the given state
 * For OPO page, all states (bounding box will restrict states displayed)
 */
const getStateFeatures = (page, allFeatures, dataId) => {
  if (page === "state") {
    return [allFeatures.find(
        ({ properties: { abbreviation } }) => abbreviation === dataId
      )]
    }

    return allFeatures;
}