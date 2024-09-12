import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import React, { useEffect } from 'react';
import 'leaflet-geosearch/dist/geosearch.css'; // Import CSS for geosearch
import {useMap} from 'react-leaflet';

var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

const AddressSearch = React.memo(() => {
    const provider = new OpenStreetMapProvider({
        params: {
          countrycodes: 'us,ca', // Restrict to US and Canada
        },
      });
    
      const searchControl = new GeoSearchControl({
        marker: {
          // optional: L.Marker    - default L.Icon.Default
          icon: greenIcon,
          draggable: false,
        },
        style: 'bar', // optional: bar|button  - default button
        provider: provider,
        retainZoomLevel: true,
      });
    
      const map = useMap();
      useEffect(() => {
        map.addControl(searchControl);
        return () => map.removeControl(searchControl);
      }, [map, searchControl]);
    
      return null;
});

export default AddressSearch;