package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/joho/godotenv/autoload"
	_ "github.com/libsql/libsql-client-go/libsql"
)

const (
	QUERY_TIMEOUT = 5 * time.Second
)

type Service interface {
	Health() map[string]string
	RandomVehicle(count int) ([]Vehicle, error)
	SearchVehicle(search string, limit int) ([]Vehicle, error)
}

type service struct {
	db *sqlx.DB
}

var (
	dburl = os.Getenv("DB_URL") + "?authToken=" + os.Getenv("DB_TOKEN")
)

func New() Service {
	db, err := sqlx.Open("libsql", dburl)
	if err != nil {
		// This will not be a connection error, but a DSN parse error or
		// another initialization error.
		log.Fatal(err)
	}
	s := &service{db: db}
	return s
}

func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	err := s.db.PingContext(ctx)
	if err != nil {
		return map[string]string{
			"message": fmt.Sprintf("db down: %v", err),
		}
	}

	return map[string]string{
		"message": "db is healthy",
	}
}

func (s *service) RandomVehicle(count int) ([]Vehicle, error) {
	ctx, cancel := context.WithTimeout(context.Background(), QUERY_TIMEOUT)
	defer cancel()

	stmt, err := s.db.Preparex("select * from vehicles order by random() limit ?")
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	rows, err := stmt.QueryxContext(ctx, count)
	if err != nil {
		return nil, err
	}

	vehicles := []Vehicle{}
	for rows.Next() {
		v := map[string]interface{}{}
		err = rows.MapScan(v)
		if err != nil {
			continue
		}

		vehicle := newVehicle(v)
		vehicles = append(vehicles, vehicle)
	}

	return vehicles, nil
}

func (s *service) SearchVehicle(search string, limit int) ([]Vehicle, error) {
	ctx, cancel := context.WithTimeout(context.Background(), QUERY_TIMEOUT)
	defer cancel()

	stmt, err := s.db.Preparex(`
		select 
				* 
		from 
				vehicles 
		where 
				lower(make) like '%' || lower(?) || '%' or
				lower(model) like '%' || lower(?) || '%' or
				lower(region) like '%' || lower(?) || '%' or
				lower(description) like '%' || lower(?) || '%'
		limit
				?
	`)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	rows, err := stmt.QueryxContext(ctx, search, search, search, search, limit)
	if err != nil {
		return nil, err
	}

	vehicles := []Vehicle{}
	for rows.Next() {
		v := map[string]interface{}{}
		err = rows.MapScan(v)
		if err != nil {
			continue
		}

		vehicle := newVehicle(v)
		vehicles = append(vehicles, vehicle)
	}

	return vehicles, nil
}
