import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AreaCodeFeatures from './components/prefix_boundaries';
import PrefixModal from './components/prefix_modal';
import PrefixSearch from "./components/prefix_search";
import Searchdropdown from "./components/search_drop_down"
import CreateMarker from "./components/createMarker"
import Twiliologo from "./components/TwilioLogo.png"

/* TODO:
   - Add ability to search by prefix and city. When searched, it will fly to the location.
   - If city is searched, it will center on the city.
   - If prefix is searched, it will center on the polygon that contains the prefix and change the color of the area to blue.
   - Remove popup functionality as this might be confusing.
   - For the modal, add labels that describe stock level for each prefix. Display exact number of available numbers if less than 1000, otherwise 1000+.
   - Fix the geojson(json) file to not have multiple prefixes for a single feature. This is causing the darker feature tiles as multiple layers are stacked. We only need one prefix as this is used to lookup the other available ones.
   - Get center on search: polygon.getBounds().getCenter();

   Data:
   - https://docs.google.com/spreadsheets/d/1iBwXIqzVngu2uMRpVjEH4VwOXzFJW8LdidvNNencrQI/edit?gid=0#gid=0
   - https://help.twilio.com/articles/223182988

   SEARCH:
   - Example: https://nominatim.openstreetmap.org/search?city=seattle&format=json
   - Documentation: https://nominatim.org/release-docs/latest/api/Search/

  GitToken:
  -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
   
*/

function App() {
  const [showModal, setShowModal] = useState(0);
  const [prefixArray, setPrefixArray] = useState([]);
  const [prefixSearchArray, setPrefixSearchArray] = useState([{ id: 0, name: 'loading' }]);
  const [searchmarkerCoordinates,setsearchmarkerCoordinates] = useState([])

  
  const modalShow = (subarray) => {
    setShowModal(prevShowModal => prevShowModal + 1);
    setPrefixArray(subarray);
  };

  const prefixCallback = (prefixData) => {
    console.log(prefixData, "hello");
    setPrefixSearchArray(prefixData);
  };

  const coordinatesCallback = (coordinates) => {
    console.log(coordinates)
    setsearchmarkerCoordinates(coordinates);
  };

  return (
    <div style={{ height: '100vh' }}>
              <div style={{ 
          height: '70px', 
          position: 'absolute', 
          zIndex: 999, 
          top: '0px', 
          left: '0px', 
          width: '100%', // Adjust width as needed
          backgroundColor: '#0D122B',
  
        }}>

          <div style = {{left: '0px', width: '100px', position: 'relative', zIndex: 1004}}>
          <img style={{ width: '100%' }} src={Twiliologo} alt="PIC" 
          
          
          />

          </div>
          <div style={{ 
            zIndex: 1004,
      
            position: 'absolute', 
            top: '0px', 
            left: '50%', 
            width: '500px', // Adjust width as needed
            height: '100px', // Adjust height as needed
            transform: 'translateX(-50%)', // Center the element horizontally
            justifyContent: 'center',
            display: 'flex'
          }}>
            <div style={{ marginTop: '13px',width: '300px' }}>
              <PrefixSearch coordinatesCallback = {coordinatesCallback} prefixData={prefixSearchArray} />
            </div>
            <div style = {{marginRight: '10px'}}>

            </div>
            <div style={{ marginTop: '16px'}}>
                  <Searchdropdown/>
            </div>
          </div>
        </div>

      <MapContainer
        center={[39.50, -98.35]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
        minZoom={5}
      >


        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=197c870678314254ae332bcd6f5661d0"
        />
        <AreaCodeFeatures prefixsearchData={prefixCallback} showModalTrigger={modalShow} />
        <PrefixModal prefixArray={prefixArray} showModal={showModal} />
        <CreateMarker coordinates = {searchmarkerCoordinates}/>
      </MapContainer>
    </div>
  );
}

export default App;
