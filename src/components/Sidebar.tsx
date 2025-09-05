import React from 'react';
import Icon from '../utilities/Icon';



const Sidebar: React.FC = () => {
  return (
    <aside className="">
      <div className='aside-icons'>
        <Icon iconName="pie" />
        <Icon  iconName='razor'/>
        <Icon  iconName='notepad'/>
        <Icon  iconName='notes'/>
        <Icon  iconName='users'/>
        <Icon  iconName='settings'/>
      </div>
      <div>
        <Icon iconName='close' />
      </div>
    </aside>
  );
};

export default Sidebar;