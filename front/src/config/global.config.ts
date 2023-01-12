export const IS_DEV = false;
export const BASE_URL = "http://localhost:3000";

// ________________________NETWORK CONFIG_____________________________
export const serverAddr: string = "http://localhost:7777";
export const socketAddr: string = "ws://localhost:7777";

// ________________________CHAT CONFIG_____________________________
export interface ChatMessage {
  action: string;
  me: boolean;
  message: string;
}

// ________________________GAME CONFIG_____________________________
export type GAME_STATE = "KULAMI" | "QUANTIK";
export type KULAMI_STATE = "MAPPING" | "PLAY" | "";

export const gameStateObject = {
  kulami: "KULAMI" as GAME_STATE,
  quantik: "QUANTIK" as GAME_STATE,
};

export interface PlayerType {
  username: string;
  avatarID: number;
}

interface GameDetailType {
  gameName: GAME_STATE;
  imgPath: string;
  logoPath: string;
  gameDescription: string;
}

export const GameDetail: GameDetailType[] = [
  {
    gameName: gameStateObject.kulami,
    imgPath: "/assets/kulami/kulami_img.jpg",
    logoPath: "/assets/kulami/KulamiLogo.png",
    gameDescription:
      "Assemblez les tuiles pour créer un plateau différent à chaque partie. Les joueurs, à leur tour, placent une bille pour tenter de contrôler chacune des tuiles. Soyez rusés et limitez les prochains coups de votre adversaire afin de vous assurer une brillante victoire.",
  },
  {
    gameName: gameStateObject.quantik,
    imgPath: "/assets/quantik/quantik_img.jpg",
    logoPath: "/assets/quantik/QuantikLogo.png",
    gameDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, dolores. Hic nulla sunt aspernatur ipsa harum tenetur quod minus necessitatibus iure, laboriosam at maxime mollitia quos rem dolorum exercitationem itaque?",
  },
];

interface PlayerAvatarType {
  imgPath: string;
  id: number;
}

export const PlayerAvatar: PlayerAvatarType[] = [
  {
    imgPath: "/assets/avatar/1.png",
    id: 1,
  },
  {
    imgPath: "/assets/avatar/2.png",
    id: 2,
  },
  {
    imgPath: "/assets/avatar/3.png",
    id: 3,
  },
  {
    imgPath: "/assets/avatar/4.png",
    id: 4,
  },
  {
    imgPath: "/assets/avatar/5.png",
    id: 5,
  },
  {
    imgPath: "/assets/avatar/6.png",
    id: 6,
  },
  {
    imgPath: "/assets/avatar/7.png",
    id: 7,
  },
  {
    imgPath: "/assets/avatar/8.png",
    id: 8,
  },
];
