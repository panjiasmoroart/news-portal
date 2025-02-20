/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Navigate, Outlet } from "react-router-dom";

import storeContext from '../context/storeContext';

const ProtectRole = ({ role }) => {
  // const userInfo = {
    // name: "Panji Asmoro",
    // role: "admin",
    // role: "writer",
  // };

  const { store } = useContext(storeContext);

  if (store?.userInfo?.role === role) {
    return <Outlet />;
  } else {
    return <Navigate to="/dashboard/unable-access" />;
  }
};

export default ProtectRole;
