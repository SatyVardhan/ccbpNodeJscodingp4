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
    VALUES (${playerName},${jerseyNumber},${role});
    `;
  const cDBResponse = await cDB.run(createNewPlayerQuery);
  response.send("Player Added to Team");
});

module.exports = app;
