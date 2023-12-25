package main

import (
	"car-api/internal/server"
	"fmt"
	"os"
	"strconv"

	_ "github.com/joho/godotenv/autoload"
)

func main() {

	server := server.New()

	server.RegisterFiberMiddlewares()
	server.RegisterFiberRoutes()

	port, _ := strconv.Atoi(os.Getenv("PORT"))
	err := server.Listen(fmt.Sprintf("0.0.0.0:%d", port))
	if err != nil {
		panic("cannot start server")
	}
}
