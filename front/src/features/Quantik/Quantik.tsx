import React from "react";
import "./style.css";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Board from "./board/Board";
import QuantikShapeMenu from "./menu/QuantikShapeMenu";
import QuantikMainMenu from "./menu/QuantikMainMenu";
import QuantikPlayerMenu from "./menu/player/QuantikPlayerMenu";
import QuantikHistory from "./menu/history/QuantikHistory";
import QuantikSettings from "./QuantikSettings";
import QuantikWinMenu from "./menu/QuantikWinMenu";

const Quantik = () => {
    const quantik = useAppSelector((state) => state.quantik);
    //const dispatch = useAppDispatch();

    return (
        <div className={`h-screen w-screen ${quantik.menuState && "no-pe"}`}>
            <div className="flex justify-center items-center flex-col p-8 box-border h-3/5 lg:h-4/5">
                <Board></Board>
                { false && <QuantikHistory></QuantikHistory>}
            </div>
            <QuantikMainMenu></QuantikMainMenu>

            {quantik.menuState == 1 && <QuantikSettings></QuantikSettings>}
            {quantik.menuState == 2 && <QuantikPlayerMenu></QuantikPlayerMenu>}
            {quantik.menuState == 3 && <QuantikWinMenu></QuantikWinMenu>}
        </div>
    );
};

export default Quantik