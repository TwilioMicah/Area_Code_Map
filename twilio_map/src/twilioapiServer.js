const prefixData = require('./prefixObject')
const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');



const twilio = require("twilio"); 

const client = twilio('ACe199dcf9929ded3083523cbd3872fd8f', 'ee5d18d3e3b92e15ffdff23efa7a6bf3');

async function listAvailablePhoneNumberLocal(areaCode) {
    //need to pass iso country to this function so that it can also search for CA numbers
  const locals = await client.availablePhoneNumbers("US").local.list({
    areaCode: areaCode,
    limit: 20
  });
  //console.log(locals,"function")
  //console.log(locals)
  return locals.length
}


app.use(cors());

app.get('/', async(req, res) => {
  const areaCode = parseInt(req.query.prefix, 10);
  //console.log(areaCode)
  const prefix_count = await listAvailablePhoneNumberLocal(areaCode)
  
  //console.log(prefix_count,"prefixcount")
  res.send(String(prefix_count));
});


app.get('/city', async (req, res) => {
  try {
    const city = req.query.city;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&countrycodes=US,CA&limit=5&format=json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cityData = await response.json(); // Parse the response as JSON
   

    res.json(cityData); // Send the parsed data back as JSON

  } catch (error) {
    console.log(error)
  }
});

app.get('/postalcode', async (req, res) => {
  
  try {
    const postalCode = req.query.postalcode;
    console.log(postalCode,"postal")
    const response = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&countrycodes=US,CA&limit=5&format=json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cityData = await response.json(); // Parse the response as JSON
   

    res.json(cityData); // Send the parsed data back as JSON

  } catch (error) {
    console.log(error)
  }
});

app.get('/street', async (req, res) => {
  console.log("street")
  try {
    const street = req.query.street;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?street=${street}&countrycodes=US,CA&limit=5&format=json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cityData = await response.json(); // Parse the response as JSON
   

    res.json(cityData); // Send the parsed data back as JSON

  } catch (error) {
    console.log(error)
  }
});

app.get('/prefix', async (req, res) => {

  try {
    var matchingPrefixes = []
    const prefix = req.query.prefix;
    const prefixLength = prefix.length
  

    for (item of prefixData) {
        //console.log(item.label.substring(0,prefixLength),prefix)
        if (item.label.substring(0,prefixLength) ===prefix){
          matchingPrefixes.push(item)
        }
        if (matchingPrefixes.length>4){
          break;
        }
    }
     // Parse the response as JSON
    res.json(matchingPrefixes); // Send the parsed data back as JSON

  } catch (error) {
    console.log(error)
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


