package config

import (
	"net/http"
	"os"

	"github.com/agapestack/19-20/back/pkg/logger"
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
	logger.InitDebug()
}

func initUpgrader() {
	Upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
}

func initCookieStore() {
	SessionStore = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
}
