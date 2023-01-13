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
type PlayerMap map[*websocket.Conn]*PlayerInfo

type PlayerInfo struct {
	RoomID   string `json:"roomID"`
	Username string `json:"username"`
	AvatarID int    `json:"avatarID"`
}

func setPlayerInfo(p PlayerInfo, conn *websocket.Conn) {
	player, ok := Players[conn]
	if !ok {
		fmt.Println("setPlayerInfo: failed to retrieve player")
		return
	}

	player.Username = p.Username
	player.RoomID = p.RoomID
	player.AvatarID = p.AvatarID
}

// Utilitaries
func Init() {
	Rooms = make(map[string][]*websocket.Conn)
	Players = make(map[*websocket.Conn]*PlayerInfo)
}

func createRoom() string {
	Mutex.Lock()
	defer Mutex.Unlock()

	roomID := uuid.New().String()
	Rooms[roomID] = make([]*websocket.Conn, 0)
	fmt.Println("Room " + roomID + " sucessfully created!")

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
	Players[conn] = &PlayerInfo{RoomID: roomID, Username: "", AvatarID: 0}
	// add conn to room slice
	Rooms[roomID] = append(Rooms[roomID], conn)
	fmt.Println("Player has joined room ", roomID, "    size: ", len(Rooms[roomID]))
	return nil
}

// if one player quit then disconnect every player from his room and delete room
func quitRoom(conn *websocket.Conn) error {
	player, ok := Players[conn]
	if !ok {
		return errors.New("failed to find player's room")
	}

	connList, ok := Rooms[player.RoomID]
	if !ok {
		return errors.New("failed to retrieve room from roomID")
	}

	broadcastToRoom(WsJsonResponse{Action: "quit", Message: "user left"}, conn)

	Mutex.Lock()
	for _, p := range connList {
		delete(Players, p)
	}
	fmt.Println("Deleting room " + player.RoomID)
	delete(Rooms, player.RoomID)
	Mutex.Unlock()
	return nil
}

func broadcastToRoom(response WsJsonResponse, conn *websocket.Conn) {
	Mutex.Lock()
	defer Mutex.Unlock()

	player, ok := Players[conn]
	if !ok {
		return
	}

	room, ok := Rooms[player.RoomID]
	if !ok {
		return
	}

	for _, c := range room {
		if c != conn {
			c.WriteJSON(response)
		}
	}

}

// _________________debuging tools___________________

func showRoom(roomID string) {
	roomConns, ok := Rooms[roomID]
	if !ok {
		fmt.Println("showRoom failed to retrieve rooom " + roomID)
		return
	}

	fmt.Printf("Room %s\n", roomID)
	for _, p := range roomConns {
		p := Players[p]
		p.print()

	}
	fmt.Println("")
}

func showRooms() {
	for k, _ := range Rooms {
		showRoom(k)
	}
}

func (p *PlayerInfo) print() {
	fmt.Printf("Username: %s\tAvatarID: %d\n", p.Username, p.AvatarID)
}
