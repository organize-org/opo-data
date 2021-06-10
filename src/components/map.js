import React from "react";
import { Row } from "react-bootstrap";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const mapContainerDimensions = { height: "60vh", width: "100%" };

const getColor = tier => {
  switch (tier) {
    case "3 Failing":
      return "#D43C37";
    case "2 Underperforming":
      return "#FFB042";
    default:
      return "#C4C4C4";
  }
};

export default function Map({ geoData }) {
  return (
    <Row>
      <div style={mapContainerDimensions}>
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              style={mapContainerDimensions}
              center={[37.09024, -95.712891]}
              zoom={4}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              />
              <GeoJSON
                data={geoData}
                style={feature => ({
                  weight: 2,
                  opacity: 1,
                  color: "white",
                  dashArray: "3",
                  fillColor: getColor(feature.properties.tier),
                  fillOpacity: 0.7,
                })}
              />
            </MapContainer>
          )
        }
      </div>
    </Row>
  );
}
