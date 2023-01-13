import { useEffect, useRef } from "react";
import { TileType } from "../../../config/kulami.config";
import { extractTileSize } from "../../../utils/kulami.utils";

interface miniTileProps {
  tileType: TileType;
  color: string | null;
}

const MiniTile = ({ tileType, color }: miniTileProps) => {
  let tileRef = useRef<HTMLDivElement>(null);
  let [rows, cols] = extractTileSize(tileType);

  let nbDiv = rows * cols;

  useEffect(() => {
    if (tileRef.current && color !== null) {
      tileRef.current.style.backgroundColor = color;
    }
  }, []);

  return (
    <div
      className={`"grid grid-cols-${cols} grid-rows-${rows} border-1 pl-0 hover:scale-110 ease-in-out duration-300"`}
      ref={tileRef}
    >
      {[...Array(nbDiv)].map((_) => (
        <div className={"w-4 h-4 border-1 border-black"}></div>
      ))}
    </div>
  );
};

export default MiniTile;
