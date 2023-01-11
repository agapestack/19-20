import { Paper, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ChatMessage } from "../../config/global.config";
import { WsContext } from "../../context/WebsocketContext";
import { addMessage } from "./GlobalSlice";

const Chat = () => {
  const [text, setText] = useState<string>("");
  const global = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const wsContext = useContext(WsContext);

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      let msg: ChatMessage = { action: "message", message: text, me: true };
      wsContext.send(msg);
      dispatch(addMessage(msg));
    }
  };

  return (
    <div className="h-full w-full flex justify-between flex-col items-center">
      <div className="">
        {global.chat.map((msg, index) => (
          <div className="message-wrapper" key={index}>
            <div className={msg.me ? "chat-bubble right" : "chat-bubble left"}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        label="Message..."
        variant="outlined"
      ></TextField>
    </div>
  );
};

export default Chat;
