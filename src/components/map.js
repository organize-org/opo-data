import React from "react";
import { Row } from "react-bootstrap";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const mapContainerDimensions = { height: "60vh", width: "100%" };

export default function Map() {
  return (
    <Row>
      <div style={mapContainerDimensions}>
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              style={{ height: "60vh", width: "100%" }}
              center={[37.09024, -95.712891]}
              zoom={4}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              />
              <GeoJSON data={DSALayer.features} />
            </MapContainer>
          )
        }
      </div>
    </Row>
  );
}
