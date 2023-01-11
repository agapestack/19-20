package router

import (
	"github.com/agapestack/19-20/back/internal/handler"
	"github.com/agapestack/19-20/back/internal/middleware"
	"github.com/gorilla/mux"
)

func InitRouter() *mux.Router {
	r := mux.NewRouter()

	r.Use(middleware.Session)

	r.HandleFunc("/create", handler.CreateRoom)
	r.HandleFunc("/join/{roomID}", handler.JoinRoom)

	return r
}
