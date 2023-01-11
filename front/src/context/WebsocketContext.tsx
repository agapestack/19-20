import React, { createContext, FC, useRef } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL, serverAddr, socketAddr } from "../config/global.config";
import { addMessage, setRoomId } from "../features/Global/GlobalSlice";

interface WsContextInterface {
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  send: (message: WsPayload) => void;
}
const defaultState: WsContextInterface = {
  createRoom: () => {},
  joinRoom: (roomId: string) => {},
  send: (message: WsPayload) => {},
};
export const WsContext = createContext<WsContextInterface>(defaultState);

interface WsPayload {
  action: string;
  message: string;
}

interface Props {
  children: React.ReactNode;
}
export const WebsocketContextProvider: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket>();

  const createRoom = async () => {
    const res = await fetch(serverAddr + "/create");
    const { message } = await res.json();
    dispatch(setRoomId(message));
  };

  const sendMessage = (message: WsPayload) => {
    socketRef.current?.send(JSON.stringify(message))
  }

  const joinRoom = async (roomID: string) => {
    window.onbeforeunload = function () {
      console.log("Leaving");
      let jsonData: WsPayload = {
        action: "quit",
        message: "",
      };
      socketRef.current?.send(JSON.stringify(jsonData));
    };

    if (socketRef.current) return;
    socketRef.current = new WebSocket(socketAddr + `/join/${roomID}`);

    socketRef.current.addEventListener("error", (e) => {
      console.log(e)
      console.log("error captured, need to handle it!")
      window.location.href = BASE_URL
    })

    // onOpen
    socketRef.current.addEventListener("open", () => {
      console.log("socket opened");
    });

    // onMessage
    socketRef.current.addEventListener("message", async (e) => {
      const message = JSON.parse(e.data);
      console.log(message);

      switch (message.action) {
        case "quit":
          console.log("need to redirect")
          break;
        case "message":
          dispatch(addMessage({me: false, message: message.message, action: "message"}))
          break;
      }
    });
  };

  return (
    <WsContext.Provider
      value={{
        joinRoom: joinRoom,
        createRoom: createRoom,
        send: sendMessage,
      }}
    >
      {children}
    </WsContext.Provider>
  );
};
