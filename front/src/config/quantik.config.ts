// Basic config
export const quantikConfig = {
    nbRow: 4,
    nbColumn: 4,
    totalTiles: 16,

    nbDifferentPieces: 4,
    nbShapePieces: 2,

    regionSize: 4,
    regionCount: 4
};

export interface IPlayerConfig {
    name: string,
    host: boolean,
    side: SideType
};

export interface IPlayerPieces {
    pieces: IQuantikPiece[]
}

export interface IQuantikState {
    playerList: IPlayerConfig[],
    player: number,
    board: IQuantikCell[][],
    selectedPiece: ISelectedPiece | -1,
    nbPiece: number,
    pieces: {
        white: IPlayerPieces,
        black: IPlayerPieces
    },
    history: IQuantikTurn[],
    winningCells: {x: number, y: number}[],
    menuState: number,
    replayTurn: number
};

export interface IQuantikTurn {
    board: IQuantikCell[][],
    move: IQuantikPiece,
    index: number
}

export interface IQuantikPiece {
    shape: ShapeType,
    side: SideType,
    pos: {x: number, y: number}
}

export const EMPTY_PIECE: IQuantikPiece = {shape: "NONE", side: "NONE", pos: {x: -1, y: -1}};

export interface IQuantikCell {
    pos: {x: number, y: number},
    piece: IQuantikPiece,
    region: number
}

export interface IRegion {
    color: SideType,
    cells: IQuantikCell[]
}

export interface IQuantikBoard {
    regions: IRegion[]
}

export interface ISelectedPiece {
    piece: IQuantikPiece
}

// Define all valid shapes types
export type ShapeType = "SPHERE" | "CUBE" | "CYLINDER" | "CONE" | "NONE";

export const shapeTypes = {
    sphere: "SPHERE" as ShapeType,
    cube: "CUBE" as ShapeType,
    cylinder: "CYLINDER" as ShapeType,
    cone: "CONE" as ShapeType
};

export enum Shape {
    SPHERE = 'sphere',
    CUBE = 'cube',
}

// Define the different player colors
// This is used to differentiate between both players shapes
export type SideType = "WHITE" | "BLACK" | "NONE";

export const sideTypes = {
    white: "WHITE" as SideType,
    black: "BLACK" as SideType
};