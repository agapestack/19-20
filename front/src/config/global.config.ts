export const IS_DEV: boolean = true;


// ________________________NETWORK RELATED CONFIG_____________________________
export const serverAddr: string = "http://localhost:7777";
export const socketAddr: string = "ws://localhost:7777";

// free STUN server, thx google
export const rtcConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
}

// ________________________GAME GLOBAL CONFIG_____________________________
export type GAME_NAME = "KULAMI" | "QUANTIK" | "";
export type MENU_TYPE = "MAPPING" | "PLAY" | "";

export const gameTypeObject = {
  kulami: "KULAMI" as GAME_NAME,
  quantik: "QUANTIK" as GAME_NAME,
};

interface GameDetailType {
  gameName: GAME_NAME;
  imgPath: string;
  logoPath: string;
  gameDescription: string;
}

export const GameDetail: GameDetailType[] = [
  {
    gameName: gameTypeObject.kulami,
    imgPath: "/assets/kulami_img.jpg",
    logoPath: "/assets/KulamiLogo.png",
    gameDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores alias rem eius quo voluptatibus sapiente quas voluptatum dignissimos, veritatis et iste odit aut, laboriosam neque quis modi illo. Dicta, esse.",
  },
  {
    gameName: gameTypeObject.quantik,
    imgPath: "/assets/quantik_img.jpg",
    logoPath: "/assets/QuantikLogo.png",
    gameDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, dolores. Hic nulla sunt aspernatur ipsa harum tenetur quod minus necessitatibus iure, laboriosam at maxime mollitia quos rem dolorum exercitationem itaque?",
  },
];
