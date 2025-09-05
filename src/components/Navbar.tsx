import React from 'react';
import Icon from '../utilities/Icon';

const Navbar = ()=> {
  return (
    <header >
      <div class="">
          <h1>Help Desk- Sky World Limited</h1>
          <h2>VENDOR</h2>
      </div>
      <div className='icon-search'>
        <Icon iconName="add" class="icon"/>
        <Icon iconName="search" class="icon"/>
        <label htmlFor="searchBox"></label>
        <input type="search" name="searchBox" />
        <Icon iconName="notification" class="icon"/>
        <Icon iconName='avatar' class="icon"/>
      </div>

    </header>
  );
};

export default Navbar;