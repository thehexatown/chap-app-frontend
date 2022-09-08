import { HashRouter, BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Messenger from "./pages/messenger/Messenger";
import Login from "./pages/login/Login";
import SocketState from "../src/context/socketState";
import ProtectedRoute from "./protectedRoute/index";
import SignUp from "./pages/signUp/Signup";

function App() {
  return (
    <>
      <SocketState>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" name="login" element={<Login />} />
            <Route exact path="/signUp" name="signUp" element={<SignUp />} />
            <Route element={<ProtectedRoute />}>
              <Route
                exact
                path="/messenger"
                name="messenger"
                element={<Messenger />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </SocketState>
    </>
  );
}

export default App;
