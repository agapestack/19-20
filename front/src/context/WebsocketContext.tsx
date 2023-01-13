import React, { createContext, FC, useRef } from "react";
import { useDispatch } from "react-redux";
import { PlayerType, serverAddr, socketAddr } from "../config/global.config";
import {
  addMessage,
  setRoomId,
  setOpponent,
  toggleOpponentHasJoin,
  globalStartGame,
  setGameChoice,
} from "../features/Global/GlobalSlice";

interface WsContextInterface {
  createRoom: () => void;
  joinRoom: (roomID: string, username: string, avatarID: number) => void;
  send: (message: WsPayload) => void;
}
const defaultState: WsContextInterface = {
  createRoom: () => {},
  joinRoom: (roomID: string, username: string, avatarID: number) => {},
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
    socketRef.current?.send(JSON.stringify(message));
  };

  const joinRoom = async (
    roomID: string,
    username: string,
    avatarID: number
  ) => {
    console.log(
      "joining room ",
      roomID,
      " username: ",
      username,
      " avatarID: ",
      avatarID
    );
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

    socketRef.current.addEventListener("open", (e) => {
      sendMessage({
        action: "join",
        message: JSON.stringify({
          roomID: roomID,
          username: username,
          avatarID: avatarID,
        }),
      });
    });

    socketRef.current.addEventListener("error", (e) => {
      console.log(e);
      console.log("error captured, need to handle it!");
      // window.location.href = BASE_URL;
    });

    // onMessage
    socketRef.current.addEventListener("message", async (e) => {
      const message = JSON.parse(e.data);
      console.log(message);

      switch (message.action) {
        case "quit":
          console.log("need to redirect");
          break;
        case "message":
          dispatch(
            addMessage({
              me: false,
              message: message.message,
              action: "message",
            })
          );
          break;
        case "join":
          dispatch(toggleOpponentHasJoin());
          dispatch(setOpponent(JSON.parse(message.message) as PlayerType));
          break;
        case "start-quantik":
          dispatch(globalStartGame);
          // dispatch(setPawn)
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
