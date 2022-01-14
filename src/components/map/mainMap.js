import React from "react";
import { Container, Row } from "react-bootstrap";
import { GeoJSON, MapContainer, ZoomControl } from "react-leaflet";
import { useStaticQuery, graphql, navigate } from "gatsby";
import bbox from "@turf/bbox";
import useWindowDimensions from "../../hooks/useWindowDimensions";

import useDataMaps from "../../hooks/useDataMaps";
import {
  tierColors,
} from "../../utils/utils";
import Tier from "../tier/tier";

import * as styles from "./map.module.css";
import useGeoJson from "../../hooks/useGeoJson";

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

export default function MainMap({
  view = "state", // options: state, black-donor, congressional-investigation
}) {

  console.log("View", view);
  const windowWidth = useWindowDimensions().width;
  const mapDimensions = { height: "55vh", width: "100%" };

  const [{ opoDataMap, stateDataMap }] = useDataMaps();
  const { dsaGeoData, statesGeoData } = useGeoJson();
  
  // compose state geoJson from state geo data 
  // and name property from state data map
  const stateGeoJson = {
    ...statesGeoData.childGeoJson,
    features: statesGeoData.childGeoJson.features
      .map(f => ({
        ...f,
        properties: {
          ...f.properties,
          name: stateDataMap[f.properties.abbreviation].name,
        },
      })),
  };

  // compose OPO geoJson from DSA geo data 
  // and performance tier, black donor rank, 
  // and congressional investigation flag from opo data map
  const opoGeoJson = {
    ...dsaGeoData.childGeoJson,
    features: dsaGeoData.childGeoJson.features
      .map(f => ({
      ...f,
        properties: {
          ...f.properties,
          name: opoDataMap[f.properties.opo].name,
          tier: opoDataMap[f.properties.opo].tier,
          black_donor_rank: opoDataMap[f.properties.opo].nhb_rank,
          congressional_investigation: opoDataMap[f.properties.opo].investigation,
        },
      })),
  };

  // use state geo data to generate bounding box
  const [minX, minY, maxX, maxY] = bbox(stateGeoJson)

  console.log("styles tooltip", styles.tooltip)

  return (
    <Row className={styles.map}>
      <div style={mapDimensions}>
        <Legend />
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              key="full map container"
              bounds={[
                [minY, minX],
                [maxY, maxX],
              ]}
              scrollWheelZoom={false}
              style={Object.assign(mapDimensions, { backgroundColor: "#fff" })}
              zoomControl={false}
              dragging={windowWidth > 800}
              className={styles.mapContainer}
            >
              <ZoomControl position="bottomright" />

              {/* Create layer for OPO polygons with fill based on map view */}
              <GeoJSON
                key="opo-fill"
                data={opoGeoJson}
                style={feature => ({
                  color: "white",
                  fillColor: getMapFill(view, feature),
                  fillOpacity: 0.85,
                  opacity: 0.75,
                  weight: 0.75,
                })}
              />

              {/* Create layer for boundary polygons (OPO or state based on map view)
                and add hover tool tip and click action */}
              <GeoJSON
                key="boundary-and-tooltip"
                data={view === "state" ? stateGeoJson : opoGeoJson}
                onEachFeature={(feature, layer) =>
                  layer.bindTooltip(
                    `<div class="${styles.tooltip}">
                      <h4>${feature?.properties?.name}</h4>
                      ${getToolTipContent(view, feature, stateDataMap, opoDataMap)}
                    </div>`,
                    {
                      permanent: false,
                      sticky: false,
                      offset: [10, 0],
                      color: "white",
                      fillColor: "black",
                      fillOpacity: 0.2,
                      weight: 4
                    }
                  )
                }
                eventHandlers={{
                  click: ({ propagatedFrom }) => {
                    navigate(
                      view === "state" 
                        ? `/state/${propagatedFrom?.feature?.properties?.abbreviation}`
                        : `/opo/${propagatedFrom?.feature?.properties?.opo}`
                    );
                  },  
                }}
                style={{
                  color: "white",
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
 * Get fill color for given feature based on map view
 */
const getMapFill = (view, feature) => { 
  if (view === "state") {
    return getStateMapFill(feature);
  }

  if (view === "black-donor") {
    return getBlackDonorMapFill(feature);
  }

  if (view === "congressional-investigation") {
    return getCongressionalInvestigationFill(feature);
  }
}

/**
 * For state map view, fill is based on performance tier
 */
const getStateMapFill = (feature) => {
  const tier = feature.properties.tier.split(" ")[1];
  if (tier === "Passing") return "#C4C4C4";
  if (tier === "Underperforming") return "#FFB042";
  if (tier === "Failing") return  "#D43C37";
}

/**
 * For black donor map view, fill is based on black donor rate ranking
 */
const getBlackDonorMapFill = (feature) => {
  const blackDonorRank = feature.properties.black_donor_rank;
  if (blackDonorRank < 10 ) return "#4E1C19";
  if (blackDonorRank < 15) return "#89322B";
  if (blackDonorRank < 20) return "#D43C37";
  if (blackDonorRank < 25) return "#FFB042";
  if (blackDonorRank < 30) return "#F9D558";
  if (blackDonorRank > 35) return "#00768F";

  return  "C4C4C4";
}

/**
 * For congressional investigation map view, fill is based on if the 
 * OPO is under congressional investigation 
 */
const getCongressionalInvestigationFill = (feature) => {
   const investigation = feature.properties.congressional_investigation;

   if(investigation) return "#00563f";
   return "#FF0800"
}


/**
 * Get tool tip content based on map view
 * TODO: What should be in black donor and congressional review tool tip?
 */
const getToolTipContent = (view, feature, stateDataMap, opoDataMap) => {
  if (view === "state") return `
    <p>State waitlist: <strong>${
      stateDataMap[
        feature?.properties
          ?.abbreviation
      ].waitlist ?? "No Data"
    }</strong></p>
    <p>OPOs servicing: <strong>${
      Object.values(opoDataMap).filter(
        ({ statesWithRegions }) =>
          statesWithRegions[
            feature?.properties
              ?.abbreviation
          ] !== undefined
      ).length ?? "No Data"
    }</strong></p>
    <p>People dying every month waiting for an organ: <strong>${
      stateDataMap[
        feature?.properties
          ?.abbreviation
      ].monthly ?? "No Data"
    }</strong></p>`;

    return `
      <p> Other Stats for OPO here </p>
    `;

}