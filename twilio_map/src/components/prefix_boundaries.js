import React, { useRef,useState, useEffect } from 'react';
import geojsonData from './geoData/Area__Code__Boundaries.json';
import {GeoJSON} from 'react-leaflet';
import prefixData from './geoData/prefixData'
  
//layer.resetStyle() to reset style
const AreaCodeFeatures = React.memo(({prefixsearchData,showModalTrigger,tileUpdate}) => {

    let searchArraytmp = []

    const layerRef = useRef([]);
    const seenEntries = new Set();


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

const onEachFeature = (feature, layer) => {
  

  
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
        let tmpArray = []

//this is not really being used in code currently. I have saved this data to prefixObject.js and am using that currently
if(searchArraytmp.length<456){ 
 
for (let subarray of prefixData) {
  if (subarray.includes(Number(npa))) {

    for (let item of subarray){
      //console.log(item)
        if (!seenEntries.has(String(item))){
        tmpArray.push({ id: String(item),"center": center, "label": String(item) })
        seenEntries.add(String(item))
        }
      }
  }
}
        if (tmpArray.length>0){
            searchArraytmp.push(...tmpArray)
        }
       if (tmpArray.length === 0){
        if (!seenEntries.has(npa)){
                searchArraytmp.push({id: npa,"center": center, "label":npa})
                seenEntries.add(npa)
        }
       }
       
       console.log(searchArraytmp.length,"prefixarrayCount Must equal 434")
       //console.log(searchArraytmp)
       if(searchArraytmp.length==434){
        
        
        prefixsearchData(searchArraytmp)
       }
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
    layer.on('click', (e) => {  
        const npa = feature.properties.NPA
       
 
        let tmpArray
        prefixData.forEach(subarray => {
            if (subarray.includes(Number(npa))) {
                
                tmpArray = subarray
            }

      
          });
  
       if (tmpArray?.length>0){
        showModalTrigger(tmpArray)
       }
       else{
        showModalTrigger([npa])
       }
      //console.log(feature.properties.NPA,"hello!");
    });
  };
return(
  <GeoJSON data={geojsonData}  onEachFeature={onEachFeature} />
)

});

export default AreaCodeFeatures;