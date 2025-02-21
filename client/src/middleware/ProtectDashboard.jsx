import { useContext } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import storeContext from '../context/storeContext';

const ProtectDashboard = () => {
  // const userInfo = {
  //   name: "Panji Asmoro",
  //   role: "admin",
  // };

  const { store } = useContext(storeContext);
  // console.log('ProtectDashboard : ', store);

  if (store.userInfo) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectDashboard;
