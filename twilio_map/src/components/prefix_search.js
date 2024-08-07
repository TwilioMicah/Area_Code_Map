import React from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { useMap } from 'react-leaflet';
import L from 'leaflet';



// Define the icon
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const PrefixSearch = ({ coordinatesCallback, prefixData }) => {
  // Get the map instance
 // const map = useMap();

  // Handle item selection
  const handleSelect = (item) => {
        console.log("we inside")
        coordinatesCallback(item)

  };



  return (
    <div >
    <ReactSearchAutocomplete

      maxResults={5}
      items={prefixData}
      onSelect={handleSelect}
      fuseOptions={{
        shouldSort: true,
        threshold: 0.0,
        location: 0,
        distance: 0,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['name'],
      }}
    />
    </div>
  );
};

export default PrefixSearch;
