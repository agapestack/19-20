package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/agapestack/19-20/back/internal/config"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

// lobby/websocket
var Rooms RoomMap
var Players PlayerMap
var wsChan = make(chan WsPayload)

type WsJsonResponse struct {
	Action  string `json:"action"`
	Message string `json:"message"`
}

type WsPayload struct {
	Action  string          `json:"action"`
	Message string          `json:"message"`
	RoomID  string          `json:"room_id"`
	Conn    *websocket.Conn `json:"-"`
}

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	roomID := Rooms.CreateRoom()
	json.NewEncoder(w).Encode(WsJsonResponse{Action: "create", Message: roomID})
}

func JoinRoom(w http.ResponseWriter, r *http.Request) {
	fmt.Println("JOIN")
	vars := mux.Vars(r)
	roomID := vars["roomID"]

	if roomID == "" {
		json.NewEncoder(w).Encode(WsJsonResponse{Action: "error", Message: "roomID not provided"})
	}

	_, ok := Rooms.Map[roomID]
	if !ok {
		json.NewEncoder(w).Encode(WsJsonResponse{Action: "error", Message: "room not found"})
	}

	conn, err := config.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("Web Socket Upgrade Error", err)
	}
	Rooms.JoinRoom(roomID, conn)

	go listenWs(conn)
}

func listenWs(conn *websocket.Conn) {
	// recover if dies
	defer func() {
		if r := recover(); r != nil {
			log.Println("Error", fmt.Sprintf("%v", r))
		}
	}()

	var payload WsPayload

	for {
		err := conn.ReadJSON(&payload)
		if err != nil {
			// do nothing
		} else {
			// no error --> send it to wsChan
			payload.Conn = conn
			wsChan <- payload
		}
	}

}

func ListenWsChannel() {
	// var response WsJsonResponse

	for {
		e := <-wsChan

		fmt.Println(e.Message)

		// switch e.Action {

		// }
	}
}

func broadcastToRoom(response WsJsonResponse, conn *websocket.Conn) {
	roomId, ok := Players.Map[conn]
	if !ok {
		return
	}

	room, ok := Rooms.Map[roomId]
	if !ok {
		return
	}

	for _, c := range room {
		if c != conn {
			c.WriteJSON(response)
		}
	}

}
