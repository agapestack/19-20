import CircleIcon from "@mui/icons-material/Circle";
import { useEffect, useRef } from "react";
import { generateRandomString } from "../../../../utils/utils";

export interface SelectedTileProps {
  rows: number;
  cols: number;
  color: string;
}

const SelectedTile = ({ rows, cols, color }: SelectedTileProps) => {
  const selectedTileSquare = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTileSquare.current) {
      selectedTileSquare.current.style.backgroundColor = color;
    }
  }, [color]);

  return (
    <div
      className="h-full w-full flex flex-col justify-center items-center border-1 rounded-lg"
      style={{ width: (cols * 100) / 3 + "%", height: (rows * 100) / 3 + "%" }}
      ref={selectedTileSquare}
    >
      {Array.from(Array(rows)).map((r, i) => (
        <div
          className="flex h-full w-full justify-center items-center"
          key={i + generateRandomString(5)}
        >
          {Array.from(Array(cols)).map((c, j) => (
            <div
              className="h-full w-full flex justify-center items-center"
              key={j + generateRandomString(5)}
            >
              <CircleIcon></CircleIcon>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SelectedTile;
