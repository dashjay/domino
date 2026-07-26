package bot

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type Client struct {
	ID      string
	Name    string
	BaseURL string
	Timeout time.Duration
	HTTP    *http.Client
}

func NewClient(id, name, baseURL string, timeout time.Duration) *Client {
	if timeout <= 0 {
		timeout = 3 * time.Second
	}
	return &Client{
		ID:      id,
		Name:    name,
		BaseURL: strings.TrimRight(baseURL, "/"),
		Timeout: timeout,
		HTTP:    &http.Client{Timeout: timeout},
	}
}

func (c *Client) Health(ctx context.Context) (*HealthResponse, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.BaseURL+"/health", nil)
	if err != nil {
		return nil, err
	}
	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("health %d: %s", resp.StatusCode, body)
	}
	var h HealthResponse
	if err := json.Unmarshal(body, &h); err != nil {
		return nil, err
	}
	return &h, nil
}

func (c *Client) Act(ctx context.Context, payload ActRequest) (*ActResponse, error) {
	raw, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.BaseURL+"/act", bytes.NewReader(raw))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("act %d: %s", resp.StatusCode, body)
	}
	var out ActResponse
	if err := json.Unmarshal(body, &out); err != nil {
		return nil, err
	}
	if out.Side == "" {
		return nil, fmt.Errorf("act response missing side")
	}
	return &out, nil
}
