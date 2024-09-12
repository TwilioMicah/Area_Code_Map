import Button from 'react-bootstrap/Button';
import {Modal,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useState, useEffect } from 'react';
import areaCodesStatus from './geoData/areaCodeStatus';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


const PrefixModal = React.memo(({showModal,prefixArray,countryISO,markerDataNPACallBack})=> {

    const [modalBoolean,setmodalBoolean]= useState(false)
    const [prefixStatus,setprefixStatus]= useState(Array(prefixArray.length).fill('loading'))
    const [isLoading,setisLoading] = useState(false)
    const [rateCenterObjectLength,setrateCenterObjectLength] = useState(0)
    const [loadingButtonPrefix,setloadingButtonPrefix] = useState('')
    
    const renderTooltipStatus = (props,item) => {
      if(item =="Available"){
        return(
      <Tooltip id="button-tooltip" {...props}>
        This number should be generally available in Twilio inventory.
      </Tooltip>)}

      if(item =="Unavailable"){
        return(
      <Tooltip id="button-tooltip" {...props}>
        We are no longer able to aquire phone numbers in this area code due to regional depletion.
      </Tooltip>)}
      
      if(item =="Exhausted"){
        return(
      <Tooltip id="button-tooltip" {...props}>
        We are no longer able to aquire phone numbers in this area code due to regional depletion.
      </Tooltip>)}
 };


 const renderTooltipTurnover = (props,item) => {
  if(item =="Low"){
    return(
  <Tooltip id="button-tooltip" {...props}>
    Stock-outs rarely occur, except in rare occasions of high demand.
  </Tooltip>)}

  if(item =="Medium"){
    return(
  <Tooltip id="button-tooltip" {...props}>
    May experience irregular instances of low inventory levels.
  </Tooltip>)}
  
  if(item =="High"){
    return(
  <Tooltip id="button-tooltip" {...props}>
     Stock levels may be low due to high demand, and temporary stock-outs can occur.
  </Tooltip>)}
};

const renderTooltipStatic = (props,message) => {
 
    return(
  <Tooltip id="button-tooltip" {...props}>
    {message}
  </Tooltip>)
};


    const handleClose = () =>{
        if (!isLoading){
        setmodalBoolean(false)
        }

    }

    async function fetchStatus(prefix) {
      try {
        const response = await fetch(`http://localhost:8000?prefix=${prefix}&isoCountry=${countryISO}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        return data;
      } catch (error) {
        console.error('Error fetching prefix count:', error);
        return 'Error';
      }
    }

    

    useEffect(() => {
        if(showModal>0){
        // Code to run on component mount and when dependencies change
        setmodalBoolean(true)
        }
      }, [showModal]);



  useEffect(() => {
    setprefixStatus(Array(prefixArray.length).fill('loading'))
    const fetchData = async () => {

    try {
      const results = await Promise.all(
        prefixArray.map(async (prefix) => {
          const status = await fetchStatus(prefix);
    
          return status == 20 ? '20+' : status;

        })
      );
      setprefixStatus(results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }


  }
    fetchData();
    
    
  }, [prefixArray]);


  const labelStyle = {
    padding: '0.25rem 0.5rem', // smaller padding to look like a label
    borderRadius: '0.25rem', // rounded corners for label effect
    fontSize: '0.75rem', // smaller font size
    textAlign: 'center', // center text
    display: 'inline-block', // make it inline like a label
    whiteSpace: 'nowrap', // prevent text from wrapping to the next line
    overflow: 'hidden', // hide any overflowing text
    textOverflow: 'ellipsis', // add ellipsis (...) for overflowing text
  };



  const handleDisplayClick = async (prefix, countryISO) => {
    var markerArray = [];
    const batchSize = 25;
    const delay = 1000; // 1 second
    
    // Helper function to introduce a delay
    const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    
    try {

      
      // Fetch the data from the rateCenters API
      const response = await fetch(`http://localhost:8000/rateCenters?prefix=${prefix}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Parse the JSON response
      const rateCenters = await response.json();
      setrateCenterObjectLength(rateCenters.length)
      setloadingButtonPrefix(prefix)
      setisLoading(true)
      
      for (let i = 0; i < rateCenters.length; i += batchSize) {
        setrateCenterObjectLength(rateCenters.length-i)
        // Create a batch of promises
        const batch = rateCenters.slice(i, i + batchSize).map(async (item) => {
          const queryString = JSON.stringify(item);
          const encodedQueryString = encodeURIComponent(queryString);
          try {
            const response = await fetch(`http://localhost:8000/npaLocalities?prefix=${prefix}&country=${countryISO}&rateCenter=${encodedQueryString}`);
            
            if (response.ok) {
              const data = await response.json();
              if(!data.error){

              
      
              markerArray.push(data);
              }
            }
            else{
              console.error('Fetch error:', response.statusText);
            }
          } catch (error) {
            
          }
        });
        
        // Wait for the current batch to complete
        await Promise.all(batch);
        
        // Pause after every batch
        if (i + batchSize < rateCenters.length) {
          await timeout(delay);
        }
      }
      markerDataNPACallBack(markerArray)
      setisLoading(false)
      handleClose()
      
    } catch (error) {
      console.error('Error in handleDisplayClick:', error);
    }
  };
  
  
  


    return (
        
       
      <div>
        
      <Modal backdrop={isLoading?"static":true} show={modalBoolean} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Available Prefixes</Modal.Title>
      </Modal.Header>

      <Modal.Body>
      {prefixArray.map((item,index) => 
      
  
      (
   
          <div style = {{marginTop:"10px",borderBottom: "1px solid lightgrey" }}>
<Card.Title 
  style={{ 
    marginBottom: '10px', 
  }}
>
  {item}
</Card.Title>

          <Card.Text style={{marginBottom: '5px', fontStyle: "italic", color: "lightgrey"}}>
              <div style = {{display: 'flex'}}>
              <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) => renderTooltipStatic(props,"Current Twilio inventory stock level.")}
                >
              {prefixStatus[index]==="20+"?
              (<Button style ={labelStyle} size="sm" variant="outline-success">{prefixStatus[index]}</Button>):
              prefixStatus[index]<20 && prefixStatus[index]>0?
              (<Button style ={labelStyle} size="sm" variant="outline-danger">{prefixStatus[index]}</Button>):
              (<Button style ={labelStyle} size="sm" variant="outline-secondary">{prefixStatus[index]}</Button>)
              
              }
              </OverlayTrigger>
              
              <div style = {{marginLeft: '10px'}}> </div>
                      {areaCodesStatus[item]?.status ? (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) => renderTooltipStatus(props, areaCodesStatus[item].status)}
          >
            <Button
              size="sm"
              style={{
                backgroundColor:
                  areaCodesStatus[item]?.status === 'Exhausted'
                    ? '#6c757d'  // muted gray for 'secondary'
                    : areaCodesStatus[item]?.status === 'Available'
                    ? '#28a745'  // muted green for 'success'
                    : '#dc3545', // muted red for 'danger'
                borderColor:
                  areaCodesStatus[item]?.status === 'Exhausted'
                    ? '#6c757d'
                    : areaCodesStatus[item]?.status === 'Available'
                    ? '#28a745'
                    : '#dc3545',
                color: '#ffffff', // text color
                ...labelStyle
              }}
            >
              {areaCodesStatus[item]?.status}
            </Button>
          </OverlayTrigger>
        ) : null}


              <div style = {{marginLeft: '10px'}}> </div>
                          {areaCodesStatus[item]?.turnover ? (
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => renderTooltipTurnover(props, areaCodesStatus[item].turnover)}
              >
                <Button
                  size="sm"
                  style={{
                    backgroundColor:
                      areaCodesStatus[item]?.turnover === 'Low'
                        ? '#007bff'  // muted blue for 'primary'
                        : areaCodesStatus[item]?.turnover === 'Medium'
                        ? '#ffc107'  // muted yellow for 'warning'
                        : '#dc3545', // muted red for 'danger'
                    borderColor:
                      areaCodesStatus[item]?.turnover === 'Low'
                        ? '#007bff'
                        : areaCodesStatus[item]?.turnover === 'Medium'
                        ? '#ffc107'
                        : '#dc3545',
                        ...labelStyle
                  }}
                >
                  {areaCodesStatus[item]?.turnover + ' turnover'}
                </Button>
              </OverlayTrigger>
            ) : null}

                <div style = {{position: 'absolute',right:'20px'}}      
>

                <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => renderTooltipStatic(props, "Click button to map all localities for this area code.")}
              >
            <Button id={item} 
            disabled ={isLoading?true:false} 
            onClick = {() => handleDisplayClick(item,countryISO)} size="sm" variant="outline-dark">
            {isLoading && (item===loadingButtonPrefix)?`${rateCenterObjectLength} items left`:"Display"}
            </Button>


               
              </OverlayTrigger>
              </div>



              </div>
          </Card.Text>

          
         
          </div >
        ))}
      </Modal.Body>


    </Modal>
      </div>
        
    );
  });
  
  export default PrefixModal;