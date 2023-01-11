import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import QuantikShapeMenu from "./QuantikShapeMenu";
import { updateMenuState } from "../QuantikSlice";
import { Button, ButtonGroup } from "@mui/material";
import SelectedPiece from "./SelectedPiece";
import { ISelectedPiece, shapeTypes } from "../../../config/quantik.config";

const QuantikMainMenu = () => {
  const quantik = useAppSelector((state) => state.quantik);
  const dispatch = useAppDispatch();

  var pieceToReturn: ISelectedPiece = {
    piece: {
      shape: shapeTypes.cube,
      side: quantik.playerList[quantik.player].side,
      pos: {x: -1, y: -1}
    }
  };

  if (quantik.selectedPiece != -1) {
    pieceToReturn.piece = quantik.selectedPiece.piece;
  }

  return (
    <div className="w-screen h-auto lg:h-1/5 fixed bottom-0 left-0 flex justify-evenly items-center bg-black/10 flex-col lg:flex-row box-border py-2 lg:py-0">
        <div className="bg-black/10 w-full lg:w-auto rounded-lg border-2 border-solid border-black/20 flex justify-center items-center">
            <SelectedPiece piece={pieceToReturn.piece}></SelectedPiece>
        </div>
        <QuantikShapeMenu></QuantikShapeMenu>
        <div className="flex justify-center items-center w-full lg:w-1/5">
            <ButtonGroup variant="contained" size="large" aria-label="primary button group">
                <Button onClick={() => {dispatch(updateMenuState({newState: 1}))}}>
                <SettingsIcon></SettingsIcon> Settings
                </Button>
                <Button color="error">
                    <Link to="/">
                        <ExitToAppIcon></ExitToAppIcon> Quit
                    </Link>
                </Button>
            </ButtonGroup>
        </div>
    </div>
  );
};

export default QuantikMainMenu;