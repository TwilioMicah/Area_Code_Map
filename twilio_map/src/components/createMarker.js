import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const CreateMarker = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (map && coordinates && coordinates.center) {
      const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // Add a marker to the map
      L.marker(coordinates.center, { icon: greenIcon }).addTo(map);

      // Optionally, you can center the map on the new marker
      map.flyTo(coordinates.center, 7);
    } else {
      console.error('Map or coordinates.center is not available');
    }
  }, [coordinates]);

  return null; // No UI rendering needed
};

export default CreateMarker;
