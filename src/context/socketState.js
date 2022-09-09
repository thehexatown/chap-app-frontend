import React from "react";
import SocketContext from "./socketContext";
import RequestUrl from "../config/apiUrl";
import io from "socket.io-client";
const socket = io(RequestUrl);

function SocketState(props) {
  const connection = socket;
  return (
    <>
      <SocketContext.Provider value={connection}>
        {props.children}
      </SocketContext.Provider>
    </>
  );
}

export default SocketState;
