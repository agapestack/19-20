import React, { useState } from "react";
import { Button, TextField, ButtonGroup } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import { IPlayerConfig } from "../../../../config/quantik.config";
import { updateMenuState, setPlayers } from "../../QuantikSlice";
import { initPlayer } from "../../../../utils/quantik.utils";

const PlayerMenu = () => {
  const quantik = useAppSelector((state) => state.quantik);
  const dispatch = useAppDispatch();

  const emptyNames =
    quantik.playerList[0].name.length !== 0 &&
    quantik.playerList[1].name.length !== 0;

  const [p1Name, setP1Name] = useState("");
  const [p2Name, setP2Name] = useState("");

  const handleP1 = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setP1Name(event.target.value);
  };

  const handleP2 = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setP2Name(event.target.value);
  };

  const savePlayerNames = () => {
    if (p1Name.length < 1 || p2Name.length < 1) return;

    const playerOne: IPlayerConfig = initPlayer(
      p1Name,
      quantik.playerList[0].host,
      quantik.playerList[0].side
    );
    const playerTwo: IPlayerConfig = initPlayer(
      p2Name,
      quantik.playerList[1].host,
      quantik.playerList[1].side
    );
    const playerList: IPlayerConfig[] = [playerOne, playerTwo];

    dispatch(
      !emptyNames
        ? updateMenuState({ newState: 0 })
        : updateMenuState({ newState: 1 })
    );
    dispatch(setPlayers({ newPlayerList: playerList }));
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-auto pointer-events-auto bg-black/50 flex justify-center items-center">
      <div className="w-4/5 lg:w-2/5 flex flex-col justify-center items-center bg-white rounded-lg px-1 py-12">
        <div className="quantik-title">Quantik</div>
        <form className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-4/5 mb-4 flex justify-evenly items-center">
            <TextField
              onChange={handleP1}
              label="Player 1"
              variant="outlined"
              value={p1Name}
            />
            <TextField
              onChange={handleP2}
              label="Player 2"
              variant="outlined"
              value={p2Name}
            />
          </div>
          <ButtonGroup
            variant="contained"
            size="large"
            aria-label="primary button group"
          >
            <Button onClick={savePlayerNames}>
              <input
                type="submit"
                value={!emptyNames ? "START GAME" : "SAVE CHANGES"}
              ></input>
            </Button>
            {emptyNames && (
              <Button
                color="error"
                onClick={() => {
                  dispatch(updateMenuState({ newState: 1 }));
                }}
              >
                Discard
              </Button>
            )}
          </ButtonGroup>
        </form>
      </div>
    </div>
  );
};

export default PlayerMenu;
