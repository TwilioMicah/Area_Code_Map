import prefixData from './components/geoData/prefixObject.mjs';

import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import xml2js from 'xml2js';

const app = express();
const port = 8000;

const client = twilio(
    'ACCOUNT_SID',
    'AUTH_TOKEN'
);

async function ListNumberforRateCenter(prefix, country, rateCenter) {
  
  try {
    if (!prefix || !country || !rateCenter) {
      throw new Error('Prefix, country, and rateCenter parameters are required.');
    }

    if (!rateCenter.lata || !rateCenter.rc) {
      throw new Error('Rate center must include both LATA and RC values.');
    }

    //console.log(rateCenter);

    const rawTwilioData = await client.availablePhoneNumbers(country).local.list({
      inLata: rateCenter.lata,
      inRateCenter: rateCenter.rc,
      areaCode: prefix,
      limit: 1,
    });

    if (rawTwilioData.length === 0) {
      throw new Error('No available phone numbers found for the given criteria.');
    }

    //console.log(rawTwilioData);

    const twilioResponse = rawTwilioData[0];
    if (!twilioResponse || !twilioResponse.friendlyName) {
      throw new Error('Invalid Twilio response.');
    }

    const NPA_NXX = twilioResponse.friendlyName.slice(0, -4) + 'xxxx';

    const latitude = twilioResponse.latitude ?? rateCenter.lat;
    const longitude = twilioResponse.longitude ?? rateCenter.lng;
    
    return { npa_nxx: NPA_NXX, center: [latitude, longitude],locality: twilioResponse.locality };

  } catch (error) {
    console.error('Error:', error.message || error);
    return null; // or return an appropriate fallback value
  }
}

async function fetchAndParseXML(prefix) {
  try {
    const response = await fetch(`https://localcallingguide.com/xmlrc.php?npa=${prefix}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text();

    // Check if the XML response is not empty
    if (!data || data.trim() === '') {
      throw new Error('Received empty XML data');
    }

    // Parse the XML data with a Promise
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);

    // Extract the relevant information
    const rateCenters = [];
    const rcDataList = result.rcdata || result.root?.rcdata; // Adjust based on XML structure

    if (!rcDataList || !Array.isArray(rcDataList)) {
      throw new Error('Unexpected XML structure: rcdata is missing or not an array');
    }

    rcDataList.forEach((rcData) => {
      const rc = rcData.rcshort?.[0];
      const lata = rcData.lata?.[0];
      const lat = rcData['rc-lat']?.[0];
      const lng = rcData['rc-lon']?.[0];

      if (rc && lata && lat && lng) {
        rateCenters.push({ rc, lata, lat, lng });
      } else {
        console.warn('Incomplete data for a rate center:', rcData);
      }
    });

    return rateCenters;

  } catch (error) {
    console.error('Error:', error.message || error);
    return [];
  }}

async function listAvailablePhoneNumberLocal(areaCode, countryISO) {
    //need to pass iso country to this function so that it can also search for CA numbers
    const locals = await client.availablePhoneNumbers(countryISO).local.list({
        areaCode: areaCode,
        limit: 20,
    });
    //console.log(locals,"function")
    //console.log(locals)
    return locals.length;
}

//These are functions to handle issues with the localcallingguide api responses
function handle_835_610_484_prefix() {
    /*The overlay array contains 484,610,845
     */
    return ['835', '610', '484'];
}

function handle_206_prefix() {
    /*
When 206 is searched, return 206 which is its noa, not 206,360,564 which are the overlays
*/
    return ['206'];
}

function handle_334_prefix() {
    /*
  When 334 is searched, have it return 334 which is its npa, not 423/729 which is its overlays
  */
    return ['334'];
}

function handle_564_360_prefix() {
    /*
  When 564, or 360 are searched return 564 and 360, not 564,360, and 206
  */
    return ['564', '360'];
}

function prefix_delagator(prefix, endpoint) {
    switch (prefix) {
        case '835':
        case '610':
        case '484':
            return handle_835_610_484_prefix();

        case '206':
            return handle_206_prefix();

        case '334':
            return handle_334_prefix();

        case '564':
        case '360':
            return handle_564_360_prefix();

        default:
            console.log(`No handler found for prefix: ${prefix}`);
    }
}

function prefix_check(prefix) {
    const validPrefixes = ['564', '360', '334', '206', '835', '610', '484'];

    if (validPrefixes.includes(prefix)) {
        return true;
    } else {
        return false;
    }
}

app.use(cors());

app.get('/', async (req, res) => {
  
    const isoCountry = req.query.isoCountry;
 
    const areaCode = parseInt(req.query.prefix, 10);
    //console.log(areaCode)
    const prefix_count = await listAvailablePhoneNumberLocal(
        areaCode,
        isoCountry
    );

    //console.log(prefix_count,"prefixcount")
    res.send(String(prefix_count));
});

app.get('/city', async (req, res) => {
    try {
        const city = req.query.city;
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?city=${city}&countrycodes=US,CA&limit=5&format=json`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cityData = await response.json(); // Parse the response as JSON

        res.json(cityData); // Send the parsed data back as JSON
    } catch (error) {
        console.log(error);
    }
});

