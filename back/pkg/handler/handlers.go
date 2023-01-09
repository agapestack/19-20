package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/agapestack/19-20/back/pkg/config"
	"github.com/agapestack/19-20/back/pkg/logger"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

// lobby/websocket
var Rooms RoomMap
var broadcast = make(chan broadcastMessage)

type broadcastMessage struct {
	Message map[string]interface{}
	RoomID  string
	Client  *websocket.Conn
}

func broadcaster() {
	for {
		msg := <-broadcast
		for _, client := range Rooms.Map[msg.RoomID] {
			// if player is not the sender send msg
			if client.Conn != msg.Client {
				err := client.Conn.WriteJSON(msg.Message)

				if err != nil {
					fmt.Println("error")
					log.Fatal(err)
					client.Conn.Close()
				}
			}
		}
	}
}

// responses types
type errorResponse struct {
	Message string `json:"message"`
}

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	logger.Debug("CREA")
	roomID := Rooms.CreateRoom()

	type responseType struct {
		RoomID string `json:"room_id"`
	}

	json.NewEncoder(w).Encode(responseType{RoomID: roomID})
}

func JoinRoom(w http.ResponseWriter, r *http.Request) {
	logger.Debug("JOIN")
	vars := mux.Vars(r)
	roomID := vars["roomID"]

	if roomID == "" {
		json.NewEncoder(w).Encode(errorResponse{Message: "roomID not provided"})
	}

	_, ok := Rooms.Map[roomID]
	if !ok {
		json.NewEncoder(w).Encode(errorResponse{Message: "room not found"})
	}

	ws, err := config.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("Web Socket Upgrade Error", err)
	}
	Rooms.JoinRoom(roomID, false, ws)

	go broadcaster()
	for {
		var msg broadcastMessage

		err := ws.ReadJSON(&msg.Message)
		if err != nil {
			logger.Debug(err.Error())
			// fmt.Println("Read Error: ", err)
		}

		msg.Client = ws
		msg.RoomID = vars["roomID"]

		log.Println(msg.Message)

		broadcast <- msg
	}
}
