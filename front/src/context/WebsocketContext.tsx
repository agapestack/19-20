import React, { createContext, FC, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  serverAddr,
  socketAddr,
  googleStunServer,
} from "../config/global.config";
import { setRoomId } from "../features/Global/GlobalSlice";

interface WsContextInterface {
  CREA: () => void;
  JOIN: (roomId: string) => void;
  SEND: (message: string) => void;
}

const defaultState: WsContextInterface = {
  CREA: () => { },
  JOIN: (roomId: string) => { },
  SEND: (message: string) => { },
};

export const WsContext = createContext<WsContextInterface>(defaultState);

interface Props {
  children: React.ReactNode;
}
export const WebsocketContextProvider: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket>();

  const JOIN = (roomID: string) => {
    if (socketRef.current)
      return
    socketRef.current = new WebSocket(socketAddr + `/join/${roomID}`);

    // onOpen
    socketRef.current.addEventListener("open", () => {
      socketRef.current?.send(JSON.stringify({ join: "true" }));
    });

    // onMessage
    socketRef.current.addEventListener("message", (e) => {
      console.log("Received message: %s from client", e.data);
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

// https://webrtc.org/getting-started/peer-connections
async function makeCall(socket: WebSocket) {
  const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
  const peerConnection = new RTCPeerConnection(configuration);

  socket.addEventListener('message', async message => {
    console.log(message)
    // if (message.answer) {
    //   const remoteDesc = new RTCSessionDescription(message.answer);
    //   await peerConnection.setRemoteDescription(remoteDesc);
    // }
  });
  // const offer = await peerConnection.createOffer();
  // await peerConnection.setLocalDescription(offer);
  // signalingChannel.send({ 'offer': offer });

}