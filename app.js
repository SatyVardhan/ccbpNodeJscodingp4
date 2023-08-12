const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const app = express();
const dbpath = path.join(__dirname, "cricketTeam.db");
let cDB = null;
const initializeServerAndServer = async () => {
  try {
    cDB = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeServerAndServer();

// AP1 should return list of players
app.get("/players/", async (request, response) => {
  const convertSnakecaseToCamelcase = (playerObject) => {
    return {
      playerId: playerObject.player_Id,
      playerName: playerObject.player_name,
      jerseyNumber: playerObject.jerser_number,
      role: playerObject.role,
    };
  };
  const getAllPlayersListQuery = `SELECT * FROM cricket_team`;
  const playerList = await cDB.all(getAllPlayersListQuery);
  response.send(
    playerList.map((eachPlayer) => {
      convertSnakecaseToCamelcase(eachPlayer);
    })
  );
});
