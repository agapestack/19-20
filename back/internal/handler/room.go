package handler

import (
	"fmt"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// types
type RoomMap struct {
	Mutex sync.RWMutex
	Map   map[string][]*websocket.Conn
}

type PlayerMap struct {
	Mutex sync.RWMutex
	Map   map[*websocket.Conn]string
}

// room utilities
func (r *RoomMap) Init() {
	r.Map = make(map[string][]*websocket.Conn)
}

func (r *RoomMap) Get(roomID string) []*websocket.Conn {
	r.Mutex.RLock()
	defer r.Mutex.RUnlock()

	return r.Map[roomID]
}

func (r *RoomMap) CreateRoom() string {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	roomID := uuid.New().String()
	r.Map[roomID] = make([]*websocket.Conn, 0)

	return roomID
}

// todo: check if room already full
func (r *RoomMap) JoinRoom(roomID string, conn *websocket.Conn) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	Players.Mutex.Lock()
	Players.Map[conn] = roomID
	Players.Mutex.Unlock()

	r.Map[roomID] = append(r.Map[roomID], conn)

	fmt.Println("Room: ")
	for key, value := range r.Map {
		fmt.Println(key, ": ", value)
	}
}

func (r *RoomMap) QuitRoom(roomID string, conn *websocket.Conn) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	if _, ok := Rooms.Map[roomID]; !ok {
		return
	}

	room := Rooms.Map[roomID]
	for i := 0; i < len(room); i++ {
		if room[i] == conn {
			removeFromSlice(room, i)
			break
		}
	}

	if len(room) == 0 {
		Rooms.deleteRoom(roomID)
	}

	Players.Mutex.Lock()
	delete(Players.Map, conn)
	Players.Mutex.Unlock()
}

func (r *RoomMap) deleteRoom(roomID string) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	delete(r.Map, roomID)
}

func removeFromSlice(s []*websocket.Conn, i int) []*websocket.Conn {
	s[i] = s[len(s)-1]
	return s[:len(s)-1]
}
