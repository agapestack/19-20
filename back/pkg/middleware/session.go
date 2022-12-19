package middleware

import (
	"fmt"
	"log"
	"net/http"

	"github.com/agapestack/19-20/back/pkg/config"
)

func SessionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.RequestURI)
		session, _ := config.SessionStore.Get(r, "session")

		fmt.Println(session)

		err := session.Save(r, w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		next.ServeHTTP(w, r)
	})
}
