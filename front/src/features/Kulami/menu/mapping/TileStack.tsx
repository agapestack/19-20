import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { TileDataInterface } from "../../../../config/kulami.config";
import { extractTileSize } from "../../../../utils/kulami.utils";
import { generateRandomString } from "../../../../utils/utils";

const TileStack = () => {
  const kulami = useAppSelector((state) => state.kulami);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col">
      <div className="">
        {kulami.tileStack.map((e: TileDataInterface, i: number) => (
          <div id={String(i) + generateRandomString(5)}>
            {e.tileType}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TileStack;
