import React, { createContext, FC, useRef } from "react";
import { useDispatch } from "react-redux";
import { rtcConfig, serverAddr, socketAddr } from "../config/global.config";
import { setRoomId } from "../features/Global/GlobalSlice";

interface WsContextInterface {
  CREA: () => void;
  JOIN: (roomId: string) => void;
}

const defaultState: WsContextInterface = {
  CREA: () => {},
  JOIN: (roomId: string) => {},
};

export const WsContext = createContext<WsContextInterface>(defaultState);

interface Props {
  children: React.ReactNode;
}
export const WebsocketContextProvider: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket>();
  const peerConnection = useRef<RTCPeerConnection>();
  const sendDataChannel = useRef<RTCDataChannel>();
  const receiveDataChannel = useRef<RTCDataChannel>();

  // _________________________HIGH LEVEL FUNCTIONS_____________________________
  const CREA = async () => {
    console.log("CREA");
    const res = await fetch(serverAddr + "/create");
    const { room_id } = await res.json();
    console.log(room_id);
    dispatch(setRoomId(room_id));
  };

  const JOIN = async (roomID: string) => {
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
      console.log(message);
      switch (message.type) {
        case "answer":
          handleAnswer(message);
          break;

        case "candidate":
          handleCandidate(message.candidate);
          break;

        case "offer": // after joining client receive an offer
          handleOffer(message);
          break;

        case "ready": // second player joined sending offer
          await createOffer();
          if (peerConnection.current) {
            const offer = await peerConnection.current.createOffer();
            socketRef.current?.send(
              JSON.stringify({ type: "offer", sdp: offer.sdp })
            );
          }
          break;

        case "BYE":
          break;

        default:
          console.log("Failed to recognize message: ");
          console.log(message);
          break;
      }
    });
  };

  // _________________________LOW LEVEL FUNCTIONS_____________________________

  function createPeerConnection() {
    console.log("createPeerConnection");
    let pc = new RTCPeerConnection(rtcConfig);
    pc.onicecandidate = (e) => {
      interface iceMessage {
        type: string;
        candidate: string | null;
        sdpMid: string | null;
        sdpMLineIndex: number | null;
      }

      let message = {
        type: "candidate",
        candidate: "",
      } as iceMessage;
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.sdpMid = e.candidate.sdpMid;
        message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }

      socketRef.current?.send(JSON.stringify(message));
    };

    return pc;
  }

  async function createOffer() {
    console.log("createOffer");
    if (peerConnection.current) {
      console.error("peerConnection already exist");
      return;
    }
    peerConnection.current = createPeerConnection();
    sendDataChannel.current =
      peerConnection.current.createDataChannel("dataChannelSend");
    sendDataChannel.current.onopen = onSendOpen;
    sendDataChannel.current.onmessage = onSendMessage;
    sendDataChannel.current.onclose = onSendClose;
  }

  async function handleOffer(offer: any) {
    console.log("handleOffer");

    if (!socketRef.current) {
      console.error("failed to find socket");
    }
    if (peerConnection.current) {
      console.error("existing peerConnection");
      return;
    }

    peerConnection.current = await createPeerConnection();
    peerConnection.current.ondatachannel = receiveChannelCallback;
    const desc = new RTCSessionDescription(offer);
    await peerConnection.current.setRemoteDescription(desc);

    //sending answer
    const answer = await peerConnection.current.createAnswer();

    socketRef.current?.send(JSON.stringify(answer));

    //setting our local sdp
    await peerConnection.current.setLocalDescription(answer);
  }

  async function handleAnswer(answer: any) {
    console.log("handleAnswer");
    console.log(answer);
    if (!peerConnection.current) {
      console.error("no peerConnection");
      return;
    }
    peerConnection.current?.setRemoteDescription(answer);
  }

  async function handleCandidate(candidate: any) {
    console.log("handleCandidate");
    if (!peerConnection.current) {
      console.error("no peerConnection");
    }
    if (!candidate.candidate) {
      await peerConnection.current?.addIceCandidate({} as RTCIceCandidate);
    } else {
      await peerConnection.current?.addIceCandidate(candidate);
    }
  }

  // ________DATA CHANNEL___________
  function receiveChannelCallback(event: any) {
    console.log("receiveChannelCallback");
    receiveDataChannel.current = event.channel;
    if (receiveDataChannel.current) {
      receiveDataChannel.current.onmessage = onReceiveMessage;
      receiveDataChannel.current.onopen = onReceiveOpen;
      receiveDataChannel.current.onclose = onReceiveClose;
    }
  }

  function onReceiveMessage() {
    console.log("onReceiveMessage");
  }

  function onSendMessage() {
    console.log("onSendMessage");
  }

  function onReceiveOpen() {
    console.log("onReceiveOpen");
  }

  function onSendOpen() {
    console.log("onSendOpen");
  }

  function onReceiveClose() {
    console.log("onReceiveClose");
  }

  function onSendClose() {
    console.log("onSendClose");
  }

  // _________________________CONTEXT WRAPPER_____________________________
  return (
    <WsContext.Provider
      value={{
        JOIN: JOIN,
        CREA: CREA,
      }}
    >
      {children}
    </WsContext.Provider>
  );
};
