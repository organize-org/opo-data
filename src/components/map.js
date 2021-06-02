import React from "react";
import { Row } from "react-bootstrap";
import { MapContainer, TileLayer } from "react-leaflet";

const mapContainerDimensions = { height: "60vh", width: "100%" };

export default function Map() {
  console.log(DSALayer);

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
            </MapContainer>
          )
        }
      </div>
    </Row>
  );
}
