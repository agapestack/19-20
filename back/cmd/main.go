package main

import (
	"log"
	"net/http"
	"os"

	"github.com/agapestack/19-20/back/internal/config"
	"github.com/agapestack/19-20/back/internal/handler"
	"github.com/agapestack/19-20/back/internal/router"
	"github.com/gorilla/handlers"
	"github.com/joho/godotenv"
)

func main() {
	// loading .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	config.Init()

	handler.Init()
	go handler.ListenWsChannel()

	router := router.InitRouter()

	http.Handle("/", router)
	http.ListenAndServe(os.Getenv("SERVER_PORT"), handlers.CORS()(router))
}
