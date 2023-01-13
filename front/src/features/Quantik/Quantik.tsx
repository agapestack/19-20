import "./style.css";
import { useAppSelector } from "../../app/hooks";
import Board from "./board/Board";
import QuantikMainMenu from "./menu/QuantikMainMenu";
import QuantikPlayerMenu from "./menu/player/QuantikPlayerMenu";
import QuantikSettings from "./QuantikSettings";
import QuantikWinMenu from "./menu/QuantikWinMenu";
import QuantikHistoryMenu from "./menu/history/QuantikHistoryMenu";

const Quantik = () => {
    const quantik = useAppSelector((state) => state.quantik);

    return (
        <div className={`h-screen w-screen ${quantik.menuState && "no-pe"}`}>
            <div className="flex justify-center items-center flex-col p-8 box-border h-3/5 lg:h-4/5">
                <Board></Board>
            </div>
            <QuantikMainMenu></QuantikMainMenu>

            {quantik.menuState === 1 && <QuantikSettings></QuantikSettings>}
            {quantik.menuState === 2 && <QuantikPlayerMenu></QuantikPlayerMenu>}
            {quantik.menuState === 3 && <QuantikWinMenu></QuantikWinMenu>}
            {quantik.menuState === 4 && <QuantikHistoryMenu></QuantikHistoryMenu>}
        </div>
    );
};

export default Quantik