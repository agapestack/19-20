import React from "react";
import Game from "./features/Global/game/Game";
import HomePage from "./features/Global/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import GameSelection from "./features/Global/game/GameSelection";
import GameLobby from "./features/Global/game/GameLobby";
import { gameStateObject } from "./config/global.config";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/game" element={<GameSelection></GameSelection>} />
        <Route path="/game/:roomID" element={<GameLobby></GameLobby>} />
      </Routes>

      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
