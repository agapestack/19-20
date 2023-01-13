package config

import (
	"net/http"
	"os"

	"github.com/go-redis/redis/v9"
	"github.com/gorilla/sessions"
	"github.com/gorilla/websocket"
)

var SessionStore *sessions.CookieStore
var RedisDb *redis.Client
var Upgrader websocket.Upgrader

func Init() {
	initCookieStore()
	initUpgrader()
}

func initUpgrader() {
	Upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
}

func initCookieStore() {
	SessionStore = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
}
