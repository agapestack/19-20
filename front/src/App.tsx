import HomePage from "./features/Global/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GameSelection from "./features/Global/game/GameSelection";
import GameLobby from "./features/Global/game/GameLobby";
import Kulami from "./features/Kulami/Kulami";
import Quantik from "./features/Quantik/Quantik";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/game" element={<GameSelection></GameSelection>} />
        <Route path="/game/:roomID" element={<GameLobby></GameLobby>} />

        <Route path="/kulami" element={<Kulami></Kulami>} />
        <Route path="/quantik" element={<Quantik></Quantik>} />
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
