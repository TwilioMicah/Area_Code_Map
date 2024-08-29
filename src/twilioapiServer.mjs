import prefixData from './components/geoData/prefixObject.mjs';

import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import xml2js from 'xml2js';

const app = express();
const port = 8000;

const client = twilio(
    'ACe199dcf9929ded3083523cbd3872fd8f',
    'ee5d18d3e3b92e15ffdff23efa7a6bf3'
);

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
    console.log(req.query);
    const isoCountry = req.query.isoCountry;
    console.log(isoCountry);
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
        console.log(postalCode, 'postal');
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
    console.log('street');
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
                    var data = result.root.npadata[0];

                    if (!prefix_check(prefix)) {
                        if (data.overlay[0].length > 0) {
                            //splitting on '/' ';' ' '

                            const overlayArray =
                                data.overlay[0].split(/[/; ]+/);
                            console.log(overlayArray, 'data');

                            for (let item of overlayArray) {
                                console.log(item);
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
                        console.log(matchingPrefixes, 'matchingprefies');
                        res.json(matchingPrefixes);
                    } else {
                        const overlayArray = prefix_delagator(prefix, 'prefix');
                        console.log(overlayArray);
                        for (let item of overlayArray) {
                            console.log(item);
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
            return res.status(500).json({ error: 'Failed to fetch XML data.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Unexpected Error' });
    }
});

app.get('/prefixOverlays', async (req, res) => {
    try {
        console.log(req.query);
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
                            console.log(overlayArray, 'data2 s');
                            res.json(overlayArray);
                        } else {
                            console.log(data.npa[0]);
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
