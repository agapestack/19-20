//  _____________________KULAMI GLOBAL CONFIG_____________________

export const BOARD_EMPTY_VALUE = -1;

export const kulamiConfig = {
  nbColumn: 10,
  nbRow: 10,
  nbRedPawn: 28,
  nbBlackPawn: 28,
  nbTotalTiles: 17,
  nbTile_2box: 4,
  nbTile_3box: 4,
  nbTile_4box: 5,
  nbTile_6box: 4,
};

//  _____________________TILE TYPES_____________________
export type TileType = "2-2" | "3-1" | "1-3" | "2-3" | "3-2" | "1-2" | "2-1";

export const tileTypes = {
  tile_2x2: "2-2" as TileType,
  tile_3x1: "3-1" as TileType,
  tile_1x3: "1-3" as TileType,
  tile_2x3: "2-3" as TileType,
  tile_3x2: "3-2" as TileType,
  tile_2x1: "2-1" as TileType,
};

//  _____________________DATA MANAGMENT INTERFACES_____________________

export interface TileDataInterface {
  tileType: TileType;
  color: string;
  posList: number[][];
}

export type KULAMI_MENU = "MENU_MAPPING" | "MENU_PLAY";

export const kulamiMenuObject = {
  MENU_MAPPING: "MENU_MAPPING" as KULAMI_MENU,
  MENU_PLAY: "MENU_PLAY" as KULAMI_MENU,
};

export interface KulamiStateInterface {
  menu: KULAMI_MENU;
  boardTileArray: number[][];

  selectedTile: TileType | null;
  tileStack: TileDataInterface[];
  // nbTile === tileStack.length (explicit)
  nbTile: number;
}
