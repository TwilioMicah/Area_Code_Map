import React from "react";
import "./table.css";
import DataTable from 'react-data-table-component';
import { connector, data_flask } from "./connector"
const { useState, useEffect } = React;

export default function MyComponent() {
var counter = 0;
const columns = [

    {
        name: 'task',
        selector: row => row.year,
    },
];

const columns_user = [

    {
        name: 'phone number',
        selector: row => row.pnumber,
    },
    {
        name: 'Name',
        selector: row => row.Name,
    },
];

const [data, setData] = useState([{id: 'none', year: 'none'}  //object that specifices contents of rows
])

const [namedata, setnameData] = useState([{id: 'none', pnumber: 'none' , Name: 'none'}  //object that specifices contents of rows
])


async function dataHandler() {
let tmp_data =[]
const data_response = await data_flask();
console.log(data_response) //while loop - while object != null id: counter, then iterate through the object and assign appropriately
let var1;
for (let i = 0; i < data_response['hello'].length; i++){
  var1 = data_response['hello'][i]
  tmp_data.push({id: i+1,year: var1.task})
  console.log(tmp_data)
}
setData(tmp_data)
return tmp_data

}


async function dataHandler_name() {
let tmp_data1 =[]

const data_response = await data_flask(); //while loop - while object != null id: counter, then iterate through the object and assign appropriately
console.log(data_response['names'])
let var2;
for (let i = 0; i < data_response['names'].length; i++){
  var2 = data_response['names'][i]
  tmp_data1.push({id: i+1,pnumber: var2.number, Name: var2.name})
  console.log(tmp_data1)
}
setnameData(tmp_data1)
return tmp_data1

}


useEffect(() => {
dataHandler();
dataHandler_name();
}, []);



//onlick Buttom functionality
//request from number -> response to numbers
//


    return (
      <div>
      <button type="Update" onClick={() => { dataHandler();dataHandler_name() }}>Update</button>
        <div className = 'cont'>
        <div className = 'hello'>
        <DataTable
            columns={columns}
            data={data}
            title = {'Queue'}
            selectableRows = {true}
            selectableRowsHighlight = {true}
            striped = {true}
            pagination = {true}
            paginationPerPage = {5}

        />
        </div>

        <div className = 'second'>
        <DataTable
            columns={columns_user}
            data={namedata}
            title = {'Users in Queue'}
            selectableRows = {true}
            selectableRowsHighlight = {true}
            striped = {true}
            pagination = {true}
            paginationPerPage = {5}

        />
        </div>
        </div>
        </div>
    );
};

//everytime Manager sends a text send a post request to this code. This is only to test
