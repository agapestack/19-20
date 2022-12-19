package db

import (
	"context"
	"os"
	"strconv"

	"github.com/go-redis/redis/v9"
)

var ctx = context.Background()
var client *redis.Client

func InitRedisClient() {
	addr := os.Getenv("REDIS_ADDR")
	password := os.Getenv("REDIS_PASSWORD")
	db, _ := strconv.Atoi(os.Getenv("REDIS_DB"))

	client = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})
}

