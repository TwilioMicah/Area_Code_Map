// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from 'twilio';
import xml2js from 'xml2js';
import fetch from 'node-fetch';
// client sends npa to backend to get rate center data
// rate center data gets passed to front end.
// front end sends batches of 25 to backend.
// backend returns {NPA-NXX-****:[lat,long],NPA-NXX-****:[lat,long]...}
// once complete, send data to createMarker.js where markers will be created for the seleted NPA
const client = twilio("ACe199dcf9929ded3083523cbd3872fd8f", "ee5d18d3e3b92e15ffdff23efa7a6bf3");



async function fetchAndParseXML(prefix) {
  try {
    const response = await fetch(`https://localcallingguide.com/xmlrc.php?npa=${prefix}`);
    const data = await response.text();
    
    // Parse the XML data with a Promise
    const parser = new xml2js.Parser();

    const result = await parser.parseStringPromise(data); // use parseStringPromise instead

    // Extract the relevant information
    const rateCenters = [];
    const rcDataList = result.rcdata || result.root.rcdata; // Adjust based on XML structure

    rcDataList.forEach(rcData => {
      //console.log()
      const rc = rcData.rcshort[0];
      const lata = rcData.lata[0];
      const lat = rcData['rc-lat'][0];
      const lng = rcData['rc-lon'][0];
      rateCenters.push({ rc, lata,lat,lng });
    });

    return rateCenters

  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}


async function listAvailablePhoneNumberLocal() {
  const rateCenterData = await fetchAndParseXML('503');
  console.log(rateCenterData); // Should log the array of rate centers

  if (rateCenterData && rateCenterData.length > 0) {
    const numbers = [];

    for (const item of rateCenterData) {
      const locals = await client.availablePhoneNumbers("US").local.list({
        inLata: item.lata,
        inRateCenter: item.rc,
        limit: 1,
      });
      
      locals.forEach((l) => {
      const NPA_NXX = l.friendlyName.slice(0, -4) + 'xxxx';
      
      const latitude = l.latitude !== null && l.latitude !== undefined ? l.latitude : item.lat;
      const longitude = l.longitude !== null && l.longitude !== undefined ? l.longitude : item.lng;

      numbers.push({ npa_nxx: NPA_NXX, center: [latitude,longitude]})
      
      }
      );
    }

    console.log(numbers); // Should log the list of numbers with coordinates
  } else {
    console.log('No rate center data found.');
  }
}

listAvailablePhoneNumberLocal();

  


