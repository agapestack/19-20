import React, { createContext, FC } from "react";
import { useDispatch } from "react-redux";
import { socketAddr } from "../config/global.config";

interface WsContextInterface {
  isConnected: boolean;
  CONN: () => void;
  CREA: () => void;
  JOIN: () => void;  
}

const defaultState: WsContextInterface = {
  isConnected: false,
  CONN: () => {}, 
  CREA: () => {},
  JOIN: () => {},
};

export const WsContext = createContext<WsContextInterface>(defaultState);

interface Props {
  children: React.ReactNode
}
export const WebsocketContextProvider: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();

  let socket;

  
  const CONN = () => {
    console.log("connecting");
    socket = new WebSocket(socketAddr)
  }

  const JOIN = () => {
    console.log("JOIN");
  }

  const CREA = () => {
    console.log("CREA");
  }

  return (
    <WsContext.Provider value={{
      isConnected: false,
      CONN: CONN,
      JOIN: JOIN,
      CREA: CREA,
    }}>{children}</WsContext.Provider>
  );
};

