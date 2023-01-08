package router

import (
	"github.com/agapestack/19-20/back/pkg/handler"
	"github.com/agapestack/19-20/back/pkg/middleware"
	"github.com/gorilla/mux"
)

func InitRouter() *mux.Router {
	r := mux.NewRouter()

	// init room map
	handler.Rooms.Init()

	r.Use(middleware.SessionMiddleware)

	r.HandleFunc("/create", handler.CreateRoom)
	r.HandleFunc("/join/{roomID}", handler.JoinRoom)

	return r
}
