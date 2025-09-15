import React from 'react';
import Icon from '../utilities/Icon';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { icon: 'pie', label: 'Dashboard' },
  { icon: 'razor', label: 'Editor' },
  { icon: 'notepad', label: 'Notes' },
  { icon: 'notes', label: 'Tasks' },
  { icon: 'users', label: 'Users' },
  { icon: 'settings', label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className="sidebar" style={{ width: isOpen ? '240px' : '48px' }}>
      <div className="aside-icons">
        {menuItems.map((item) => (
          <div
            key={item.icon}
            className="sidebar-item"
            title={!isOpen ? item.label : ''}
          >
            <Icon iconName={item.icon} />
            {isOpen && <span className="sidebar-label">{item.label}</span>}
          </div>
        ))}
      </div>

      <div className="close-icon" onClick={toggleSidebar}>
        <Icon iconName={isOpen ? 'close' : 'open'} />
      </div>
    </aside>
  );
};

export default Sidebar;
