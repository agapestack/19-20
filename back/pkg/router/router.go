package router

import (
	"github.com/agapestack/19-20/back/pkg/handler"
	"github.com/agapestack/19-20/back/pkg/middleware"
	"github.com/gorilla/mux"
)

func InitRouter() *mux.Router {
	r := mux.NewRouter()

	r.Use(middleware.SessionMiddleware)
	r.HandleFunc("/test", handler.TestRoute)
	r.HandleFunc("/ws", handler.HandleWebSocket)
	return r
}
