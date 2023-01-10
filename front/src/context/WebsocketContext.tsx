import React, { createContext, FC, useRef } from "react";
import { useDispatch } from "react-redux";
import { serverAddr, socketAddr } from "../config/global.config";
import { setRoomId } from "../features/Global/GlobalSlice";

interface WsContextInterface {
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
}

const defaultState: WsContextInterface = {
  createRoom: () => {},
  joinRoom: (roomId: string) => {},
};

export const WsContext = createContext<WsContextInterface>(defaultState);

interface Props {
  children: React.ReactNode;
}
export const WebsocketContextProvider: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket>();

  // _________________________HIGH LEVEL FUNCTIONS_____________________________
  const createRoom = async () => {
    const res = await fetch(serverAddr + "/create");
    const { room_id } = await res.json();
    dispatch(setRoomId(room_id));
  };

  const joinRoom = async (roomID: string) => {
    if (socketRef.current) return;
    socketRef.current = new WebSocket(socketAddr + `/join/${roomID}`);

    // onOpen
    socketRef.current.addEventListener("open", () => {
      console.log("socket opened");
      socketRef.current?.send(JSON.stringify({ type: "ready", message: "Yo" }));
    });

    // onMessage
    socketRef.current.addEventListener("message", async (e) => {
      const message = JSON.parse(e.data);

      switch (message.type) {
      }
    });
  };

  // _________________________CONTEXT WRAPPER_____________________________
  return (
    <WsContext.Provider
      value={{
        joinRoom: joinRoom,
        createRoom: createRoom,
      }}
    >
      {children}
    </WsContext.Provider>
  );
};
