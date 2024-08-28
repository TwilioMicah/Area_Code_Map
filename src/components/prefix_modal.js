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
    
    const renderTooltip = (props,item) => {
      if(item =="AVAILABLE"){
        return(
      <Tooltip id="button-tooltip" {...props}>
        This number should be generally available in Twilio inventory
      </Tooltip>)}

      if(item =="UNAVAILABLE"){
        return(
      <Tooltip id="button-tooltip" {...props}>
        This number should not be generally available in Twilio inventory
      </Tooltip>)}
      
      if(item =="EXHAUSTED"){
        return(
      <Tooltip id="button-tooltip" {...props}>
        We are unable to get more of this number 
      </Tooltip>)}
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
          <Card.Title style = {{marginBottom: '10px'}}>

            {item}
   
          </Card.Title>
          <Card.Text style={{marginBottom: '5px', fontStyle: "italic", color: "lightgrey"}}>
              <div style = {{display: 'flex'}}>
    
              {prefixStatus[index]==="20+"?
              (<Button onClick={() => window.open(`https://console.twilio.com/us1/develop/phone-numbers/manage/search?currentFrameUrl=%2Fconsole%2Fphone-numbers%2Fsearch%3FisoCountry%3D${countryISO}%26searchTerm%3D${item}%26searchFilter%3Dleft%26searchType%3Dnumber%26x-target-region%3Dus1%26__override_layout__%3Dembed%26bifrost%3Dtrue`, "_blank")} size="sm" variant="outline-success">{prefixStatus[index]}</Button>):
              prefixStatus[index]<20 && prefixStatus[index]>0?
              (<Button onClick={() => window.open(`https://console.twilio.com/us1/develop/phone-numbers/manage/search?currentFrameUrl=%2Fconsole%2Fphone-numbers%2Fsearch%3FisoCountry%3D${countryISO}%26searchTerm%3D${item}%26searchFilter%3Dleft%26searchType%3Dnumber%26x-target-region%3Dus1%26__override_layout__%3Dembed%26bifrost%3Dtrue`, "_blank")} size="sm" variant="outline-danger">{prefixStatus[index]}</Button>):
              (<Button onClick={() => window.open(`https://console.twilio.com/us1/develop/phone-numbers/manage/search?currentFrameUrl=%2Fconsole%2Fphone-numbers%2Fsearch%3FisoCountry%3D${countryISO}%26searchTerm%3D${item}%26searchFilter%3Dleft%26searchType%3Dnumber%26x-target-region%3Dus1%26__override_layout__%3Dembed%26bifrost%3Dtrue`, "_blank")} size="sm" variant="outline-secondary">{prefixStatus[index]}</Button>)
              
              }
              <div style = {{marginLeft: '10px'}}> </div>
              {areaCodesStatus[item] === 'EXHAUSTED'?
                  <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) => renderTooltip(props, areaCodesStatus[item])}
                >

              <Button size="sm"  variant="secondary">EXAUSTED</Button>
              </OverlayTrigger>:
              
              areaCodesStatus[item] === 'AVAILABLE'?
              <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={(props) => renderTooltip(props, areaCodesStatus[item])}
            >
              <Button size="sm"  variant="success">AVAILABLE</Button>
              </OverlayTrigger>:

              areaCodesStatus[item] === 'UNAVAILABLE'?
              <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={(props) => renderTooltip(props, areaCodesStatus[item])}
            >
              <Button size="sm"  variant="danger">UNAVAILABLE</Button>
              </OverlayTrigger>:
              null
              }
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