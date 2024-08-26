import React, { useRef,useState, useEffect } from 'react';
import geojsonData from './geoData/Area__Code__Boundaries.json';
import {GeoJSON} from 'react-leaflet';
import prefixData from './geoData/prefixData'
  
//layer.resetStyle() to reset style
const AreaCodeFeatures = React.memo(({prefixsearchData,showModalTrigger,tileUpdate}) => {

    //let searchArraytmp = []
    let searchDic = {}

    const layerRef = useRef([]);


    useEffect(() => {
      // Update styles for all layers when selectedPrefix changes
      layerRef.current?.forEach((layer) => {
    
        const feature = layer.feature;
        if (feature.properties.NPA == tileUpdate?.label) {
     
          layer.setStyle({
            fillColor: '#f7941d',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
          });
        } 

        else{

          layer.setStyle({fillColor :'#008CFF',
          weight: 2,
          opacity: 1,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.7});

        }
      });
    }, [tileUpdate]);

const onEachFeature = async (feature, layer) => {
  

  
  layerRef.current.push(layer);
  
  //sets initial style for layers


    layer.setStyle({fillColor :'#008CFF',
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7});

  
    layer.on('add', () => {
        let center = layer.getCenter()
        const npa = feature.properties.NPA
   



//creates object
if(!(npa in searchDic)){
  searchDic[npa] = { id: npa,"center": center, "label": npa }

}



    });
    ////Styling for hover of a tile
    layer.on('mouseover', function () {
      layer.setStyle({
      weight: 4,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: .9});
    });
  
    layer.on('mouseout', function () {
      // Reset to the original style after hover
      layer.setStyle({
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7});
    })

    //////
    layer.on('click', async (e) => {
        let isoCountry 
        const npa = feature.properties.NPA
        console.log(feature.properties)
        if(feature.properties.COUNTRY === "CANADA"){
          isoCountry = "CA"
        }
        else{
          isoCountry = "US"
        }

        
        const response = await fetch(`http://localhost:8000/prefixOverlays?prefix=${npa}`);
        const formattedResponse = await response.json()
 
       
        showModalTrigger(formattedResponse,isoCountry)

      //console.log(feature.properties.NPA,"hello!");
    });
  };
return(
  <GeoJSON data={geojsonData}  onEachFeature={onEachFeature} />
)

});

export default AreaCodeFeatures;