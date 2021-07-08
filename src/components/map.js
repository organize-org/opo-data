import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { GeoJSON, MapContainer, TileLayer, ZoomControl } from "react-leaflet";

const tierColors = {
  "1 Passing": "#C4C4C4",
  "2 Underperforming": "#FFB042",
  "3 Failing": "#D43C37",
};

export default function Map({
  center = [37.09024, -95.712891],
  dimensions = { height: "60vh", width: "100%" },
  dsaGeoJSON,
  interactive = false,
  maxZoom = 7,
  minZoom = 3,
  statesGeoJSON,
  zoom = 4,
}) {
  return (
    <Row>
      <div style={dimensions}>
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              center={center}
              maxZoom={maxZoom}
              minZoom={minZoom}
              scrollWheelZoom={false}
              style={dimensions}
              zoom={zoom}
              zoomControl={false}
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              />
              <GeoJSON
                data={dsaGeoJSON}
                style={feature => ({
                  weight: 0.5,
                  opacity: 1,
                  color: "white",
                  fillColor: tierColors[feature.properties.tier],
                  fillOpacity: 0.7,
                })}
              />
              <GeoJSON
                data={statesGeoJSON}
                eventHandlers={
                  interactive
                    ? {
                        mouseover: ({ target, layer }) =>
                          target
                            ?.setStyle(
                              f =>
                                f?.properties?.name ===
                                  layer?.feature?.properties?.name && {
                                  color: "#373737",
                                  fillOpacity: 0.3,
                                  weight: 3,
                                }
                            )
                            .bindTooltip(layer?.feature?.properties?.name, {
                              direction: "bottom",
                              offset: [0, 20],
                              sticky: true,
                            })
                            .openTooltip(),
                        mouseout: ({ target }) => target?.resetStyle(),
                        click: ({ layer }) =>
                          // TODO: click -> State page
                          console.log(layer?.feature?.properties?.name),
                      }
                    : null
                }
                style={{
                  color: "#373737",
                  fillOpacity: 0,
                  weight: 1.5,
                }}
              />
              <div
                className="leaflet-bottom leaflet-right"
                style={{ right: "45px", bottom: "15px" }}
              >
                <div
                  className="leaflet-control leaflet-bar"
                  style={{ background: "#FFFFFF", padding: "0 10px" }}
                >
                  <Container>
                    <Row md="auto" className="justify-content-center">
                      <h4>Performance Tier</h4>
                    </Row>
                    {Object.keys(tierColors).map(tier => (
                      <Row key={tier}>
                        <Col md="auto">
                          <div
                            style={{
                              background: tierColors[tier],
                              height: "25px",
                              width: "30px",
                            }}
                          ></div>
                        </Col>
                        <Col>
                          <p>{tier.split(" ")[1]}</p>
                        </Col>
                      </Row>
                    ))}
                  </Container>
                </div>
              </div>
            </MapContainer>
          )
        }
      </div>
    </Row>
  );
}
