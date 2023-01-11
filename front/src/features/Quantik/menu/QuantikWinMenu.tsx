import React from "react";
import "../style.css";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { reset, updateReplayTurn } from "../QuantikSlice";
import QuantikTurn from "./history/QuantikTurn";
import { Button } from "@mui/material";

const QuantikWinMenu = () => {
    const quantik = useAppSelector((state) => state.quantik);
    const dispatch = useAppDispatch();

    return (
        <div className="fixed w-screen h-screen top-0 left-0 z-auto pointer-events-auto bg-black/50 flex justify-center items-center">
            <div className="w-4/5 lg:w-2/5 flex flex-col justify-center items-center bg-white rounded-lg px-1 py-12">
                <div className="quantik-title">
                    Quantik
                </div>
                <div className="quantik-win-animation-container">
                    <QuantikTurn board={quantik.history[quantik.replayTurn].board} move={quantik.history[quantik.replayTurn].move}></QuantikTurn>
                </div>

                <Button variant="contained" size="large" color="primary" onClick={() => {dispatch(reset())}}>
                    Play again!
                </Button>
            </div>
        </div>
    );
};

export default QuantikWinMenu