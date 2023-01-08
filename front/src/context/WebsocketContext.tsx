import React, { createContext, FC, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  serverAddr,
  socketAddr,
  googleStunServer,
} from "../config/global.config";
import { setRoomId } from "../features/Global/GlobalSlice";

interface WsMessage {
  Message: string
  RoomId: string
}

interface WsContextInterface {
  CREA: () => void;
  JOIN: (roomId: string) => void;
  SEND: (message: string) => void;
}

const defaultState: WsContextInterface = {
  CREA: () => {},
  JOIN: (roomId: string) => {},
  SEND: (message: string) => {},
};

export const WsContext = createContext<WsContextInterface>(defaultState);

interface Props {
  children: React.ReactNode;
}
export const WebsocketContextProvider: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket>();

  const JOIN = (roomID: string) => {
    if(socketRef.current)
      return
    socketRef.current = new WebSocket(socketAddr + `/join/${roomID}`);

    // onOpen
    socketRef.current.addEventListener("open", () => {
      socketRef.current?.send(JSON.stringify({ join: "true" }));
    });

    // onMessage
    socketRef.current.addEventListener("message", (e) => {
      console.log("Received message: %s from client", e);
      console.log("TEST")
    });
  };

  const CREA = async () => {
    console.log("CREA");
    const res = await fetch(serverAddr + "/create");
    const { room_id } = await res.json();
    console.log(room_id);
    dispatch(setRoomId(room_id));
  };

  const SEND = async (message: string) => {
    console.log("sending");
    socketRef.current?.send(JSON.stringify({
      Message: message,
    }))
    console.log(socketRef.current)
  };

  return (
    <WsContext.Provider
      value={{
        JOIN: JOIN,
        CREA: CREA,
        SEND: SEND,
      }}
    >
      {children}
    </WsContext.Provider>
  );
};
