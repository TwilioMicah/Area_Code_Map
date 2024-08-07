import React from 'react';
import geojsonData from './Area__Code__Boundaries.json';
import {GeoJSON} from 'react-leaflet';

const prefixData = [
//https://www.nationalnanpa.com/reports/reports_npa.html 'NPA Database'
    [201, 551],
    [202, 771],
    [203, 475],
    [204, 431, 584],
    [205, 659],
    [206, 564],
    [208, 986],
    [209, 350],
    [210, 726],
    [212, 332, 646, 917],
    [213, 323, 738],
    [214, 469, 945, 972],
    [215, 267, 445],
    [217, 447],
    [220, 740],
    [223, 717],
    [224, 847],
    [226, 382, 519, 548],
    [227, 240, 301],
    [234, 330],
    [235, 573],
    [236, 250, 257, 604, 672, 778],
    [248, 947],
    [249, 683, 705],
    [256, 938],
    [263, 438, 514],
    [270, 364],
    [272, 570],
    [274, 920],
    [279, 916],
    [281, 346, 621, 713, 832],
    [283, 513],
    [289, 365, 742, 905],
    [303, 720, 983],
    [304, 681],
    [305, 645, 786],
    [306, 474, 639],
    [309, 861],
    [310, 424],
    [312, 872],
    [313, 679],
    [314, 557],
    [315, 680],
    [317, 463],
    [318, 457],
    [324, 904],
    [326, 937],
    [327, 870],
    [329, 845],
    [331, 630],
    [336, 743],
    [339, 781],
    [341, 510],
    [343, 613, 753],
    [347, 718, 917, 929],
    [351, 978],
    [353, 608],
    [354, 450, 579],
    [357, 559],
    [360, 564],
    [363, 516],
    [367, 418, 581],
    [368, 403, 587, 780, 825],
    [369, 707],
    [380, 614],
    [385, 801],
    [402, 531],
    [404, 470, 678, 943],
    [405, 572],
    [408, 669],
    [410, 443, 667],
    [412, 878],
    [415, 628],
    [416, 437, 647],
    [419, 567],
    [423, 729],
    [428, 506],
    [430, 903],
    [436, 440],
    [442, 760],
    [448, 850],
    [458, 541],
    [464, 708],
    [468, 819, 873],
    [471, 662],
    [472, 910],
    [480, 602, 623],
    [484, 610, 835],
    [500, 533, 544, 566, 577, 588, 522, 521],
    [503, 971],
    [507, 924],
    [508, 774],
    [512, 737],
    [518, 838],
    [530, 837],
    [539, 918],
    [540, 826],
    [543, 854],
    [580, 601],
    [617, 857],
    [618, 730],
    [619, 858],
    [624, 716],
    [631, 934],
    [632, 814],
    [634, 780],
    [682, 817],
    [704, 980],
    [709, 879],
    [732, 848],
    [747, 818],
    [748, 970],
    [757, 948],
    [754, 954],
    [760, 762],
    [800, 888, 877, 866, 855, 844, 833],
    [803, 839],
    [804, 805, 820],
    [812, 930],
    [816, 975],
    [821, 864],
    [843, 854],
    [860, 959],
    [862, 973],
    [919, 984],
    [782, 902]
  ];
  




  

const AreaCodeFeatures = React.memo(({prefixsearchData,showModalTrigger}) => {
    let searchArraytmp = []
    
    const seenEntries = new Set();
    //const [searchArray,setsearchArray] = useState([])
    const geoJSONStyle = {
        fillColor: "#008CFF",
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7
      };
      
const onEachFeature = (feature, layer) => {
  
  //711 layers
    
    layer.on('add', () => {
        let center = layer.getCenter()
        const npa = feature.properties.NPA
        let tmpArray = []

//need to clean up data source(only show main prefix) for this to work. Overlays are causing duplicates
//with current logic
//use a set to deal with duplicates
if(searchArraytmp.length<456){ //to address duplicate runs of layer.on. Not sure why its doing this 
 
for (let subarray of prefixData) {
  if (subarray.includes(Number(npa))) {

    for (let item of subarray){
      //console.log(item)
        if (!seenEntries.has(String(item))){
        tmpArray.push({ id: String(item),"center": center, "name": String(item) })
        seenEntries.add(String(item))
        }
      }

      //tmpArray = subarray.map(prefix => ({ "center": center, "value": prefix }));
      //break; // Exit the loop when a match is found
  }
}
        if (tmpArray.length>0){
            searchArraytmp.push(...tmpArray)
        }
       if (tmpArray.length === 0){
        if (!seenEntries.has(npa)){
                searchArraytmp.push({id: npa,"center": center, "name":npa})
                seenEntries.add(npa)
        }
       }
       console.log(searchArraytmp.length)
       //console.log(searchArraytmp)
       if(searchArraytmp.length==433){
        
   
        prefixsearchData(searchArraytmp)
       }
      }

    });
    
   // console.log(searchArraytmp)    
    layer.on('click', (e) => {  
        const npa = feature.properties.NPA
        
        
        //feature.properties.COUNTRY
        //feature.properties.STATE
        let tmpArray
        prefixData.forEach(subarray => {
            if (subarray.includes(Number(npa))) {
                
                tmpArray = subarray
            }

      
          });
  
       if (tmpArray?.length>0){
        showModalTrigger(tmpArray)
       }
       else{
        showModalTrigger([npa])
       }
      //console.log(feature.properties.NPA,"hello!");
    });
  };
return(
  <GeoJSON data={geojsonData} style={geoJSONStyle} onEachFeature={onEachFeature} />
)

});

export default AreaCodeFeatures;