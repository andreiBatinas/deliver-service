package http

import (
	"github.com/labstack/echo"
)

// NewHTTPServer create new HTTP Router
func NewHTTPServer() *echo.Echo {
	e := echo.New()
	e.Debug = true

	return e
}
