package handler

import (
	"errors"
	"fmt"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// handler storage
var Rooms RoomMap
var Players PlayerMap
var Mutex sync.Mutex
var wsChan = make(chan WsPayload)

// types
type RoomMap map[string][]*websocket.Conn
type PlayerMap map[*websocket.Conn]string

// Utilitaries
func Init() {
	Rooms = make(map[string][]*websocket.Conn)
	Players = make(map[*websocket.Conn]string)
}

func createRoom() string {
	Mutex.Lock()
	defer Mutex.Unlock()

	roomID := uuid.New().String()
	Rooms[roomID] = make([]*websocket.Conn, 0)
	fmt.Println(roomID)

	return roomID
}

// todo: check if room already full
func joinRoom(roomID string, conn *websocket.Conn) error {
	Mutex.Lock()
	defer Mutex.Unlock()

	// if room not found return error
	_, ok := Rooms[roomID]
	if !ok {
		return errors.New("room not found")
	}

	if len(Rooms[roomID]) >= 2 {
		return errors.New("room already full")
	}

	// add connection to player map
	Players[conn] = roomID
	// add conn to room slice
	Rooms[roomID] = append(Rooms[roomID], conn)
	return nil
}

func quitRoom(conn *websocket.Conn) error {

	roomID, ok := Players[conn]
	if !ok {
		return errors.New("failed to find player's room")
	}

	_, ok = Rooms[roomID]
	if !ok {
		return errors.New("failed to retrieve room from roomID")
	}

	// remove room from rooms map
	broadcastToRoom(WsJsonResponse{Action: "quit", Message: "user left"}, conn)

	Mutex.Lock()
	delete(Rooms, roomID)
	// remove player from players map
	delete(Players, conn)
	Mutex.Unlock()
	return nil
}
