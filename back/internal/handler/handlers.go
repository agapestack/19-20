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

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	roomID := createRoom()
	json.NewEncoder(w).Encode(WsJsonResponse{Action: "create", Message: roomID})
}

func JoinRoom(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	roomID := vars["roomID"]

	if roomID == "" {
		return
	}

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

	joinRoom(roomID, conn)

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

		fmt.Println(e.Action)
		fmt.Println(e.Message)

		switch e.Action {
		case "quit":
			quitRoom(e.Conn)
		case "message":
			broadcastToRoom(WsJsonResponse{Action: "message", Message: e.Message}, e.Conn)
		}
	}
}

func broadcastToRoom(response WsJsonResponse, conn *websocket.Conn) {
	Mutex.Lock()
	defer Mutex.Unlock()

	roomId, ok := Players[conn]
	if !ok {
		return
	}

	room, ok := Rooms[roomId]
	if !ok {
		return
	}

	for _, c := range room {
		if c != conn {
			c.WriteJSON(response)
		}
	}

}
