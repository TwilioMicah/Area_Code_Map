import Button from 'react-bootstrap/Button';
import {Modal,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useState, useEffect } from 'react';

//This should be an google sheet api call to https://docs.google.com/spreadsheets/d/1iBwXIqzVngu2uMRpVjEH4VwOXzFJW8LdidvNNencrQI/edit?gid=0#gid=0
const areaCodesStatus = {
  323: "EXHAUSTED",
  847: "EXHAUSTED",
  301: "AVAILABLE",
  215: "EXHAUSTED",
  407: "EXHAUSTED",
  630: "EXHAUSTED",
  212: "EXHAUSTED",
  917: "EXHAUSTED",
  281: "EXHAUSTED",
  713: "EXHAUSTED",
  832: "EXHAUSTED",
  614: "EXHAUSTED",
  567: "AVAILABLE",
  310: "EXHAUSTED",
  410: "EXHAUSTED",
  317: "EXHAUSTED",
  214: "EXHAUSTED",
  972: "EXHAUSTED",
  404: "EXHAUSTED",
  678: "EXHAUSTED",
  770: "EXHAUSTED",
  203: "EXHAUSTED",
  610: "EXHAUSTED",
  201: "EXHAUSTED",
  703: "EXHAUSTED",
  415: "EXHAUSTED",
  615: "EXHAUSTED",
  609: "EXHAUSTED",
  612: "EXHAUSTED",
  714: "EXHAUSTED",
  205: "EXHAUSTED",
  408: "EXHAUSTED",
  304: "AVAILABLE",
  571: "AVAILABLE",
  534: "EXHAUSTED",
  303: "EXHAUSTED",
  702: "EXHAUSTED",
  210: "EXHAUSTED",
  512: "EXHAUSTED",
  818: "EXHAUSTED",
  202: "EXHAUSTED",
  305: "EXHAUSTED",
  732: "EXHAUSTED",
  617: "EXHAUSTED",
  973: "EXHAUSTED",
  312: "EXHAUSTED",
  773: "EXHAUSTED",
  347: "EXHAUSTED",
  718: "EXHAUSTED",
  248: "EXHAUSTED",
  503: "EXHAUSTED",
  704: "EXHAUSTED",
  919: "EXHAUSTED",
  603: "UNAVAILABLE",
  907: "UNAVAILABLE",
  206: "UNAVAILABLE",
  207: "AVAILABLE",
  208: "AVAILABLE",
  209: "AVAILABLE",
  213: "AVAILABLE",
  216: "AVAILABLE",
  217: "AVAILABLE",
  218: "AVAILABLE",
  219: "AVAILABLE",
  224: "AVAILABLE",
  225: "AVAILABLE",
  228: "AVAILABLE",
  229: "AVAILABLE",
  231: "AVAILABLE",
  234: "AVAILABLE",
  239: "AVAILABLE",
  240: "AVAILABLE",
  251: "AVAILABLE",
  252: "AVAILABLE",
  253: "AVAILABLE",
  254: "AVAILABLE",
  256: "AVAILABLE",
  260: "AVAILABLE",
  262: "AVAILABLE",
  267: "AVAILABLE",
  269: "AVAILABLE",
  270: "AVAILABLE",
  272: "AVAILABLE",
  276: "AVAILABLE",
  279: "AVAILABLE",
  302: "AVAILABLE",
  307: "AVAILABLE",
  308: "AVAILABLE",
  309: "AVAILABLE",
  313: "AVAILABLE",
  314: "AVAILABLE",
  315: "AVAILABLE",
  316: "AVAILABLE",
  318: "AVAILABLE",
  319: "AVAILABLE",
  320: "AVAILABLE",
  321: "AVAILABLE",
  325: "AVAILABLE",
  326: "AVAILABLE",
  330: "AVAILABLE",
  331: "AVAILABLE",
  332: "AVAILABLE",
  334: "AVAILABLE",
  336: "AVAILABLE",
  337: "AVAILABLE",
  339: "AVAILABLE",
  341: "AVAILABLE",
  346: "AVAILABLE",
  351: "AVAILABLE",
  352: "AVAILABLE",
  360: "AVAILABLE",
  361: "AVAILABLE",
  364: "AVAILABLE",
  380: "AVAILABLE",
  385: "AVAILABLE",
  386: "AVAILABLE",
  401: "AVAILABLE",
  402: "AVAILABLE",
  405: "AVAILABLE",
  406: "AVAILABLE",
  409: "AVAILABLE",
  412: "AVAILABLE",
  413: "AVAILABLE",
  414: "AVAILABLE",
  417: "AVAILABLE",
  419: "AVAILABLE",
  423: "AVAILABLE",
  424: "AVAILABLE",
  425: "AVAILABLE",
  430: "AVAILABLE",
  432: "AVAILABLE",
  434: "AVAILABLE",
  435: "AVAILABLE",
  440: "AVAILABLE",
  442: "AVAILABLE",
  443: "AVAILABLE",
  458: "AVAILABLE",
  463: "AVAILABLE",
  469: "AVAILABLE",
  470: "AVAILABLE",
  475: "AVAILABLE",
  478: "AVAILABLE",
  479: "AVAILABLE",
  480: "AVAILABLE",
  484: "AVAILABLE",
  501: "AVAILABLE",
  502: "AVAILABLE",
  504: "AVAILABLE",
  505: "AVAILABLE",
  507: "AVAILABLE",
  508: "AVAILABLE",
  509: "AVAILABLE",
  510: "AVAILABLE",
  513: "AVAILABLE",
  515: "AVAILABLE",
  516: "AVAILABLE",
  517: "AVAILABLE",
  518: "AVAILABLE",
  520: "AVAILABLE",
  530: "AVAILABLE",
  531: "AVAILABLE",
  539: "AVAILABLE",
  540: "AVAILABLE",
  541: "AVAILABLE",
  551: "AVAILABLE",
  559: "AVAILABLE",
  561: "AVAILABLE",
  562: "AVAILABLE",
  563: "AVAILABLE",
  570: "AVAILABLE",
  573: "AVAILABLE",
  574: "AVAILABLE",
  575: "AVAILABLE",
  580: "AVAILABLE",
  585: "AVAILABLE",
  586: "AVAILABLE",
  601: "AVAILABLE",
  602: "AVAILABLE",
  605: "AVAILABLE",
  606: "AVAILABLE",
  607: "AVAILABLE",
  608: "AVAILABLE",
  616: "AVAILABLE",
  618: "AVAILABLE",
  619: "AVAILABLE",
  620: "AVAILABLE",
  623: "AVAILABLE",
  626: "AVAILABLE",
  628: "AVAILABLE",
  629: "AVAILABLE",
  631: "AVAILABLE",
  636: "AVAILABLE",
  641: "AVAILABLE",
  646: "AVAILABLE",
  650: "AVAILABLE",
  651: "AVAILABLE",
  657: "AVAILABLE",
  660: "AVAILABLE",
  661: "AVAILABLE",
  662: "AVAILABLE",
  667: "AVAILABLE",
  669: "AVAILABLE",
  681: "AVAILABLE",
  682: "AVAILABLE",
  689: "AVAILABLE",
  701: "AVAILABLE",
  706: "AVAILABLE",
  707: "AVAILABLE",
  708: "AVAILABLE",
  712: "AVAILABLE",
  715: "AVAILABLE",
  716: "AVAILABLE",
  717: "AVAILABLE",
  719: "AVAILABLE",
  720: "AVAILABLE",
  724: "AVAILABLE",
  725: "AVAILABLE",
  726: "AVAILABLE",
  727: "AVAILABLE",
  731: "AVAILABLE",
  734: "AVAILABLE",
  737: "AVAILABLE",
  740: "AVAILABLE",
  743: "AVAILABLE",
  747: "AVAILABLE",
  754: "AVAILABLE",
  757: "AVAILABLE",
  760: "AVAILABLE",
  762: "AVAILABLE",
  763: "AVAILABLE",
  765: "AVAILABLE",
  769: "AVAILABLE",
  772: "AVAILABLE",
  774: "AVAILABLE",
  775: "AVAILABLE",
  779: "AVAILABLE",
  781: "AVAILABLE",
  785: "AVAILABLE",
  786: "AVAILABLE",
  801: "AVAILABLE",
  802: "AVAILABLE",
  803: "AVAILABLE",
  804: "AVAILABLE",
  805: "AVAILABLE",
  806: "AVAILABLE",
  808: "AVAILABLE",
  810: "AVAILABLE",
  812: "AVAILABLE",
  813: "AVAILABLE",
  814: "AVAILABLE",
  815: "AVAILABLE",
  816: "AVAILABLE",
  817: "AVAILABLE",
  828: "AVAILABLE",
  830: "AVAILABLE",
  831: "AVAILABLE",
  843: "AVAILABLE",
  845: "AVAILABLE",
  848: "AVAILABLE",
  850: "AVAILABLE",
  854: "AVAILABLE",
  856: "AVAILABLE",
  857: "AVAILABLE",
  858: "AVAILABLE",
  859: "AVAILABLE",
  860: "AVAILABLE",
  862: "AVAILABLE",
  863: "AVAILABLE",
  864: "AVAILABLE",
  865: "AVAILABLE",
  870: "AVAILABLE",
  872: "AVAILABLE",
  878: "AVAILABLE",
  901: "AVAILABLE",
  903: "AVAILABLE",
  904: "AVAILABLE",
  906: "AVAILABLE",
  908: "AVAILABLE",
  909: "AVAILABLE",
  910: "AVAILABLE",
  912: "AVAILABLE",
  913: "AVAILABLE",
  914: "AVAILABLE",
  915: "AVAILABLE",
  916: "AVAILABLE",
  918: "AVAILABLE",
  920: "AVAILABLE",
  925: "AVAILABLE",
  928: "AVAILABLE",
  929: "AVAILABLE",
  930: "AVAILABLE",
  931: "AVAILABLE",
  936: "AVAILABLE",
  937: "AVAILABLE",
  938: "AVAILABLE",
  940: "AVAILABLE",
  941: "AVAILABLE",
  947: "AVAILABLE",
  949: "AVAILABLE",
  951: "AVAILABLE",
  952: "AVAILABLE",
  954: "AVAILABLE",
  956: "AVAILABLE",
  959: "AVAILABLE",
  970: "AVAILABLE",
  971: "AVAILABLE",
  978: "AVAILABLE",
  979: "AVAILABLE",
  980: "AVAILABLE",
  984: "AVAILABLE",
  985: "AVAILABLE",
  989: "AVAILABLE",
  800: "UNAVAILABLE",
  833: "AVAILABLE",
  844: "AVAILABLE",
  855: "AVAILABLE",
  866: "AVAILABLE",
  877: "AVAILABLE",
  888: "AVAILABLE"
};



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