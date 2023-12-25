package server

import (
	"car-api/internal/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

type Server struct {
	*fiber.App
	Db database.Service
}

func New() *Server {
	server := &Server{
		App: fiber.New(),
		Db:  database.New(),
	}

	return server
}

func (s *Server) RegisterFiberMiddlewares() {
	s.Use(logger.New())
	s.Use(recover.New())
	s.Use(requestid.New())
	s.Use(cors.New())
}
