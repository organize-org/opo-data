import React from "react";
import { Row } from "react-bootstrap";
import { GeoJSON, MapContainer } from "react-leaflet";
import bbox from "@turf/bbox";
import { navigate } from "gatsby";

import useDataMaps from "../../hooks/useDataMaps";
import { tierColors } from "../../utils/utils";

import * as styles from "./map.module.css";
import useGeoJson from "../../hooks/useGeoJson";

export default function ThumnailMap({
  dimensions,
  dataId, // state or OPO abbr (e.g. AZ or ALOB)
  view, // "state" or "opo"
}) {
  const [{ opoDataMap, stateDataMap }] = useDataMaps();
  const { dsaGeoData, statesGeoData } = useGeoJson();

  // compose fill OPO geoJson with appropriately filtered
  // OPO features based on view ("opo" or "state")
  const fillGeoJson = {
    ...dsaGeoData?.childGeoJson,
    features: (view === "state"
      ? // state view: grab geoms for all opos that service this state
        dsaGeoData?.childGeoJson?.features.filter(
          f =>
            opoDataMap[f.properties.abbreviation].statesWithRegions[dataId] !==
            undefined
        )
      : // opo view: grab geom for this opo
        [
          dsaGeoData?.childGeoJson?.features.find(
            ({ properties: { abbreviation } }) => abbreviation === dataId
          ),
        ]
    )
      // then augment all features with 'tier' property which is used to determine fill color
      .map(f => ({
        ...f,
        properties: {
          ...f?.properties,
          tier: opoDataMap[f?.properties.abbreviation]?.tier,
        },
      })),
  };

  // Compose boundary geoJson from appropriate geo data
  // based on view ("state" or "opo")
  const geoData = view === "state" ? statesGeoData : dsaGeoData;
  const boundaryGeoJson = {
    ...geoData.childGeoJson,
    // get the single state or opo geometry to display as boundary
    features: [
      geoData.childGeoJson.features.find(
        ({ properties: { abbreviation } }) => abbreviation === dataId
      ),
    ].map(f => ({
      ...f,
      properties: {
        ...f?.properties,
        name: (view === "state" ? stateDataMap : opoDataMap)[
          f?.properties?.abbreviation
        ]?.name,
      },
    })),
  };

    console.log("dimensions", dimensions);
    console.log("dataId", dataId);
    console.log("view", view);
    console.log("fillGeoJson", fillGeoJson);
    console.log("geoData", geoData);
    console.log("boundaryGeoJson", boundaryGeoJson);

  const [minX, minY, maxX, maxY] = bbox(boundaryGeoJson);




  return (
    <Row className={styles.map}>
      <div style={dimensions}>
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              key={dataId.name + " container"}
              bounds={[
                [minY, minX],
                [maxY, maxX],
              ]}
              scrollWheelZoom={false}
              style={{ ...dimensions, backgroundColor: "#fff" }}
              zoomControl={false}
              touchZoom={false}
              dragging={false}
              className={styles.mapContainer + " thumbnail"}
            >
              {/* Create layer for all state polygons with fill (to contextualize other geoms!) */}
              <GeoJSON
                key={dataId + "state-fill"}
                data={{ ...statesGeoData.childGeoJson }}
                interactive={false}
                style={{
                  color: "#c4c4c4",
                  fillColor: "white",
                  fillOpacity: 0.85,
                  opacity: 0.75,
                  weight: 0.75,
                }}
              />
              {/* Create layer for OPO polygons with fill based on performance tier */}
              <GeoJSON
                key={dataId + "opo-fill"}
                data={fillGeoJson}
                interactive={false}
                style={feature => ({
                  color: "white",
                  fillColor: tierColors[feature.properties.tier.split(" ")[1]],
                  fillOpacity: 0.85,
                  opacity: 0.75,
                  weight: 0.75,
                })}
                // Add permanent tool tip to act as OPO label
                // TODO: These currently appear centered in the OPO polygon,
                // which does not always align with the state-derived bounding box
                // and may appear very near the edge or not at all
                onEachFeature={(_, layer) =>
                  view === "state"
                    ? layer.bindTooltip(
                        layer => layer.feature.properties.abbreviation,
                        {
                          permanent: true,
                          direction: "center",
                          offset: OPO_LABEL_OFFSETS[dataId]?.[
                            layer.feature.properties.abbreviation
                          ] ?? [0, 0],
                          className: styles.opoLabel,
                          interactive: true,
                        }
                      )
                    : layer
                }
                eventHandlers={{
                  click: ({ propagatedFrom }) => {
                    navigate(
                      `/opo/${propagatedFrom?.feature?.properties?.abbreviation.trim()}`
                    );
                  },
                }}
              />
              {/* Create layer for state or OPO states polygons with boundaries */}
              <GeoJSON
                key={dataId + "boundaries"}
                data={boundaryGeoJson}
                interactive={false}
                style={{
                  color: "black",
                  fillOpacity: 0,
                  weight: 2,
                }}
              />
            </MapContainer>
          )
        }
      </div>
    </Row>
  );
}

/**
 * Custom offsets to apply to OPO labels in state thumbnail maps to make them
 *  a) visible within the bounded mini map
 *  b) distinct and clear WRT to their specific OPO geometry
 */

const OPO_LABEL_OFFSETS = {
  AK: {
    WALC: [20, -130],
  },
  AR: {
    TXSB: [400, -100],
    MOMA: [0, 85],
  },
  CA: {
    CADN: [-10, -30],
    CASD: [20, 10],
  },
  CO: {
    CORS: [35, 120],
  },
  DC: {
    DCTC: [250, -40],
  },
  DE: {
    PADV: [50, 120],
  },
  GA: {
    TNDS: [-10, 70],
  },
  ID: {
    UTOP: [0, -50],
    WALC: [350, -625],
  },
  IL: {
    WIUW: [0, 50],
  },
  IN: {
    KYDA: [0, -30],
  },
  IA: {
    NEOR: [140, 0],
  },
  MA: {
    MAOB: [120, -120],
    CTOP: [0, -30],
    NYAP: [75, 40],
  },
  MD: {
    MDPC: [10, -20],
  },
  ME: {
    MAOB: [90, -130],
  },
  MN: {
    MNOP: [20, 0],
  },
  MT: {
    WALC: [450, -650],
  },
  ND: {
    MNOP: [-90, -60],
  },
  NH: {
    MAOB: [70, -120],
  },
  NV: {
    CADN: [-5, -50],
  },
  NY: {
    PATF: [0, 20],
  },
  OH: {
    KYDA: [65, -45],
  },
  PA: {
    PATF: [-100, 20],
  },
  RI: {
    MAOB: [275, -60],
  },
  SD: {
    MNOP: [-80, 100],
  },
  VA: {
    TNDS: [150, -30],
    NCNC: [0, -30],
  },
  VT: {
    MAOB: [50, -140],
  },
  WA: {
    ORUO: [50, -95],
    WALC: [500, -1300],
  },
  WI: {
    MNOP: [40, 0],
  },
  WV: {
    PATF: [-80, 100],
    KYDA: [80, 0],
  },
  WY: {
    CORS: [0, -100],
    UTOP: [140, -40],
  },
};
