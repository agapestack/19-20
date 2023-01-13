import React from "react";
import "./style.css";
import { useAppDispatch } from "../../app/hooks";
import { updateMenuState } from "./QuantikSlice";
import { Button, ButtonGroup } from "@mui/material";

const QuantikSettings = () => {
    const dispatch = useAppDispatch();

    return (
        <div className="fixed w-screen h-screen top-0 left-0 z-auto pointer-events-auto bg-black/50 flex justify-center items-center">
            <div className="w-4/5 lg:w-2/5 flex flex-col justify-center items-center bg-white rounded-lg px-1 py-12">
                <div className="quantik-title">
                    Quantik
                </div>
                <ButtonGroup variant="contained" orientation="vertical" size="large" aria-label="primary button group">
                    <Button color="secondary" onClick={()=>{dispatch(updateMenuState({newState: 2}))}}>
                        Change player names
                    </Button>

                    <Button onClick={()=>{dispatch( updateMenuState({newState: 0}))}}>
                        Back to the game
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default QuantikSettings