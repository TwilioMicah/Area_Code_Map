import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import React, { useState, useEffect } from 'react';

const Searchdropdown = () => {


var searchArray = ['Prefix','City','Zip Code','Address']
const [searchType, setsearchType] = useState('Prefix')
const handleClick = (e) => {
setsearchType(e.target.text)
}

return (
  <Dropdown>
    <Dropdown.Toggle variant="success" id="dropdown-basic">
      {searchType}
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {searchArray.map((item, index) => (
        item !== searchType?(
        <Dropdown.Item key={index} onClick={handleClick} href="#/action-1">
          {item}
        </Dropdown.Item>):null
      ))}
    </Dropdown.Menu>
  </Dropdown>
);


}

export default Searchdropdown


