import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../../../app/hooks";
import { IQuantikTurn, quantikConfig } from "../../../../config/quantik.config";
import QuantikCell from "../../board/QuantikCell";

const QuantikTurn = (turn: IQuantikTurn) => {
  const quantik = useAppSelector((state) => state.quantik);

  return (
      <Card sx={{ maxHeight: 245}}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" className="text-center">
            {`Turn ${turn.index}: ${quantik.playerList.find((player) => {return(player.side === turn.move.side)})?.name}`}
          </Typography>
          <div className="p-1 border-black border-2 border-solid rounded-lg bg-slate-600">
            {[...Array(quantikConfig.nbRow)].map((r, y) => (
              <div className="flex">
                {[...Array(quantikConfig.nbColumn)].map((c, x) => (
                  <QuantikCell
                    key={`(${x}, ${y})`}
                    isHistoryCell={true}
                    cell={{
                      pos: { x: x, y: y },
                      piece: turn.board[y][x].piece,
                      region: turn.board[y][x].region,
                    }}
                  />
                ))}
              </div>
            ))}
        </div>
        </CardContent>
      </Card>
  );
};

export default QuantikTurn;
