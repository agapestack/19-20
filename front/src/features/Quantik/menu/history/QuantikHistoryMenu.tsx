import Button from "@mui/material/Button";
import { useAppDispatch } from "../../../../app/hooks";
import { updateMenuState } from "../../QuantikSlice";
import QuantikHistory from "./QuantikHistory";

const QuantikHistoryMenu = () => {
    const dispatch = useAppDispatch();

    return (
        <div className="fixed w-screen h-screen top-0 left-0 z-auto pointer-events-auto bg-black/50 flex justify-center items-center">
            <div className="w-4/5 lg:w-2/5 flex flex-col justify-center items-center bg-white rounded-lg px-1 py-12">
                <div className="quantik-title">
                    Quantik
                </div>
                <QuantikHistory></QuantikHistory>

                <Button variant="contained" size="large" color="primary" onClick={()=>{dispatch( updateMenuState({newState: 0}))}}>
                    Back to the game
                </Button>
            </div>
        </div>
    );
};

export default QuantikHistoryMenu;