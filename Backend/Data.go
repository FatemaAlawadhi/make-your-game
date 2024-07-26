package Pacman

import (
	"encoding/json"
	//"fmt"
	"log"
	"os"
)

type Player struct {
	Rank  string `json:"rank"`
	Name  string `json:"name"`
	Time  int    `json:"time"`
	Score int    `json:"score"`
}

var Data = "Data.json"

func WriteData(player Player) ([]interface{}, string) {
	data, err := GetData(Data)
	if err != nil {
		log.Fatal("Error getting data from JSON:", err)
	}

	data = CheckScore(data, player)
	data, message := FindRank(data, player.Name)

	file, err := os.OpenFile(Data, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		log.Fatal("Error opening file:", err)
	}
	defer file.Close()

	playerData, err := json.Marshal(data)
	if err != nil {
		log.Fatal("Error marshaling data:", err)
	}

	_, err = file.Write(playerData)
	if err != nil {
		log.Fatal("Error writing JSON:", err)
	}
	
	return data, message
}

func GetData(filePath string) ([]interface{}, error) {
	file, err := os.Open(filePath)
	if err != nil {
		if os.IsNotExist(err) {
			return []interface{}{}, nil
		}
		return nil, err
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return nil, err
	}
	fileSize := fileInfo.Size()
	buffer := make([]byte, fileSize)
	_, err = file.Read(buffer)
	if err != nil {
		return nil, err
	}

	var data []interface{}
	err = json.Unmarshal(buffer, &data)
	if err != nil && len(data) != 0 {
		return nil, err
	}
	return data, nil
}
