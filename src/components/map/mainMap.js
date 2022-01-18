import React, { useState } from "react";
import { Row } from "react-bootstrap";
import { GeoJSON, MapContainer, ZoomControl } from "react-leaflet";
import { navigate } from "gatsby";
import bbox from "@turf/bbox";
import useWindowDimensions from "../../hooks/useWindowDimensions";

import useDataMaps from "../../hooks/useDataMaps";

import * as styles from "./map.module.css";
import useGeoJson from "../../hooks/useGeoJson";
import Legend, { BLACK_DONOR_DISPARITY_FILL, CONGRESSIONAL_INVESTIGATION_FILL, OPO_PERFORMANCE_TIER_FILL } from "./legend";

export default function MainMap({ mapView }) {
  
  const windowWidth = useWindowDimensions().width;
  const mapDimensions = { height: "100vh", width: "100%" };

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
          name: opoDataMap[f.properties.abbreviation].name,
          tier: opoDataMap[f.properties.abbreviation].tier,
          rate: opoDataMap[f.properties.abbreviation].nhb_recovery,
          investigation: opoDataMap[f.properties.abbreviation].investigation,
        },
      })),
  };

  // use state geo data to generate bounding box
  const [minX, minY, maxX, maxY] = bbox(stateGeoJson)
  return (
      <Row className={styles.map}>
        <div style={mapDimensions}>
          <hr />
          {
            // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
            typeof window !== "undefined" && (
              <MapContainer
                key={`${mapView}-map`}
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
                    fillColor: getMapFill(mapView, feature),
                    fillOpacity: 0.85,
                    opacity: 0.75,
                    weight: 0.75,
                  })}
                />

                {/* Create layer for boundary polygons (OPO or state based on map view)
                  and add hover tool tip and click action */}
                <GeoJSON
                  key="boundary-and-tooltip"
                  data={mapView === "opo-performance" ? stateGeoJson : opoGeoJson}
                  onEachFeature={(feature, layer) =>
                    layer.bindTooltip(
                      `<div class="${styles.tooltip}">
                        <h4>${feature?.properties?.name}</h4>
                        ${getToolTipContent(mapView, feature.properties.abbreviation, stateDataMap, opoDataMap)}
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
                      navigate(`/${mapView === 'opo-performance' ? 'state' : 'opo'}/${propagatedFrom?.feature?.properties?.abbreviation}`)
                    },
                    mouseover: (({ propagatedFrom, target }) => target
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
                    ),
                    mouseout: ({ target }) => target?.resetStyle()   
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
          <Legend mapView={mapView} />
          <hr />
        </div>
      </Row>
  );
}

/**
 * Get fill color for given feature based on map view
 */
const getMapFill = (view, feature) => { 
  if (view === "opo-performance") {
    return getStateMapFill(feature);
  }

  if (view === "black-procurement-disparity") {
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
  return OPO_PERFORMANCE_TIER_FILL[tier].fill;
}

/**
 * For black donor map view, fill is based on black donor recovery rate (nhb_recovery)
 */
const getBlackDonorMapFill = (feature) => {
  return Object.values(BLACK_DONOR_DISPARITY_FILL)
    .find(({compare}) => compare(feature.properties.rate))
    .fill;
}

/**
 * For congressional investigation map view, fill is based on if the 
 * OPO is under congressional investigation 
 */
const getCongressionalInvestigationFill = (feature) => {
  return Object.values(CONGRESSIONAL_INVESTIGATION_FILL)
    .find(({compare}) => compare(feature.properties.investigation ))
    .fill;
}


/**
 * Get tool tip content based on map view
 * TODO: What should be in black donor and congressional review tool tip?
 */
const getToolTipContent = (view, id, stateDataMap, opoDataMap) => {
  if (view === "opo-performance") {
    return `
      <p>State waitlist: <strong>${
        stateDataMap[id].waitlist ?? "No Data"
      }</strong></p>
      <p>OPOs servicing: <strong>${
        Object.values(opoDataMap).filter(
          ({ statesWithRegions }) => statesWithRegions[id] !== undefined
        ).length ?? "No Data"
      }</strong></p>
      <p>People dying every month waiting for an organ: <strong>${
        stateDataMap[id].monthly ?? "No Data"
      }</strong></p>`;
    }

    if (view === "black-procurement-disparity") {
      return `
        <p>Organ Recovery Rate: <strong>${
          opoDataMap[id].nhb_recovery ?? "No Data"
        }</strong></p>
        <p> Recovery Ranking (out of 54 OPOs reporting): <strong>${
          opoDataMap[id].nhb_rank ?? "No Data"
        }</strong></p>
      `;
    }

    return `
      <p>Currently Under Congressional Investigation: <strong>${
        !!opoDataMap[id].investigation ? "Yes" : "No"
      }</strong></p>
    `;

}