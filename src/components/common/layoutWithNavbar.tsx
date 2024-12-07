import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';

// navbar for all user related pages except chatbot
const LayoutWithNavBar = () => {
  return (
    <div>
      <NavBar />      
      <Outlet />       
    </div>
  );
};

export default LayoutWithNavBar;
