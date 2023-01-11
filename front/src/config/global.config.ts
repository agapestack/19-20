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

interface GameDetailType {
  gameName: GAME_STATE;
  imgPath: string;
  logoPath: string;
  gameDescription: string;
}

export const GameDetail: GameDetailType[] = [
  {
    gameName: gameStateObject.kulami,
    imgPath: "/assets/kulami_img.jpg",
    logoPath: "/assets/KulamiLogo.png",
    gameDescription:
      "Assemblez les tuiles pour créer un plateau différent à chaque partie. Les joueurs, à leur tour, placent une bille pour tenter de contrôler chacune des tuiles. Soyez rusés et limitez les prochains coups de votre adversaire afin de vous assurer une brillante victoire.",
  },
  {
    gameName: gameStateObject.quantik,
    imgPath: "/assets/quantik_img.jpg",
    logoPath: "/assets/QuantikLogo.png",
    gameDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, dolores. Hic nulla sunt aspernatur ipsa harum tenetur quod minus necessitatibus iure, laboriosam at maxime mollitia quos rem dolorum exercitationem itaque?",
  },
];
