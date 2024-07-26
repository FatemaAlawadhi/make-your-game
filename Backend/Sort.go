package Pacman

import (
	"fmt"
	"log"
	"sort"
	"strconv"
)

func CheckScore(data []interface{}, currentPlayer Player) []interface{} {
	for _, element := range data {
		if player, ok := element.(map[string]interface{}); ok {
			if playerName, ok := player["name"].(string); ok {
				if playerName == currentPlayer.Name {
					if score, ok := player["score"].(float64); ok {
						//Update score if username exist
						if currentPlayer.Score > int(score) {
							player["score"] = float64(currentPlayer.Score)
							player["time"] = float64(currentPlayer.Time)
						}
						return data
					}
				}
			}
		}
	}

	//Add new user score
	player := map[string]interface{}{
		"name":  currentPlayer.Name,
		"time":  float64(currentPlayer.Time),
		"score": float64(currentPlayer.Score),
	}

	data = append(data, player)
	return data
}

func FindRank(data []interface{}, username string) ([]interface{}, string) {
	players := make([]Player, len(data))

	// Extract player information from data
	for i, element := range data {
		if playerMap, ok := element.(map[string]interface{}); ok {
			player := Player{
				Name:  playerMap["name"].(string),
				Time:  int(playerMap["time"].(float64)),
				Score: int(playerMap["score"].(float64)),
			}
			players[i] = player
		}
	}

	// Sort players by score in descending order
	sort.SliceStable(players, func(i, j int) bool {
		return players[i].Score > players[j].Score
	})

	// Assign ranks
	for i, _ := range players {
		switch i {
		case 0:
			players[i].Rank = "1st"
		case 1:
			players[i].Rank = "2nd"
		case 2:
			players[i].Rank = "3rd"
		default:
			players[i].Rank = fmt.Sprintf("%dth", i+1)
		}
	}

	var message string
	for _, player := range players {
		if player.Name == username {
			rankString := player.Rank
			rankInt, err := strconv.Atoi(rankString[:len(player.Rank)-2])
			if err != nil {
				log.Fatal("Error converting rank to integer:", err)
			}
			position := (rankInt*100 / len(players))
			if position < 50 {
				message = fmt.Sprintf("Congrats %s, you are in the top %d%%, on the %s position.", username, position, player.Rank)
			}else{
				message = fmt.Sprintf("Try harder %s, you are in the top %d%%, on the %s position.", username, position, player.Rank)
			}
			break
		}
	}

	// Create a new slice to hold the ranked data
	rankedData := make([]interface{}, len(players))

	// Convert each player to a map and add it to the ranked data slice
	for i, player := range players {
		rankedData[i] = map[string]interface{}{
			"rank":  player.Rank,
			"name":  player.Name,
			"time":  player.Time,
			"score": player.Score,
		}
	}

	return rankedData, message
}
