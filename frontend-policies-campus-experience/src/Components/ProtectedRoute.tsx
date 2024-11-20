import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../AuthContext";

const ProtectedRoute: FC<{children: ReactNode;}> = ({ children }) => {
  const {
    state: { isAuth },
  } = useAuth();

  return isAuth ? <>{children}</> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
