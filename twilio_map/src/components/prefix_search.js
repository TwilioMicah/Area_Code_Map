import React, { useState, useEffect,useCallback } from 'react';
import L from 'leaflet';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import prefixLocationData from './geoData/prefixObject.mjs'
import '@mui/material/styles';


//I want the options to appear on buttom click on the search bar. Will toggle menue under the search
// bar that will display filter options.. maybe a modal popup?

// Define the icon
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const PrefixSearch = ({ searchType,coordinatesCallback,overlayarrayCallback }) => {

const [searchData,setsearchData] = useState([])
const [loading, setIsLoading] = useState(false);
//console.log(searchType,"PrefixSearch")
//console.log(searchData)
  // Get the map instance
 // const map = useMap();

  // Handle item selection
  const handleSelect = async (event,newValue) => {
        
        if(newValue){
        const response = await fetch(`http://localhost:8000/prefixOverlays?prefix=${newValue.label}`);
        const formattedResponse = await response.json()

        coordinatesCallback(newValue)
        overlayarrayCallback(formattedResponse)

        }
  };

  const fetchData = async (data) => {

    setIsLoading(true);
    

    
    try {
     
      const response = await fetch(`http://localhost:8000/${searchType}?${searchType}=${data}`);
      
          

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }


      
      const dataResponse = await response.json();


      if (searchType === "prefix"){



        const formattedResponse = dataResponse.map((item, index) => ({
          id: index, // Ensure unique id
          label: item.label,
          center: [item.center.lat, item.center.lng],
        }));
    
        setsearchData(formattedResponse);

      }
      else{
      const formattedResponse = dataResponse.map((item, index) => ({
        id: index, // Ensure unique id
        label: item.display_name,
        center: [item.lat, item.lon],
      }));

      setsearchData(formattedResponse);
    }
      //
    } catch (error) {
      console.log('Error fetching city data:', error);
      setsearchData([]); // Reset searchData on error
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Debounced fetchData function
  const debouncedFetchData = useCallback(debounce(fetchData, 300), [[searchType]]);
  

  return (

    <div >
<Autocomplete
  disablePortal
  options={searchData}
  loading={loading}
  filterOptions={(x) => x}
  onInputChange={(event, newInputValue) => {
    if (newInputValue) {
      debouncedFetchData(newInputValue);
    }
  }}
  onChange={handleSelect}
  isOptionEqualToValue={(option, value) => option.id === value?.id}
  sx={{
    width: 300,
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label={`search by ${searchType}`}
      InputLabelProps={{
        sx: {
          '&.Mui-focused': {
            marginTop: '5px',
          },
          '&.MuiFormLabel-filled': {
            marginTop: '6px',
          },
        },
      }}
      sx={{
        backgroundColor: '#fff', // White background to stand out
        borderRadius: '1px', // Rounded corners
        '& .MuiOutlinedInput-root': {
          borderColor: 'rgba(0, 0, 0, 0.23)', // Default border color
          '&:hover fieldset': {
            borderColor: '#000', // Darker border on hover
          },
          '&.Mui-focused fieldset': {
            borderColor: '#000', // Darker border when focused
            borderWidth: '1.5px', // Change the border size when focused
          },
        },
      }}
    />
  )}
  PaperProps={{
    sx: {
      border: '1px solid rgba(0, 0, 0, 0.12)', // Border around the dropdown
      backgroundColor: '#fff', // Dropdown background
    },
  }}
/>



  
    </div>
    
  );
};
/*
    <ReactSearchAutocomplete

      maxResults={5}
      inputDebounce={500}
      items={searchData}
      onSelect={handleSelect}
      onSearch={fetchData}
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

*/
export default PrefixSearch;
