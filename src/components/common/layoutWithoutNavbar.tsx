import { Outlet } from 'react-router-dom';

// layout without navbar for login, signup, reset password etc
const LayoutWithoutNavBar = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default LayoutWithoutNavBar;