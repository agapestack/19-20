import { useAppSelector } from "../../../../app/hooks";
import { TileDataInterface } from "../../../../config/kulami.config";
import { generateRandomString } from "../../../../utils/utils";
import { selectKulami } from "../../KulamiSlice";

const TileStack = () => {
  const kulami = useAppSelector(selectKulami);

  return (
    <div className="flex flex-col">
      <div className="">
        {kulami.tileStack.map((e: TileDataInterface, i: number) => (
          <div id={String(i) + generateRandomString(5)}>
            Tile {e.tileType} placed at {e.tilePos}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TileStack;
