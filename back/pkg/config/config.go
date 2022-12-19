package config

import (
	"context"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/go-redis/redis/v9"
	"github.com/gorilla/sessions"
	"github.com/gorilla/websocket"
)

var SessionStore *sessions.CookieStore
var RedisDb *redis.Client
var ctx = context.Background()
var Upgrader websocket.Upgrader

func Init() {
	initCookieStore()
	initRedisClient()
	initUpgrader()
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

func initRedisClient() {
	var (
		addr   = os.Getenv("REDIS_ADDR")
		passwd = os.Getenv("REDIS_PASSWORD")
		db, _  = strconv.Atoi(os.Getenv("REDIS_DB"))
	)

	RedisDb = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: passwd,
		DB:       db,
	})
}

func SetCache(key string, value interface{}) {
	err := RedisDb.Set(ctx, key, value, 0).Err()
	if err != nil {
		log.Fatal(err)
		panic(err)
	}
}

func GetCache(key string) interface{} {
	val, err := RedisDb.Get(ctx, key).Result()
	if err != nil {
		log.Fatal(err)
		panic(err)
	}

	return val
}
