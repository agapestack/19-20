import HomePage from "./features/Global/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GameSelection from "./features/Global/game/GameSelection";
import GameLobby from "./features/Global/game/GameLobby";
import Game from "./features/Global/game/Game";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/game" element={<GameSelection></GameSelection>} />
        <Route
          path="/game/:gameChoice/:roomID"
          element={<GameLobby></GameLobby>}
        />

        <Route
          path="/offline/kulami"
          element={<Game gameState="KULAMI" isOnline={false}></Game>}
        />
        <Route
          path="/offline/quantik"
          element={<Game gameState="QUANTIK" isOnline={false}></Game>}
        />

        <Route
          path="/online/quantik"
          element={<Game gameState="QUANTIK" isOnline={true}></Game>}
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
