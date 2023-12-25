package database

import (
	"car-api/internal/utils"
	"encoding/json"
)

type YearRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

type Vehicle struct {
	Id          int64       `json:"id"`
	Make        string      `json:"make"`
	Model       string      `json:"model"`
	Years       []YearRange `json:"years"`
	BodyStyle   string      `json:"bodyStyle"`
	Region      string      `json:"region"`
	Description string      `json:"description"`
	Image       string      `json:"image"`
}

func newVehicle(value map[string]interface{}) Vehicle {
	yearRanges := make([]YearRange, 0)

	// don't really care about this error. if it doesn't work we'll just leave the range empty
	json.Unmarshal([]byte(value["years"].(string)), &yearRanges)

	vehicle := Vehicle{
		Id:          value["id"].(int64),
		Make:        value["make"].(string),
		Model:       value["model"].(string),
		Years:       yearRanges,
		BodyStyle:   value["body_style"].(string),
		Region:      value["region"].(string),
		Description: value["description"].(string),
		Image:       utils.Coalesce(value["image"], "").(string),
	}

	return vehicle
}
