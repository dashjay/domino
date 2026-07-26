package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"domino/lab/server/internal/api"
)

func main() {
	host := flag.String("host", "127.0.0.1", "listen host")
	port := flag.Int("port", 8088, "listen port")
	bots := flag.String("bots", "", "path to bots.yaml (default: ./bots.yaml next to binary cwd)")
	flag.Parse()

	botsPath := *bots
	if botsPath == "" {
		candidates := []string{
			"bots.yaml",
			filepath.Join("lab", "server", "bots.yaml"),
		}
		if exe, err := os.Executable(); err == nil {
			candidates = append([]string{filepath.Join(filepath.Dir(exe), "bots.yaml")}, candidates...)
		}
		for _, c := range candidates {
			if _, err := os.Stat(c); err == nil {
				botsPath = c
				break
			}
		}
		if botsPath == "" {
			log.Fatal("bots.yaml not found; pass -bots")
		}
	}

	srv := api.NewServer(botsPath)
	if err := srv.LoadBots(); err != nil {
		log.Fatalf("load bots: %v", err)
	}
	app := srv.App()
	addr := fmt.Sprintf("%s:%d", *host, *port)
	log.Printf("labd listening on http://%s  (bots=%s)", addr, botsPath)
	if err := app.Listen(addr); err != nil {
		log.Fatal(err)
	}
}
