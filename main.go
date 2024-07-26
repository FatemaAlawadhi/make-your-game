package main

import (
	"fmt"
	"log"
	"net/http"
	Pacman "score-handling/Backend"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Response struct {
	Message string
	Data    []interface{}
}

func ConnectionHandler(conn *websocket.Conn) {
	defer conn.Close()

	// Send default data to the client immediately
	data, err := Pacman.GetData("Data.json")
	if err != nil {
		log.Println(err)
		return
	}

	response := Response{
		Message: "",
		Data:    data,
	}

	err = conn.WriteJSON(response)
	if err != nil {
		log.Println(err)
		return
	}

	for {
		//To Read Data Sent by Player and Save it
		var player Pacman.Player
		err := conn.ReadJSON(&player)
		if err != nil {
			log.Println(err)
			return
		}

		data, message := Pacman.WriteData(player)
		response := Response{
			Message: message,
			Data:    data,
		}

		//Send new data
		err = conn.WriteJSON(response)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func wsConn(w http.ResponseWriter, r *http.Request) {
	//Return true to allow connection from any origin
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	//Upgrade the HTTP connection to  a WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("Client successfully connected")

	ConnectionHandler(ws)
}

func main() {
	var Files = []string{"Js", "Sound", "Style"}
	for _, File := range Files {
		fs := http.FileServer(http.Dir(File))
		http.Handle("/"+File+"/", http.StripPrefix("/"+File+"/", fs))
	}

	http.HandleFunc("/", launchGame)
	http.HandleFunc("/get", wsConn)
	fmt.Printf("Starting server at port 8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

func launchGame(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}
