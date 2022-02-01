import React from "react";
import { Row } from "react-bootstrap";
import { GeoJSON, MapContainer } from "react-leaflet";
import { navigate } from "gatsby";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import useGeoJson from "../../hooks/useGeoJson";
import useDataMaps from "../../hooks/useDataMaps";
import { getRankedOPOCount } from "../../utils/utils";

import Legend, {
  BLACK_DONOR_DISPARITY_FILL,
  CONGRESSIONAL_INVESTIGATION_FILL,
  OPO_PERFORMANCE_TIER_FILL,
} from "./legend";

import * as styles from "./map.module.css";

export default function MainMap({ mapView }) {
  const windowWidth = useWindowDimensions().width;

  const [{ opoDataMap, stateDataMap }] = useDataMaps();
  const { dsaGeoData, statesGeoData } = useGeoJson();

  // compose state geoJson from state geo data
  // and name property from state data map
  const stateGeoJson = {
    ...statesGeoData.childGeoJson,
    features: statesGeoData.childGeoJson.features.map(f => ({
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
    features: dsaGeoData.childGeoJson.features.map(f => ({
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

  return (
    <Row className={styles.map}>
      <div style={{ width: "100%" }}>
        <hr />
        <Legend mapView={mapView} />

        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              key={`${mapView}-map`}
              scrollWheelZoom={false}
              style={{ height: "62vh", backgroundColor: "#fff" }}
              zoomControl={false}
              dragging={false}
              // Point near the center of contiguous US (https://geohack.toolforge.org/geohack.php?pagename=Geographic_center_of_the_United_States&params=39_50_N_98_35_W_region:US-KS_type:landmark&title=Geographic+Center+of+the+Contiguous+United+States)
              // but then shifted down a bit to force map higher and reduce whitespace at top
              center={[37.833333, -98.583333]}
              // Shrink map in small (mobile) screens
              zoom={windowWidth > 1100 ? 4.25 : 3}
              zoomSnap={0.25}
            >
              {/* Create layer for OPO polygons with fill based on map view */}
              <GeoJSON
                key="opo-fill-boundaries"
                data={opoGeoJson}
                style={feature => ({
                  color: "white",
                  fillColor: getMapFill(mapView, feature),
                  fillOpacity: 0.85,
                  opacity: 0.75,
                  weight: 0.75,
                })}
              />

              {/* Create layer for state polygon boundaries so they're displayed on OPO maps */}
              <GeoJSON
                key="state-boundaries"
                data={stateGeoJson}
                style={{
                  color: "white",
                  fillOpacity: 0,
                  weight: 0.5,
                }}
              />

              {/* Create interactive layer for boundary polygons (OPO or state based on map view)
                  and add hover tool tip and click action */}
              <GeoJSON
                key="boundary-and-tooltip"
                data={mapView === "opoPerformance" ? stateGeoJson : opoGeoJson}
                onEachFeature={(feature, layer) =>
                  layer.bindTooltip(
                    `<div class="${styles.tooltip}">
                        <h4>${feature?.properties?.name}</h4>
                        ${getToolTipContent(
                          mapView,
                          feature.properties.abbreviation,
                          stateDataMap,
                          opoDataMap
                        )}
                      </div>`,
                    {
                      permanent: false,
                      sticky: true,
                      offset: [10, 0],
                    }
                  )
                }
                eventHandlers={{
                  click: ({ propagatedFrom }) => {
                    navigate(
                      `/${
                        mapView === "opoPerformance" ? "state" : "opo"
                      }/${propagatedFrom?.feature?.properties?.abbreviation.trim()}`
                    );
                  },
                  mouseover: ({ propagatedFrom, target }) =>
                    target?.setStyle(
                      f =>
                        f?.properties?.name ===
                          propagatedFrom?.feature?.properties?.name && {
                          color: "white",
                          fillColor: "black",
                          fillOpacity: 0.2,
                          weight: 4,
                        }
                    ),
                  mouseout: ({ target }) => target?.resetStyle(),
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
        <hr />
      </div>
    </Row>
  );
}

/**
 * Get fill color for given feature based on map view
 */
const getMapFill = (view, feature) => {
  if (view === "opoPerformance") {
    return getStateMapFill(feature);
  }

  if (view === "black-procurement-disparity") {
    return getBlackDonorMapFill(feature);
  }

  if (view === "congressional-investigations") {
    return getCongressionalInvestigationFill(feature);
  }
};

/**
 * For state map view, fill is based on performance tier
 */
const getStateMapFill = feature => {
  const tier = feature.properties.tier.split(" ")[1];
  return OPO_PERFORMANCE_TIER_FILL[tier].fill;
};

/**
 * For black donor map view, fill is based on black donor recovery rate (nhb_recovery)
 */
const getBlackDonorMapFill = feature => {
  return Object.values(BLACK_DONOR_DISPARITY_FILL).find(({ compare }) =>
    compare(feature.properties.rate)
  ).fill;
};

/**
 * For congressional investigation map view, fill is based on if the
 * OPO is under congressional investigation
 */
const getCongressionalInvestigationFill = feature => {
  return Object.values(CONGRESSIONAL_INVESTIGATION_FILL).find(({ compare }) =>
    compare(feature.properties.investigation)
  ).fill;
};

/**
 * Get tool tip content based on map view
 * TODO: What should be in black donor and congressional review tool tip?
 */
const getToolTipContent = (view, id, stateDataMap, opoDataMap) => {
  if (view === "opoPerformance") {
    return `
      <p>State waiting list: <strong>${
        stateDataMap[id].waitlist ?? "N/A"
      }</strong></p>
      <p>OPOs operating in: <strong>${
        Object.values(opoDataMap).filter(
          ({ statesWithRegions }) => statesWithRegions[id] !== undefined
        ).length ?? "N/A"
      }</strong></p>
      <p>People dying every month waiting for an organ: <strong>${
        stateDataMap[id].monthly ?? "N/A"
      }</strong></p>`;
  }

  if (view === "black-procurement-disparity") {
    return `
        <p>Organ Procurement Rate: <strong>${
          opoDataMap[id].nhb_recovery ?? "N/A"
        }</strong></p>
        <p> Procurement Ranking (out of ${getRankedOPOCount(
          opoDataMap
        )} OPOs reporting): <strong>${opoDataMap[id].rank ?? "N/A"}</strong></p>
      `;
  }

  return `
      <p>Currently Under Congressional Investigation: <strong>${
        !!opoDataMap[id].investigation ? "Yes" : "No"
      }</strong></p>
    `;
};
