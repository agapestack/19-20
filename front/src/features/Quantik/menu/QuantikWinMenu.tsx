import "../style.css";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { reset, updateReplayTurn } from "../QuantikSlice";
import QuantikTurn from "./history/QuantikTurn";
import { Button, Typography } from "@mui/material";

const QuantikWinMenu = () => {
    const quantik = useAppSelector((state) => state.quantik);
    const dispatch = useAppDispatch();

    if (quantik.replayTurn === 0) {
        var turnIndex = quantik.replayTurn;
        const test = setInterval(() => {
            turnIndex++;
            dispatch(updateReplayTurn({newTurn: turnIndex}));
            if (turnIndex === quantik.history.length - 1) clearInterval(test);
        }, 1000);
        if (turnIndex === quantik.history.length - 1) clearInterval(test);
    }

    return (
        <div className="fixed w-screen h-screen top-0 left-0 z-auto pointer-events-auto bg-black/50 flex justify-center items-center">
            <div className="w-4/5 lg:w-2/5 flex flex-col justify-center items-center bg-white rounded-lg px-1 py-12">
                <div className="quantik-title">
                    Quantik
                </div>
                <div className="flex justify-center items-center flex-col my-4 pointer-events-none">
                    <Typography gutterBottom variant="h5" component="div">Congratulations {quantik.playerList.find((player) => {return(player.side === quantik.history[quantik.history.length-1].move.side)})?.name} you win!</Typography>
                    <QuantikTurn index={quantik.replayTurn + 1} board={quantik.history[quantik.replayTurn].board} move={quantik.history[quantik.replayTurn].move}></QuantikTurn>
                </div>

                <Button variant="contained" size="large" color="primary" onClick={() => {dispatch(reset())}}>
                    Play again!
                </Button>
            </div>
        </div>
    );
};

export default QuantikWinMenu