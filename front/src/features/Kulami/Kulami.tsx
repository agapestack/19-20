import React from "react";
import { useAppSelector } from "../../app/hooks";
import { kulamiMenuObject } from "../../config/kulami.config";
import Board from "./board/Board";
import KulamiMappingMenu from "./menu/KulamiMappingMenu";
import KulamiPlayMenu from "./menu/KulamiPlayMenu";

const Kulami = () => {
  const kulami = useAppSelector((state) => state.kulami);

  return (
    <div className="min-h-screen min-w-screen h-full w-full grid grid-cols-12 kulami-background">
      <div className="col-span-9 flex justify-center items-center">
        <Board></Board>
      </div>

      <div className="col-span-3">
        {kulami.menu === kulamiMenuObject.MENU_MAPPING && (
          <KulamiMappingMenu></KulamiMappingMenu>
        )}
        {kulami.menu === kulamiMenuObject.MENU_PLAY && (
          <KulamiPlayMenu></KulamiPlayMenu>
        )}
      </div>
    </div>
  );
};

export default Kulami;
