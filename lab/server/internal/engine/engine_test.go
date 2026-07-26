package engine

import (
	"testing"
)

func TestTileIDRoundTrip(t *testing.T) {
	pips := BuildPipsTable(6)
	if len(pips) != 28 {
		t.Fatalf("deck size %d", len(pips))
	}
	for tid, ab := range pips {
		if TileID(ab[0], ab[1]) != tid {
			t.Fatalf("tid %d -> %v -> %d", tid, ab, TileID(ab[0], ab[1]))
		}
	}
}

func TestForcedHighestDouble(t *testing.T) {
	e := New(DefaultConfig())
	// Give seat 2 the [6|6] (= tid 27)
	hands := make([]uint64, 4)
	hands[0] = 1 << TileID(0, 0)
	hands[1] = 1 << TileID(1, 1)
	hands[2] = 1 << TileID(6, 6)
	hands[3] = 1 << TileID(2, 2)
	// fill remaining to 7 each with distinct tiles
	pool := []int{}
	for tid := 0; tid < 28; tid++ {
		if tid == TileID(0, 0) || tid == TileID(1, 1) || tid == TileID(6, 6) || tid == TileID(2, 2) {
			continue
		}
		pool = append(pool, tid)
	}
	idx := 0
	for p := 0; p < 4; p++ {
		for Popcount(hands[p]) < 7 {
			hands[p] |= 1 << pool[idx]
			idx++
		}
	}
	e.ResetWithHands(hands)
	if e.CurrentPlayer != 2 {
		t.Fatalf("leader want 2 got %d", e.CurrentPlayer)
	}
	if e.ForcedAction != TileID(6, 6)*2 {
		t.Fatalf("forced want %d got %d", TileID(6, 6)*2, e.ForcedAction)
	}
	legal := e.LegalActionsList()
	if len(legal) != 1 || legal[0] != e.ForcedAction {
		t.Fatalf("legal=%v", legal)
	}
}

func TestPlayAndPassBlocked(t *testing.T) {
	e := New(DefaultConfig())
	e.Reset(42)
	steps := 0
	for !e.IsOver && steps < 200 {
		a := e.LegalActionsList()[0]
		if err := e.Step(a); err != nil {
			t.Fatal(err)
		}
		steps++
	}
	if !e.IsOver {
		t.Fatal("game should end")
	}
	scores, err := e.Scores()
	if err != nil {
		t.Fatal(err)
	}
	if len(scores) != 4 {
		t.Fatalf("scores %v", scores)
	}
}

func TestEncodeDecodePass(t *testing.T) {
	e := New(DefaultConfig())
	// Construct a position where only pass is legal for seat 0
	e.ResetWithHands([]uint64{
		1 << TileID(0, 0), // only [0|0]
		1<<TileID(1, 1) | 1<<TileID(2, 2) | 1<<TileID(3, 3) | 1<<TileID(4, 4) | 1<<TileID(5, 5) | 1<<TileID(6, 6) | 1<<TileID(0, 1),
		1<<TileID(0, 2) | 1<<TileID(0, 3) | 1<<TileID(0, 4) | 1<<TileID(0, 5) | 1<<TileID(0, 6) | 1<<TileID(1, 2) | 1<<TileID(1, 3),
		1<<TileID(1, 4) | 1<<TileID(1, 5) | 1<<TileID(1, 6) | 1<<TileID(2, 3) | 1<<TileID(2, 4) | 1<<TileID(2, 5) | 1<<TileID(2, 6),
	})
	// Force open with [6|6] on seat 1 — actually seat with 6|6 is 1
	if e.CurrentPlayer != 1 {
		t.Fatalf("current %d", e.CurrentPlayer)
	}
	_ = e.Step(e.ForcedAction) // play 6|6
	// Keep playing until seat 0 must pass — simpler: set ends manually after one play
	// After 6|6, ends are 6|6. Seat 2 has no 6 — may pass.
	for !e.IsOver {
		legal := e.LegalActionsList()
		if e.CurrentPlayer == 0 && len(legal) == 1 && legal[0] == e.Config.PassAction() {
			act, err := e.EncodePlay(nil, "pass")
			if err != nil || act != e.Config.PassAction() {
				t.Fatalf("encode pass %v %d", err, act)
			}
			tile, side := e.DecodeAction(act)
			if tile != nil || side != -1 {
				t.Fatalf("decode pass")
			}
			return
		}
		if err := e.Step(legal[0]); err != nil {
			t.Fatal(err)
		}
	}
}

func TestSameEndsNormalizeSide(t *testing.T) {
	e := New(DefaultConfig())
	hands := []uint64{
		1<<TileID(3, 3) | 1<<TileID(0, 1) | 1<<TileID(0, 2) | 1<<TileID(0, 4) | 1<<TileID(0, 5) | 1<<TileID(1, 2) | 1<<TileID(1, 4),
		1 << TileID(6, 6), // will be forced first — need 7 tiles
		0, 0,
	}
	// pad
	pool := []int{}
	used := map[int]bool{TileID(3, 3): true, TileID(0, 1): true, TileID(0, 2): true, TileID(0, 4): true, TileID(0, 5): true, TileID(1, 2): true, TileID(1, 4): true, TileID(6, 6): true}
	for tid := 0; tid < 28; tid++ {
		if !used[tid] {
			pool = append(pool, tid)
		}
	}
	idx := 0
	hands[1] = 1 << TileID(6, 6)
	for p := 0; p < 4; p++ {
		for Popcount(hands[p]) < 7 {
			hands[p] |= 1 << pool[idx]
			idx++
		}
	}
	e.ResetWithHands(hands)
	_ = e.Step(e.ForcedAction) // board [6|6], same ends
	// Find a tile that fits; both sides equivalent → only side=0 legal
	for _, a := range e.LegalActionsList() {
		if a == e.Config.PassAction() {
			continue
		}
		tid, side := a/2, a%2
		if e.Pips[tid][0] == 6 || e.Pips[tid][1] == 6 {
			if side != 0 {
				t.Fatalf("same ends should normalize to side=0, got action %d", a)
			}
		}
	}
}
