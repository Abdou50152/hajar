import { FiHome, FiShoppingBag, FiTag, FiLayers, FiUsers, FiSettings, FiDroplet, FiMaximize } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const Navigation = () => {

  const tabs = [
    { id: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { id: '/products', icon: <FiTag />, label: 'Products' },
    { id: '/categories', icon: <FiLayers />, label: 'Categories' },
    { id: '/colors', icon: <FiDroplet />, label: 'Colors' },
    { id: '/sizes', icon: <FiMaximize />, label: 'Sizes' },
    { id: '/orders', icon: <FiShoppingBag />, label: 'Orders' },
    { id: '/users', icon: <FiUsers />, label: 'Users' },
    { id: '/admins', icon: <FiSettings />, label: 'Admins' }
  ];

  return (
    <nav className="bg-amber-700 text-amber-100 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.id}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 font-medium transition-colors ${isActive ? 'bg-amber-600 text-white' : 'hover:bg-amber-600/80'}`
              }
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
