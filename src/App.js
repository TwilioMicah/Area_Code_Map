import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AreaCodeFeatures from './components/prefix_boundaries';
import PrefixModal from './components/prefix_modal';
import PrefixSearch from './components/prefix_search';
import Searchdropdown from './components/search_drop_down';
import CreateMarker from './components/createMarker';

import ResetButton from './components/reset_button';
import BlueTwiliologo from './components/blueLogo.png';

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
   - Example: https://nominatim.openstreetmap.org/search?city=seattle&format=json&polygon_geojson&country=US
   - Documentation: https://nominatim.org/release-docs/latest/api/Search/
012, Dodge County, Nebraska, United States
  GitToken:
  -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

  --https://turfjs.org/docs/api/booleanOverlap possible solution to finding overlapping shapes
  --https://geojson.io/#new&map=2/0/20 to edit map features
  OR
  https://stackoverflow.com/questions/65158080/powerful-geojson-editor-to-edit-10mb-worth-of-geojson-data
   
*/

function App() {
    const [showModal, setShowModal] = useState(0);
    const [prefixArray, setPrefixArray] = useState([]);
    const [searchmarkerCoordinates, setsearchmarkerCoordinates] = useState([]);
    const [queryType, setqueryType] = useState('prefix');
    const [searchoverlayArray, setsearchoverlayArray] = useState([]);
    const [modalCountry, setmodalCountry] = useState('US');



    const markerDataNPACallBack = (NPAobj) =>{

        setqueryType('prefix')
        setsearchmarkerCoordinates(NPAobj)

    }

    const modalShow = (subarray, countryISO) => {
        setShowModal((prevShowModal) => prevShowModal + 1);
        setPrefixArray(subarray);
        setmodalCountry(countryISO);
    };

    const coordinatesCallback = (coordinates) => {
        setsearchmarkerCoordinates(coordinates);
    };

    const overlayarrayCallback = (overlayArray) => {
        setsearchoverlayArray(overlayArray);
    };

    const handlesearchType = (searchType) => {

        setqueryType(searchType);
    };

    return (
        <div style={{ height: '100vh' }}>
            <div
                style={{
                    height: '70px',
                    position: 'absolute',
                    zIndex: 999,
                    top: '0px',
                    left: '0px',
                    width: '100%', // Adjust width as needed
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #c4c4c4',
                }}
            >
                <div
                    style={{
                        left: '0px',
                        marginTop: '0px',
                        width: '150px',
                        position: 'relative',
                        zIndex: 1004,
                    }}
                >
                    <img
                        style={{ width: '100%' }}
                        src={BlueTwiliologo}
                        alt="PIC"
                    />
                </div>
                <div
                    style={{
                        zIndex: 1004,

                        position: 'absolute',
                        top: '0px',
                        left: '50%',
                        width: '500px', // Adjust width as needed
                        height: '100px', // Adjust height as needed
                        transform: 'translateX(-50%)', // Center the element horizontally
                        justifyContent: 'center',
                        display: 'flex',
                    }}
                >
                    <div
                        style={{
                            marginTop: '7px',
                            width: '300px',
                            maxHeight: '50px',
                        }}
                    >
                        <PrefixSearch
                            searchType={queryType}
                            overlayarrayCallback={overlayarrayCallback}
                            coordinatesCallback={coordinatesCallback}
                        />
                    </div>
                    <div style={{ marginRight: '10px' }}></div>
                    <div
                        style={{
                            backgroundColor: 'white',
                            zIndex: 3000,
                            postition: 'absolute',
                            marginLeft: '-43px',
                            marginTop: '23px',
                            height: '25px',
                            width: '25px',
                        }}
                    >
                        <Searchdropdown handlesearchType={handlesearchType} />
                    </div>
                </div>
            </div>

            <MapContainer
                center={[39.5, -98.35]}
                zoom={5}
                scrollWheelZoom={true}
                loadingControl={true}
                style={{ height: '100vh', width: '100%' }}
                zoomControl={false}
                minZoom={5}
            >
                <div
                    style={{
                        zIndex: 1000,
                        position: 'absolute',
                        right: '25px',
                        marginTop: '25px',
                    }}
                >
                    <ResetButton />
                </div>

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=197c870678314254ae332bcd6f5661d0"
                />
                <AreaCodeFeatures
                    tileUpdate={searchoverlayArray}
                    coordinates={searchmarkerCoordinates}
                    showModalTrigger={modalShow}
                />
                <PrefixModal
                    prefixArray={prefixArray}
                    countryISO={modalCountry}
                    showModal={showModal}
                    markerDataNPACallBack = {markerDataNPACallBack}
                />
                <CreateMarker
                    queryType={queryType}
                    coordinates={searchmarkerCoordinates}
                />
            </MapContainer>
        </div>
    );
}

export default App;
