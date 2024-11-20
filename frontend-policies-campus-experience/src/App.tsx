import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Components/Header";
import ProtectedRoute from "./Components/ProtectedRoute";

import Main from "./Pages/Main";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import PolicyAdd from "./Pages/PolicyAdd";
import History from "./Pages/History";
import SinglePolicy from "./Pages/SinglePolicy";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} /> 
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/history" element={<History />} />
      <Route
          path="/policy/add"
          element={
            <ProtectedRoute>
              <PolicyAdd />
            </ProtectedRoute>
          }
        />
        <Route path="/policies/:id" element={<SinglePolicy />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
