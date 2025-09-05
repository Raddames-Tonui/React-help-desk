import React from 'react';
import Icon from '../utilities/Icon';


const Footer: React.FC = ()=> {
  return (
    <footer >
      <div className='footer-wrapper'>
        <div>
            <Icon iconName='building' />
            <p>Sky World Limited</p>
        </div>
        <div>
          <Icon iconName='user' />
          <p>Jane Doe</p>
        </div>
        </div>
    </footer>
  );
};

export default Footer;