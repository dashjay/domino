package engine

import "math/bits"

// Tile encoding matches Python domino.tiles:
// tile_id(a,b) with a<=b = b*(b+1)/2 + a

const MaxPipDefault = 6

func NumTiles(maxPip int) int {
	return (maxPip + 1) * (maxPip + 2) / 2
}

func TileID(a, b int) int {
	if a > b {
		a, b = b, a
	}
	return b*(b+1)/2 + a
}

func BuildPipsTable(maxPip int) [][2]int {
	table := make([][2]int, 0, NumTiles(maxPip))
	for b := 0; b <= maxPip; b++ {
		for a := 0; a <= b; a++ {
			table = append(table, [2]int{a, b})
		}
	}
	return table
}

func Popcount(mask uint64) int {
	n := 0
	for mask != 0 {
		n++
		mask &= mask - 1
	}
	return n
}

func IterTiles(mask uint64, fn func(tid int)) {
	for mask != 0 {
		low := mask & -mask
		fn(bits.TrailingZeros64(low))
		mask ^= low
	}
}

func PipSum(mask uint64, pips [][2]int) int {
	total := 0
	IterTiles(mask, func(tid int) {
		total += pips[tid][0] + pips[tid][1]
	})
	return total
}

func IsDouble(tid int, pips [][2]int) bool {
	return pips[tid][0] == pips[tid][1]
}
