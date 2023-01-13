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

func CreateRoom(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	roomID := createRoom()
	json.NewEncoder(w).Encode(WsJsonResponse{Action: "create", Message: roomID})
}

func JoinRoom(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	roomID := vars["roomID"]

	_, ok := Rooms[roomID]
	if !ok {
		return
	}

	if len(Rooms[roomID]) >= 2 {
		return
	}

	conn, err := config.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("failed to upgrade connection")
		return
	}

	err = joinRoom(roomID, conn)
	if err != nil {
		fmt.Println(err.Error())
	}

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
	fmt.Println("Starting ListenWsChannel")
	// var response WsJsonResponse

	for {
		e := <-wsChan

		fmt.Printf("Action: %s\nMessage: %s\n\n", e.Action, e.Message)

		switch e.Action {
		case "join":
			var newPlayer PlayerInfo
			err := json.Unmarshal([]byte(e.Message), &newPlayer)
			if err != nil {
				fmt.Println(err)
				quitRoom(e.Conn)
			}

			// register players details
			setPlayerInfo(newPlayer, e.Conn)
			player := Players[e.Conn]

			// if someone was already there share previously registered user with him
			roomConns, ok := Rooms[player.RoomID]
			if !ok {
				fmt.Println("failed roomConns")
				quitRoom(e.Conn)
			}

			broadcastToRoom(WsJsonResponse{Action: e.Action, Message: e.Message}, e.Conn)
			if len(roomConns) == 2 {
				var otherPlayer *PlayerInfo
				if roomConns[0] == e.Conn {
					otherPlayer = Players[roomConns[1]]
				} else {
					otherPlayer = Players[roomConns[0]]
				}
				otherPlayerSerialized, _ := json.Marshal(PlayerInfo{
					Username: otherPlayer.Username,
					AvatarID: otherPlayer.AvatarID,
				})
				e.Conn.WriteJSON(WsJsonResponse{Action: "join", Message: string(otherPlayerSerialized)})
			}
		case "quit":
			quitRoom(e.Conn)
		case "message", "start-quantik":
			broadcastToRoom(WsJsonResponse{Action: e.Action, Message: e.Message}, e.Conn)
		}
	}
}
