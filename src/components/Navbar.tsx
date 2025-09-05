import React from 'react';
import Icon from '../utilities/Icon';

const Navbar = ()=> {
  return (
    <header >
        <div className='mic-icon'>
          <Icon iconName='microphone'/>
        </div>
      <div className='header-wrapper'>
        <div className='logo'>
          <h1>Help Desk - Sky World Limited</h1>
          <h2>VENDOR</h2>
        </div>
        <div className='icon-search'>
          <Icon iconName='add' />
          <Icon iconName='search' />
          <select name="search" id=""></select>
          <Icon iconName='notification' />
          <Icon iconName='avatar'/>
        </div>

      </div>
    </header>
  );
};

export default Navbar;