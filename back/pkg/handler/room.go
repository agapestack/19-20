package handler

import (
	"fmt"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// types
type Player struct {
	Host bool
	Conn *websocket.Conn
}

type RoomMap struct {
	Mutex sync.RWMutex
	Map   map[string][]Player
}

// room utilities
func (r *RoomMap) Init() {
	r.Map = make(map[string][]Player)
}

func (r *RoomMap) Get(roomID string) []Player {
	r.Mutex.RLock()
	defer r.Mutex.RUnlock()

	return r.Map[roomID]
}

func (r *RoomMap) CreateRoom() string {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	roomID := uuid.New().String()
	r.Map[roomID] = make([]Player, 0)

	return roomID
}

func (r *RoomMap) DeleteRoom(roomID string) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	delete(r.Map, roomID)
}

func (r *RoomMap) JoinRoom(roomID string, host bool, conn *websocket.Conn) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	// todo: eventually check if room exist
	p := Player{host, conn}
	r.Map[roomID] = append(r.Map[roomID], p)

	for key, value := range r.Map {
		fmt.Println(key, ": ", value)
	}

}
