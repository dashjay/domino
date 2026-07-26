package bot

import "domino/lab/server/internal/engine"

// BuildActRequest builds a firewall-safe ActRequest for seat.
func BuildActRequest(gameID string, e *engine.Engine, seat int) ActRequest {
	hand := make([][2]int, 0, 7)
	engine.IterTiles(e.Hands[seat], func(tid int) {
		hand = append(hand, e.Pips[tid])
	})
	board := append([][2]int(nil), e.Board...)
	var left, right *int
	if e.LeftEnd >= 0 {
		l, r := e.LeftEnd, e.RightEnd
		left, right = &l, &r
	}
	missing := make([][]int, e.Config.NumPlayers)
	for i, m := range e.MissingPips {
		ps := []int{}
		for pip := 0; pip <= e.Config.MaxPip; pip++ {
			if (m>>pip)&1 != 0 {
				ps = append(ps, pip)
			}
		}
		missing[i] = ps
	}
	legal := make([]LegalMove, 0)
	for _, a := range e.LegalActionsList() {
		tile, side := e.DecodeAction(a)
		legal = append(legal, LegalMove{Tile: tile, Side: sideLabel(side)})
	}
	hist := make([]HistMove, 0, len(e.History))
	for _, h := range e.History {
		tile, side := e.DecodeAction(h.Action)
		hist = append(hist, HistMove{Seat: h.Seat, Tile: tile, Side: sideLabel(side)})
	}
	return ActRequest{
		GameID:            gameID,
		Seat:              seat,
		Hand:              hand,
		Board:             board,
		Left:              left,
		Right:             right,
		HandSizes:         e.HandSizes(),
		Missing:           missing,
		ConsecutivePasses: e.ConsecutivePasses,
		Legal:             legal,
		History:           hist,
	}
}

func sideLabel(side int) string {
	switch side {
	case 0:
		return "left"
	case 1:
		return "right"
	default:
		return "pass"
	}
}
