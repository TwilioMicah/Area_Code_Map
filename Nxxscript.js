// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const client = twilio("ACe199dcf9929ded3083523cbd3872fd8f", "ee5d18d3e3b92e15ffdff23efa7a6bf3");

const numberDic = {}
async function listAvailablePhoneNumberLocal() {
    const batchSize = 50;
    const delay = 2000; // 2 seconds delay
  
    for (let i = 0; i <= 1000; i += batchSize) {
      const batchPromises = [];
  
      for (let j = i; j < i + batchSize && j <= 1000; j++) {
        let formattedNumber = j.toString().padStart(3, '0');
        console.log(`+1360${formattedNumber}****`)
        const promise = client.availablePhoneNumbers("US").local.list({
          contains: `+1360${formattedNumber}****`,
          limit: 1,
        });
        batchPromises.push(promise);
      }
  
      const results = await Promise.all(batchPromises);
  
      results.forEach((locals, index) => {
        const formattedNumber = (i + index).toString().padStart(3, '0');
        console.log(locals)
        if (locals.length === 0) {
          //console.log(`No available phone numbers found for prefix 510${formattedNumber}****`);
        } else {
          locals.forEach((l) => {
          
          if((!(l.locality in numberDic) && l.longitude && l.locality)){
                numberDic[l.locality] = {center: [l.latitude,l.longitude],numbers:[l.phoneNumber.slice(0, 7) + 'xxxx']}
          }
         else if(((l.locality in numberDic) && l.longitude && l.locality)) {
            numberDic[l.locality].numbers.push(l.phoneNumber.slice(0, 7) + 'xxxx');
          }
        
        
        }

          );
        
        }
  
        //console.log(numberDic);
      });
  
      if (i + batchSize <= 1000) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  

listAvailablePhoneNumberLocal();