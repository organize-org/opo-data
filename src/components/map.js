import React from "react";
import { Row } from "react-bootstrap";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { Table } from "react-bootstrap";

<<<<<<< HEAD
const mapContainerDimensions = { height: "60vh", width: "100%" };
=======
export default function Map({ tableData, geoData }) {
  console.log("tabledata", tableData);
  console.log("geodata", geoData[0]);

  const tierData = tableData.reduce((tableDataMap, tableRow) => ({
    ...tableDataMap,
    [tableRow.OPO]: tableRow
  }), {})

  const transformed = {
         ...geoData[0],
         features: geoData[0].features.map(feature => ({
           ...feature,
           properties: {
           ...feature.properties,
             tier: tierData[feature.properties.name]?.Tier
        }}))
          };

console.log('tierdata', tierData)
console.log('transform', transformed)

  function getColor(tier){
      return tier === '3 Failing' ? '#D43C37' :
            tier === '2 Underperforming' ? 'yellow' :
            tier === '1 Passing'  ? 'green' :
                                    'white';
  }
>>>>>>> transformed geoData to add tier name, added color by tier to map

export default function Map() {
  return (
<<<<<<< HEAD
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
=======
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
      {/* <GeoJSON data={geoData} /> */}
      <GeoJSON
        data={transformed}
        style={(feature) => ({
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillColor: getColor(feature.properties.tier),
        fillOpacity: 0.7
        })}
      />
    </MapContainer>
>>>>>>> transformed geoData to add tier name, added color by tier to map
  );
}
