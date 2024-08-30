import Button from 'react-bootstrap/Button';
import {Modal,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useState, useEffect } from 'react';
import areaCodesStatus from './geoData/areaCodeStatus';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const PrefixModal = React.memo(({showModal,prefixArray,countryISO})=> {
    console.log(prefixArray,"prefixarray")
    const [modalBoolean,setmodalBoolean]= useState(false)
    const [prefixStatus,setprefixStatus]= useState(Array(prefixArray.length).fill('loading'))
    
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
        setmodalBoolean(false)

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


     // const fetch = require('node-fetch');

  useEffect(() => {
    setprefixStatus(Array(prefixArray.length).fill('loading'))
    const fetchData = async () => {

    try {
      const results = await Promise.all(
        prefixArray.map(async (prefix) => {
          const status = await fetchStatus(prefix);
          console.log(status)
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
  


    return (
        
       
      <div>
        
      <Modal show={modalBoolean} onHide={handleClose}>
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
                overlay={(props) => renderTooltipStatic(props, "Click button to buy number in Twilio console")}
              >
<Button onClick={() => window.open(`https://console.twilio.com/us1/develop/phone-numbers/manage/search?currentFrameUrl=%2Fconsole%2Fphone-numbers%2Fsearch%3FisoCountry%3D${countryISO}%26searchTerm%3D${item}%26searchFilter%3Dleft%26searchType%3Dnumber%26x-target-region%3Dus1%26__override_layout__%3Dembed%26bifrost%3Dtrue`, "_blank")} size="sm" variant="outline-dark">Buy</Button>


               
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