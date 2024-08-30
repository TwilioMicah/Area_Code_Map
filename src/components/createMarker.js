import React, { useState,useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const CreateMarker = ({ coordinates,queryType }) => {

  const map = useMap();
  const [marker,setMarker] = useState(0)


  const phoneIconSvg = (dimension) => { 
  
      
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" fill="#E04C4C	" class="bi bi-telephone-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
      </svg>`;
  };
  
  const phoneIconBase64 = (dimension) => {
   
    const svg = phoneIconSvg(dimension);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const orangeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const phoneIcon = (dimension) => 
 
  
  L.icon({
    iconUrl: phoneIconBase64(dimension),
    iconSize: [dimension, dimension],  // Icon's size
    iconAnchor: [dimension/2 , dimension],  // Adjusted anchor point
    popupAnchor: [-20, -34],  // Popup's anchor point
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [dimension+10, dimension]  // Adjusted shadow size
  });

  

  

  const bouncingphoneMarker = (item, map, dimension) => {
    // Create the marker with the initial icon
    const marker = L.marker(item.center, { icon: phoneIcon(dimension) })
      .addTo(map)
      .bindPopup(`
        <strong>NPA-NXX:</strong> ${item.npa_nxx}<br>
        <strong>Locality:</strong> ${item.locality}
      `);
  
    // Add hover event listeners
    marker.on('mouseover', () => {
      // Change the icon size when hovering
      marker.setIcon(phoneIcon(dimension + 5)); // Increase the dimension by 10 on hover
    });
  
    marker.on('mouseout', () => {
      // Reset the icon size when not hovering
      marker.setIcon(phoneIcon(dimension));
    });
  
    return marker;
  };
   
  //let marker;
  useEffect(() => {
    //console.log(queryType,"hellsfsdf")
    if (map && coordinates && (coordinates?.center || coordinates[0]?.center)) {

      if(marker !== 0){
        marker.remove()
      }
      // Add a marker to the map

      if(queryType === 'prefix' && coordinates[0] ){
    
        
        for(var item of coordinates){
          
          bouncingphoneMarker(item,map,25)
  
        }

      }
      else if(queryType !== 'prefix'){

   
 
        setMarker(
          L.marker(coordinates.center, { icon: orangeIcon })
            .addTo(map)
            .bindPopup(coordinates.label)
        );

          
    }

    if(!coordinates[0] ){
    map.flyTo(coordinates.center, 7);
    }
      //L.marker(coordinates.center, { icon: greenIcon }).addTo(map);
      
      // Optionally, you can center the map on the new marker
     
    } 
    
    
    else {
      console.error('Map or coordinates.center is not available');
    }
  }, [coordinates,map]);

  return null; // No UI rendering needed
};

export default CreateMarker;
