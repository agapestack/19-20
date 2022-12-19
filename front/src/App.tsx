import React from "react";
import Game from "./features/Global/Game";
import HomePage from "./features/Global/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { gameTypeObject } from "./config/global.config";
import { ToastContainer } from "react-toastify";
import GameMenu from "./features/Global/gameMenu/GameMenu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/game/menu" element={<GameMenu></GameMenu>} />
        <Route
          path="/game/kulami"
          element={<Game gameName={gameTypeObject.kulami} />}
        />
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
