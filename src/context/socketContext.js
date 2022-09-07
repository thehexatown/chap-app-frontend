import { createContext } from "react";

import io from "socket.io-client";
const socket = io("http://localhost:5000");

const socketContext = createContext();

export default socketContext;
