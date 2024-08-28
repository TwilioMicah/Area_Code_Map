import React, { useRef, useState, useEffect } from 'react';
import geojsonData from './geoData/coords.json';
import { GeoJSON } from 'react-leaflet';
//layer.resetStyle() to reset style



const AreaCodeFeatures = React.memo(
    ({ showModalTrigger, tileUpdate, coordinates }) => {
        //console.log(tileUpdate,"micahsdhshsh")
        let searchDic = {};

        const layerRef = useRef([]);

        useEffect(() => {
            // Update styles for all layers when selectedPrefix changes

            layerRef.current?.forEach((layer) => {
                /*
        var polygonTile = layer.feature.geometry.coordinates
        if(coordinates?.center){
          console.log(coordinates.center,polygonTile,"hellooooo")
          // Convert `coordinates.center` to a GeoJSON point
          const centerPoint = turf.point(coordinates.center);
          console.log(polygonTile)
          // Convert `polygonTile` to a GeoJSON polygon
          const polygon = turf.polygon([polygonTile]);
          //console.log(polygon)
  // Check if the point is inside the polygon
          if (turf.booleanPointInPolygon(centerPoint, polygon)) {
            console.log(coordinates.center);
          }
      }
      */
                const feature = layer.feature;
                console.log(tileUpdate?.includes(feature.properties.NPA?.toString()))

                if (tileUpdate?.includes(feature.properties.NPA?.toString())) {
                    layer.setStyle({
                        fillColor: '#f7941d',
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7,
                    });
                } else {
                    layer.setStyle({
                        fillColor: '#008CFF',
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7,
                    });
                }
            });
        }, [tileUpdate]);

        const onEachFeature = async (feature, layer) => {
            layerRef.current.push(layer);

            //sets initial style for layers

            layer.setStyle({
                fillColor: '#008CFF',
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
            });

            layer.on('add', () => {
                let center = layer.getCenter();
                const npa = feature.properties.NPA;

                //creates object
                if (!(npa in searchDic)) {
                    searchDic[npa] = { id: npa, center: center, label: npa };
                }
            });
            ////Styling for hover of a tile
            layer.on('mouseover', function () {
                layer.setStyle({
                    weight: 4,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.9,
                });
            });

            layer.on('mouseout', function () {
                // Reset to the original style after hover
                layer.setStyle({
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7,
                });
            });

            //////
            layer.on('click', async (e) => {
                let isoCountry;
                const npa = feature.properties.NPA;
                console.log(feature.properties);
                if (feature.properties.COUNTRY === 'CANADA') {
                    isoCountry = 'CA';
                } else {
                    isoCountry = 'US';
                }

                const response = await fetch(
                    `http://localhost:8000/prefixOverlays?prefix=${npa}`
                );
                const formattedResponse = await response.json();

                showModalTrigger(formattedResponse, isoCountry);

                console.log(feature.properties);
            });
        };
        return <GeoJSON data={geojsonData} onEachFeature={onEachFeature} />;
    }
);

export default AreaCodeFeatures;
