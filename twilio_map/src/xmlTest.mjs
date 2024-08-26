import fetch from "node-fetch";
import xml2js from "xml2js";
import prefixData from './components/geoData/prefixObject.mjs'
  /*
    {
        "id": "702",
        "center": {
            "lat": 36.162537269627954,
            "lng": -114.93768547479306
        },
        "label": "702"
    },
*/


async function test() {
  var test = "360"
  const url = "https://localcallingguide.com/xmllistnpa.php?npa=360";
  try {
    const response = await fetch(url);
    
    if (response.ok) {
      const xmlText = await response.text(); // Get the response as text
      
      // Parse the XML to JSON using xml2js
      xml2js.parseString(xmlText, (err, result) => {
        if (err) {
          console.error("Failed to parse XML:", err);
        } else {
          var data = result.root.npadata[0]
          if (data.overlay[0].length>0){
            const overlayArray = data.overlay[0].split('/')
            console.log(overlayArray)
            for(let item of overlayArray){
                console.log(item)
                if(item in prefixData){
                    console.log({
                      id: test,
                      center: prefixData[item].center,
                      label:test,
                    })
                    /*
                    {
                      id: test
                      center = prefixData[item].center
                      label =prefixData[item].label
                    }


                    */
                    break;
                }
            }
          }
          else{
            if(data.npa[0] in prefixData){
                console.log({id: test,
                  center: prefixData[data.npa[0]].center,
                  label: test})

                                    /*
                    {
                      id: test
                      center: prefixData[data.npa[0]].center
                      label: prefixData[data.npa[0]].label
                    }


                    */
             
            }
          }
        }
      });
    } else {
      console.error("Failed to fetch XML:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
}

test();
