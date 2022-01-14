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
  view = "state", // options: state, black-donor, congressional-investigation
}) {
  const windowWidth = useWindowDimensions().width;

  const [{ opoDataMap, stateDataMap }] = useDataMaps();
  const { dsaGeoData, statesGeoData } = useStaticQuery(query);
  
  // compose state geoJson with name property
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

  // compose OPO geoJson data with performance tier,
  // black donor rank, and congressional investigation bool
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

  const [minX, minY, maxX, maxY] = bbox(stateGeoJson)

  return (
    <Row className={styles.map}>
      <div style={dimensions}>
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
              style={Object.assign(dimensions, { backgroundColor: "#fff" })}
              zoomControl={false}
              dragging={windowWidth > 800}
              className={styles.mapContainer}
            >
              <ZoomControl position="bottomright" />
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
              <GeoJSON
                key={"geom-boundary-and-tooltip"}
                data={view === "state" ? stateGeoJson : opoGeoJson}
                eventHandlers={{
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
                          `<div class="${styles}">
                            <h4>${propagatedFrom?.feature?.properties?.name}</h4>
                            ${getToolTipContent(view, propagatedFrom, stateDataMap, opoDataMap)}
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
                        view === "state" 
                          ? `/state/${propagatedFrom?.feature?.properties?.abbreviation}`
                          : `/opo/${propagatedFrom?.feature?.properties?.opo}`
                      );
                    },  
                  }
                }
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

const query = graphql`
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
`;

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

const getStateMapFill = (feature) => {
  const tier = feature.properties.tier.split(" ")[1];
  if (tier === "Passing") return "#C4C4C4";
  if (tier === "Underperforming") return "#FFB042";
  if (tier === "Failing") return  "#D43C37";
}

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

const getCongressionalInvestigationFill = (feature) => {
   const investigation = feature.properties.congressional_investigation;

   if(investigation) return "#00563f";
   return "#FF0800"
}


const getToolTipContent = (view, propagatedFrom, stateDataMap, opoDataMap) => {
  if (view === "state") return `
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
    }</strong></p>`;

    return `
      <p> Other Stats for OPO here </p>
    `;

}