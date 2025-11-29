package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type Session struct {
	Code    string
	Clients map[*websocket.Conn]bool
	Mu      sync.Mutex
}

var sessions = make(map[string]*Session)
var sessionsMu sync.Mutex

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func ws_handler(w http.ResponseWriter, r *http.Request) {
	// upgrade current connection to websocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error while upgrading", err)
		return
	}
	var session *Session

	// automatically closes the connection when using return
	defer conn.Close()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error while reading messages from client", err)
			break
		}

		var data map[string]string
		json.Unmarshal(message, &data)

		switch data["action"] {

		case "create":
			session = createNewSession(data["code"], conn)
			fmt.Println("Session Created")

		case "join":
			session, syncSource := joinSession(data["code"], conn)
			if session != nil {
				fmt.Println("Session Joined")
				joinMsg := map[string]string{
					"action": "user_joined",
					"userId": data["userId"],
					"code":   data["code"],
				}
				jsonMsg, _ := json.Marshal(joinMsg)
				broadcast(jsonMsg, data["code"])

				if syncSource != nil {
					reqSyncMsg := map[string]string{
						"action":   "request_sync",
						"targetId": data["userId"],
					}
					jsonReq, _ := json.Marshal(reqSyncMsg)
					syncSource.WriteMessage(websocket.TextMessage, jsonReq)
				}
			} else {
				fmt.Println("Session not found")
			}

		case "ping":
			// Keep-alive, do nothing

		default:
			broadcast(message, data["code"])

		}

	}
	if session != nil {
		session.Mu.Lock()
		delete(session.Clients, conn)
		session.Mu.Unlock()
	}
}

func broadcast(message []byte, code string) {
	sessionsMu.Lock()
	session, exists := sessions[code]
	sessionsMu.Unlock()

	if !exists || session == nil {
		fmt.Println("No session found for code:", code)
		return
	}

	session.Mu.Lock()
	var clients []*websocket.Conn
	for client := range session.Clients {
		clients = append(clients, client)
	}
	session.Mu.Unlock()

	for _, client := range clients {
		err := client.WriteMessage(websocket.TextMessage, message)

		if err != nil {
			fmt.Println("Error while sending message to clients", err)
			client.Close()
			session.Mu.Lock()
			delete(session.Clients, client)
			session.Mu.Unlock()
		}
	}
}

func createNewSession(code string, conn *websocket.Conn) *Session {

	s := &Session{
		Code:    code,
		Clients: make(map[*websocket.Conn]bool),
	}

	sessionsMu.Lock()
	sessions[code] = s
	s.Clients[conn] = true
	sessionsMu.Unlock()

	return s

}

func joinSession(code string, conn *websocket.Conn) (*Session, *websocket.Conn) {

	sessionsMu.Lock()
	s, exists := sessions[code]
	sessionsMu.Unlock()

	if !exists {
		return nil, nil
	}

	s.Mu.Lock()
	var syncSource *websocket.Conn
	for client := range s.Clients {
		if client != conn {
			syncSource = client
			break
		}
	}
	s.Clients[conn] = true
	s.Mu.Unlock()

	return s, syncSource
}

func main() {
	http.HandleFunc("/", ws_handler)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Print("error while trying to start the Server", err)
	}
}
