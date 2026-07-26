package bot

// ActRequest is the unified Bot API request payload.
type ActRequest struct {
	GameID             string       `json:"game_id"`
	Seat               int          `json:"seat"`
	Hand               [][2]int     `json:"hand"`
	Board              [][2]int     `json:"board"`
	Left               *int         `json:"left"`
	Right              *int         `json:"right"`
	HandSizes          []int        `json:"hand_sizes"`
	Missing            [][]int      `json:"missing"`
	ConsecutivePasses  int          `json:"consecutive_passes"`
	Legal              []LegalMove  `json:"legal"`
	History            []HistMove   `json:"history"`
}

type LegalMove struct {
	Tile *[2]int `json:"tile"`
	Side string  `json:"side"` // left | right | pass
}

type HistMove struct {
	Seat int     `json:"seat"`
	Tile *[2]int `json:"tile"`
	Side string  `json:"side"`
}

type ActResponse struct {
	Tile *[2]int `json:"tile"`
	Side string  `json:"side"`
}

type HealthResponse struct {
	OK   bool   `json:"ok"`
	Name string `json:"name"`
}
