import Button from 'react-bootstrap/Button';
import {Modal,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useState, useEffect } from 'react';
import areaCodesStatus from './geoData/areaCodeStatus';

const PrefixModal = React.memo(({showModal,prefixArray})=> {

    const [modalBoolean,setmodalBoolean]= useState(false)
    const [prefixStatus,setprefixStatus]= useState(Array(prefixArray.length).fill('loading'))
  


    const handleClose = () =>{
        setmodalBoolean(false)

    }

    async function fetchStatus(prefix) {
      try {
        const response = await fetch(`http://localhost:8000?prefix=${prefix}`);
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
              {console.log(prefixStatus[index])}
              {prefixStatus[index]==="20+"?
              (<Button size="sm" variant="outline-success">{prefixStatus[index]}</Button>):
              prefixStatus[index]<20 && prefixStatus[index]>0?
              (<Button size="sm" variant="outline-danger">{prefixStatus[index]}</Button>):
              (<Button size="sm" variant="outline-secondary">{prefixStatus[index]}</Button>)
              
              }
              <div style = {{marginLeft: '10px'}}> </div>
              {areaCodesStatus[item] === 'EXHAUSTED'?
              <Button size="sm"  variant="secondary">EXAUSTED</Button>:
              areaCodesStatus[item] === 'AVAILABLE'?
              <Button size="sm"  variant="success">AVAILABLE</Button>:
              areaCodesStatus[item] === 'UNAVAILABLE'?
              <Button size="sm"  variant="danger">UNAVAILABLE</Button>:
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