package handler

import (
	"fmt"
	"log"
	"net/http"

	"github.com/agapestack/19-20/back/pkg/config"
)

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	fmt.Println("websocket reached")

	conn, err := config.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade: ", err)
	}

	defer conn.Close()
}
