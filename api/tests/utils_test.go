package tests

import (
	"car-api/internal/utils"
	"testing"
)

func TestCoalesce(t *testing.T) {
	result := utils.Coalesce(nil, "asd", nil)
	if result != "asd" {
		t.Error("expected result to be 'asd'")
	}

	result = utils.Coalesce(123, nil, nil, nil, 'a')
	if result != 123 {
		t.Error("expected result to be 123")
	}

	result = utils.Coalesce(nil, nil, nil)
	if result != nil {
		t.Error("expected result to be nil")
	}

	result = utils.Coalesce(nil, func() { /* stub func */ })
	if result == nil {
		t.Error("expect error not to be nil")
	}

	result = utils.Coalesce(nil, testing.T{})
	if result == nil {
		t.Error("expect error not to be nil")
	}
}
