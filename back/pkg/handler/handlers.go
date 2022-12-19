package handler

import (
	"fmt"
	"net/http"
)

func TestRoute(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Server reached!")
}
