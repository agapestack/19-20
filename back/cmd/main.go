package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/agapestack/19-20/back/pkg/config"
	"github.com/agapestack/19-20/back/pkg/router"
	"github.com/joho/godotenv"
)

func main() {
	// loading .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	config.Init()

	router := router.InitRouter()

	http.Handle("/", router)
	// temporary for dev
	fmt.Println("http://localhost" + os.Getenv("SERVER_PORT"))
	http.ListenAndServe(os.Getenv("SERVER_PORT"), nil)
}
