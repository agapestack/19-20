package logger

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
)

var debugLogger *log.Logger

func InitDebug() {
	absPath, err := filepath.Abs("./log")
	if err != nil {
		fmt.Println("Error reading given path:", err)
	}
	debugLog, err := os.OpenFile(absPath+"/log.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println("Error opening file:", err)
		os.Exit(1)
	}
	debugLogger = log.New(debugLog, "Debug Logger:\t", log.Ldate|log.Ltime|log.Lshortfile)
}

func Debug(msg string) {
	if debugLogger != nil {
		fmt.Println(msg)
		debugLogger.Println(msg)
	}
}
