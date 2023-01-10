const startButton = document.getElementById('startButton');
const closeButton = document.getElementById('closeButton');
const sendButton = document.getElementById('sendButton');
// sendButton.onclick = sendData;

const dataChannelSend = document.querySelector('textarea#dataChannelSend');
const dataChannelReceive = document.querySelector('textarea#dataChannelReceive');

let pc;
let sendChannel;
let receiveChannel;

const serverAddr = "http://localhost:7777"

let roomID = ""

const createRoom = async () => {
    const res = await fetch(serverAddr + "/create");
    const { room_id } = await res.json();
    console.log(room_id);
    roomID = room_id
}
const socket = new WebSocket("http://localhost:")