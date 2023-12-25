package server

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

func (s *Server) RegisterFiberRoutes() {
	s.App.Get("/health", s.HealthHandler)
	s.App.Get("/api/random/", s.RandomVehicleHandler)
	s.App.Get("/api/search", s.SearchVehicleHandler)
}

func (s *Server) RandomVehicleHandler(c *fiber.Ctx) error {
	count := c.QueryInt("count", 1)

	vehicles, err := s.Db.RandomVehicle(count)

	if err != nil {
		log.Error(err.Error())
		return c.SendStatus(http.StatusInternalServerError)
	}

	return c.JSON(vehicles)
}

func (s *Server) SearchVehicleHandler(c *fiber.Ctx) error {
	search := c.Query("search", "")
	if search == "" {
		return c.Status(http.StatusBadRequest).SendString("Missing required query param 'search'")
	}
	limit := c.QueryInt("limit", -1)

	vehicles, err := s.Db.SearchVehicle(search, limit)
	if err != nil {
		log.Error(err.Error())
		return c.SendStatus(http.StatusInternalServerError)
	}

	return c.JSON(vehicles)
}

func (s *Server) HealthHandler(c *fiber.Ctx) error {
	return c.JSON(s.Db.Health())
}