app.get('/postalcode', async (req, res) => {
    try {
        const postalCode = req.query.postalcode;
  
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&countrycodes=US,CA&limit=5&format=json`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cityData = await response.json(); // Parse the response as JSON

        res.json(cityData); // Send the parsed data back as JSON
    } catch (error) {
        console.log(error);
    }
});

app.get('/street', async (req, res) => {
  
    try {
        const street = req.query.street;
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?street=${street}&countrycodes=US,CA&limit=5&format=json`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cityData = await response.json(); // Parse the response as JSON

        res.json(cityData); // Send the parsed data back as JSON
    } catch (error) {
        console.log(error);
    }
});

app.get('/prefix', async (req, res) => {
    try {
        
        var matchingPrefixes = [];
        const prefix = req.query.prefix;

        const url = `https://localcallingguide.com/xmllistnpa.php?npa=${prefix}`;

        
        const response = await fetch(url);
   


        if (response.ok) {
            const xmlText = await response.text(); // Get the response as text

            // Parse the XML to JSON using xml2js

            xml2js.parseString(xmlText, (err, result) => {
                if (result.root.error) {
                    
                    return res
                        .json([]);
                } else {
              
                    var data = result.root.npadata[0];

                    if (!prefix_check(prefix)) {
                        if (data.overlay[0].length > 0) {
                            //splitting on '/' ';' ' '

                            const overlayArray =
                                data.overlay[0].split(/[/; ]+/);
                     

                            for (let item of overlayArray) {
                           
                                if (item in prefixData) {
                                    matchingPrefixes.push({
                                        id: prefix,
                                        center: prefixData[item].center,
                                        label: prefix,
                                    });
                                    break;
                                }
                            }
                        } else {
                            if (data.npa[0] in prefixData) {
                                matchingPrefixes.push({
                                    id: prefix,
                                    center: prefixData[data.npa[0]].center,
                                    label: prefix,
                                });
                            }
                        }

                        res.json(matchingPrefixes);
                    } else {
                        const overlayArray = prefix_delagator(prefix, 'prefix');
      
                        for (let item of overlayArray) {
                   
                            if (item in prefixData) {
                                matchingPrefixes.push({
                                    id: prefix,
                                    center: prefixData[item].center,
                                    label: prefix,
                                });
                                break;
                            }
                        }
                        res.json(matchingPrefixes);
                    }
                }
            });
        } else {
          
            return res.json([]);
        }
    } catch (error) {
    
        return res.json([]);
    }
});

app.get('/prefixOverlays', async (req, res) => {
    try {
     
        const prefix = req.query.prefix;

        const url = `https://localcallingguide.com/xmllistnpa.php?npa=${prefix}`;

        ///
        const response = await fetch(url);

        if (response.ok) {
            const xmlText = await response.text(); // Get the response as text

            // Parse the XML to JSON using xml2js

            xml2js.parseString(xmlText, (err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ error: 'Failed to parse XML data.' });
                } else {
                    if (!prefix_check(prefix)) {
                        var data = result.root.npadata[0];
                        if (data.overlay[0].length > 0) {
                            //splitting on '/' ';' ' '

                            const overlayArray =
                                data.overlay[0].split(/[/; ]+/);
                           
                            res.json(overlayArray);
                        } else {
                       
                            res.json([data.npa[0]]);
                        }
                    } else {
                        const overlayArray = prefix_delagator(prefix, 'prefix');
                        res.json(overlayArray);
                    }
                }
            });
        } else {
            return res.status(500).json({ error: 'Failed to fetch XML data.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Unexpected Error' });
    }
});



app.get('/rateCenters', async (req, res) => {

  try {
    const prefix = req.query.prefix;

    if (!prefix) {
      return res.status(400).json({ error: 'Prefix query parameter is required' });
    }

    const rateCenterData = await fetchAndParseXML(prefix);

    if (rateCenterData.length === 0) {
      return res.status(404).json({ error: 'No rate center data found or an error occurred' });
    }

    res.json(rateCenterData);

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/npaLocalities', async (req, res) => {
  
  try {
    const prefix = req.query.prefix;
    const country = req.query.country;
    const rateCenterString = req.query.rateCenter;

    const decodedRateCenterString = decodeURIComponent(rateCenterString);
    const rateCenter = JSON.parse(decodedRateCenterString);
    
    // Validate required query parameters
    if (!prefix || !country || !rateCenter) {
      return res.status(400).json({ error: 'Prefix, country, and rate center are required.' });
    }

    // Call the listAvailablePhoneNumberLocal function
    const pnObject = await ListNumberforRateCenter(prefix, country, rateCenter);

    // Check if the function returned a valid object
    if (!pnObject) {
      return res.json({ error: 'No available phone number found for the given criteria.' });
    }

    // Send the response
    res.json(pnObject);

  } catch (error) {
    // Handle any unexpected errors
    console.error('Error:', error.message || error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
