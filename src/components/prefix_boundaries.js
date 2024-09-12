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

                const feature = layer.feature;
       

                if (tileUpdate?.includes(feature.properties.NPA?.toString())) {
                    layer.setStyle({
                        fillColor: '#f7941d',
                        weight: 2,
                        opacity: .8,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.6,
                    });
                } else {
                    layer.setStyle({
                        fillColor: '#008CFF',
                        weight: 2,
                        opacity: .8,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.6,
                    });
                }
            });
        }, [tileUpdate]);

        const onEachFeature = async (feature, layer) => {
            layerRef.current.push(layer);

            //sets initial style for layers
    //#008CFF


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
                    weight: 3,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7,
                });
            });

            layer.on('mouseout', function () {
                // Reset to the original style after hover
                layer.setStyle({
                    weight: 2,
                    opacity: .8,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.6,
                });
            });

            //////
            layer.on('click', async (e) => {
                let isoCountry;
                const npa = feature.properties.NPA;
     
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

            });
        };
        return <GeoJSON data={geojsonData} onEachFeature={onEachFeature} />;
    }
);

export default AreaCodeFeatures;
