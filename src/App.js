import { HashRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Messenger from "./pages/messenger/Messenger";
import Login from "./pages/login/Login";
import SocketState from "../src/context/socketState";

function App() {
  return (
    <>
      <SocketState>
        <HashRouter>
          <Routes>
            <Route exact path="/" name="Login" element={<Login />} />
          </Routes>
          <Routes>
            <Route
              exact
              path="/messenger"
              name="Game"
              element={<Messenger />}
            />
          </Routes>
        </HashRouter>
      </SocketState>
    </>
  );
}

export default App;
