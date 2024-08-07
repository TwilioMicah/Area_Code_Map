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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


