const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
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
  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    };
  };

  const getAllPlayersListQuery = `SELECT
   *
    FROM
     cricket_team;`;
  const playerList = await cDB.all(getAllPlayersListQuery);
  let camcasPlayerList = playerList.map((eachPlayer) =>
    convertDbObjectToResponseObject(eachPlayer)
  );
  response.send(camcasPlayerList);
});

// second API create a new player in team to create
//  we have to read request body by using middle ware express.json
// http method get and sql method run
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const createNewPlayerQuery = `INSERT
    INTO
    cricket_team (player_name,jersey_number,role)
    VALUES ('${playerName}',${jerseyNumber},'${role}');
    `;
  const cDBResponse = await cDB.run(createNewPlayerQuery);
  response.send("Player Added to Team");
});

// API 3 returns a player based on a player ID

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetails = `SELECT * FROM cricket_team
     WHERE player_id = ${playerId};`;
  const playerArray = await cDB.all(getPlayerDetails);
  response.send(playerArray);
});

// API 4 update player details in the team based on player ID

app.put("/players/:playerId/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = playerDetails;

  const updateQuery = `UPDATE cricket_team 
    SET player_name = '${playerName}',
        jersey_number = ${jerseyNumber},
        role = '${role}'
        WHERE player_id = ${playerId};`; //updated sql query
  await cDB.run(updateQuery);
  response.send("Player Details Updated");
});

// API 5 Delete a player from team based on player ID

app.delete("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const deleteQuery = `DELETE FROM cricket_team 
    WHERE player_id = ${playerId};`;
    await cDB.run(deleteQuery);
    response.send("Player Removed");
  } catch (e) {
    console.log(`DATABASE ERROR:${e.message}`);
  }
});

module.exports = app;
