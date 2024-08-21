import React, { useState,useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const CreateMarker = ({ coordinates }) => {

  const map = useMap();
  const [marker,setMarker] = useState(0)
  //let marker;
  useEffect(() => {
    if (map && coordinates && coordinates.center) {
      const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // Add a marker to the map
      if (marker !== 0){
      console.log(marker,"markercheck")
      marker.remove()
      setMarker(L.marker(coordinates.center, { icon: greenIcon }).addTo(map))
      }
      else{
        console.log(marker,"markercheck2")
        setMarker(L.marker(coordinates.center, { icon: greenIcon }).addTo(map))
      }
      //L.marker(coordinates.center, { icon: greenIcon }).addTo(map);
      
      // Optionally, you can center the map on the new marker
      map.flyTo(coordinates.center, 7);
    } else {
      console.error('Map or coordinates.center is not available');
    }
  }, [coordinates]);

  return null; // No UI rendering needed
};

export default CreateMarker;
