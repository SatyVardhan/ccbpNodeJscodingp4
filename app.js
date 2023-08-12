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
  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    };
  };
  //   const getPlayersQuery = `
  //     SELECT
  //     *
  //     FROM
  //     cricket_team;`;
  //   const playersArray = await cDB.all(getPlayersQuery);
  //   response.send(
  //     playersArray.map((eachPlayer) =>
  //       convertDbObjectToResponseObject(eachPlayer)
  //     )
  //   );
  // });
  // /////////

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
module.exports = app;
