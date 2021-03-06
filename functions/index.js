const functions = require("firebase-functions");

const admin = require("firebase-admin");
const { match } = require("assert");
admin.initializeApp();
const db = admin.firestore();


// update players' scores & matchesPlayed on every match write
exports.playerUpdatesOnMatchWrites = functions.firestore
    .document("matches/{matchId}")
    .onWrite((change, context) => {
      const {before, after} = change;
      const matchId = context.params.matchId;
      functions.logger.log("playerUpdatesOnMatchWrites RUNNING...");

      // handle a new match...
      if (!before.exists) {
        functions.logger.log("handling a new match...");
        const newMatchPlayers = Object.entries(after.data().participants);

        // this excludes players with n/a results from being counted for scoring purposes
        const totalNumberOfPlayers = newMatchPlayers.filter(entry => {
          return entry[1].result === 'win' || entry[1].result === 'loss'
        }).length

        for (const player of newMatchPlayers) {

          // update the matchesPlayed's
          db.collection("players").doc(`${player[0]}`).update({
            matchesPlayed: admin.firestore.FieldValue.arrayUnion(matchId),
          });

          // update the scoreMap's
          let newScore;
          if (player[1].result === 'n/a') { ``
            continue
          }
          if (player[1].result === 'loss') {
            newScore = -1 * ( 1 / totalNumberOfPlayers )
          } else if (player[1].result === 'win') {
            newScore = 1 + ( -1 * ( 1 / totalNumberOfPlayers ) )
          }
          db.collection("players")
          .doc(`${player[0]}`)
          .get()
          .then((queryDocSnap) => {
            return queryDocSnap.get("scoreMap");
          }).then((scoreMap) => {
            let newScoreMap = {...scoreMap, [`${matchId}`]: newScore}
            db.collection("players").doc(`${player[0]}`)
            .update({
              scoreMap: newScoreMap,
              score: (100 * (Object.values(newScoreMap).reduce((tot,cur) => tot + cur) / Object.values(newScoreMap).length)).toFixed(1)
            });
            })
        }
      }

      // handle a deleted match...
      if (!after.exists) {
        functions.logger.log("handling a deleted match...");
        const oldMatchPlayers = Object.entries(before.data().participants);
        for (const player of oldMatchPlayers) {
          db.collection("players")
          .doc(`${player[0]}`)
          .get()
          .then((queryDocSnap) => {
            return queryDocSnap.get("scoreMap");
          }).then((scoreMap) => {
            let newScoreMap = {...scoreMap}
            delete newScoreMap[`${matchId}`]
            db.collection("players").doc(`${player[0]}`)
            .update({
              matchesPlayed: admin.firestore.FieldValue.arrayRemove(matchId),
              scoreMap: newScoreMap,
              score: Object.values(newScoreMap).length > 0 ? (100 * (Object.values(newScoreMap).reduce((tot,cur) => tot + cur) / Object.values(newScoreMap).length)).toFixed(1) : "0.0"
            });
          })
        }
      }

      // handle an updated match...
      if (before.exists && after.exists) {
        functions.logger.log("handling THEE updated match...");
        const oldParticipants = before.data().participants;
        const newParticipants = after.data().participants;

        // first, remove all the scores from players who have been deleted
        for (const playerId of Object.keys(oldParticipants)) {
          if (!(playerId in newParticipants)) {
            db.collection("players")
            .doc(`${playerId}`)
            .get()
            .then((queryDocSnap) => {
              return queryDocSnap.get("scoreMap");
            }).then((scoreMap) => {
              let newScoreMap = {...scoreMap}
              delete newScoreMap[`${matchId}`]
              db.collection("players").doc(`${playerId}`)
              .update({
                matchesPlayed: admin.firestore.FieldValue.arrayRemove(matchId),
                scoreMap: newScoreMap,
                score: Object.values(newScoreMap).length > 0 ? (100 * (Object.values(newScoreMap).reduce((tot,cur) => tot + cur) / Object.values(newScoreMap).length)).toFixed(1) : "0.0"
              });
            })
          }
        }

        // next, iterate all current players, and give them updated score
        for (const playerId of Object.keys(newParticipants)) {
          db.collection("players")
          .doc(`${playerId}`)
          .get()
          .then((queryDocSnap) => {
             return queryDocSnap.get("scoreMap");
          }).then((scoreMap) => {

            // this excludes players with n/a results from being counted for scoring purposes
            const totalNumberOfPlayers = Object.entries(newParticipants).filter(entry => {
              return entry[1].result === 'win' || entry[1].result === 'loss'
            }).length

            let newScore;
            if (newParticipants[playerId].result === 'loss') {             
              newScore = -1 * ( 1 / totalNumberOfPlayers )
            } else if (newParticipants[playerId].result === 'win') {
              newScore = 1 + ( -1 * ( 1 / totalNumberOfPlayers ) )
            }
            let newScoreMap = {...scoreMap};
            if (typeof newScore !== 'undefined' && totalNumberOfPlayers !== 1) {
              newScoreMap[`${matchId}`] = newScore
            } else {
              delete newScoreMap[`${matchId}`]
            }
            db.collection("players").doc(`${playerId}`)
            .update({
              matchesPlayed: admin.firestore.FieldValue.arrayUnion(matchId),
              scoreMap: newScoreMap,
              score: Object.values(newScoreMap).length > 0 ? (100 * (Object.values(newScoreMap).reduce((tot,cur) => tot + cur) / Object.values(newScoreMap).length)).toFixed(1) : "0.0"
            });
          })
        }
      }
    return null
})

exports.gameUpdatesOnMatchWrites = functions.firestore
    .document("matches/{matchId}")
    .onWrite((change, context) => {
      const {before, after} = change;
      const matchId = context.params.matchId;
      functions.logger.log("gameUpdatesOnMatchWrites RUNNING...");

      // handle a new match...
      if (!before.exists) {
        const afterGameId = after.data().gameId;
        functions.logger.log("handling a new match...");
        db.collection("games").doc(`${afterGameId}`).update({
          matchesArray: admin.firestore.FieldValue.arrayUnion(matchId),
        });
      }

      // handle a deleted match...
      if (!after.exists) {
        const beforeGameId = before.data().gameId;
        functions.logger.log("handling a deleted match...");
        db.collection("games").doc(`${beforeGameId}`).update({
          matchesArray: admin.firestore.FieldValue.arrayRemove(matchId),
        });
      }

      // handle an updated match...
      if (before.exists && after.exists) {
        functions.logger.log("handling an updated match...");
        if (before.data().gameId !== after.data().gameId) {
          functions.logger.log("updated match has new gameId...");
          const oldGameId = before.data().gameId;
          const newGameId = after.data().gameId;
          db.collection("games").doc(`${oldGameId}`).update({
            matchesArray: admin.firestore.FieldValue.arrayRemove(matchId),
          });
          db.collection("games").doc(`${newGameId}`).update({
            matchesArray: admin.firestore.FieldValue.arrayUnion(matchId),
          });
        }
      }

      if (after.exists) {
      // update the last played date on every
      // operation except for deletes
        const afterGameId = after.data().gameId;
        const matchDate = after.data().date;
        db.collection("games")
            .doc(`${afterGameId}`)
            .get()
            .then((queryDocSnap) => {
              return queryDocSnap.get("lastPlayedDate");
            }).then((oldDate) => {
              if (!oldDate) {
                db.collection("games").doc(`${afterGameId}`).update({
                  lastPlayedDate: matchDate,
                });
              } else if (+matchDate.slice(6) > +oldDate.slice(6)) {
                db.collection("games").doc(`${afterGameId}`).update({
                  lastPlayedDate: matchDate,
                });
              } else if (+matchDate.slice(6) === +oldDate.slice(6) &&
                  +matchDate.slice(0, 2) > +oldDate.slice(0, 2)) {
                db.collection("games").doc(`${afterGameId}`).update({
                  lastPlayedDate: matchDate,
                });
              } else if (+matchDate.slice(6) === +oldDate.slice(6) &&
                  +matchDate.slice(0, 2) === +oldDate.slice(0, 2) &&
                  +matchDate.slice(3, 5) > +oldDate.slice(3, 5) ) {
                db.collection("games").doc(`${afterGameId}`).update({
                  lastPlayedDate: matchDate,
                });
              }
            }
            );
      } else {
        // update the last played date only for deletes
        const beforeGameId = before.data().gameId;
        const oldDate = before.data().date;
        const matchId = context.params.matchId;
        db.collection("games")
            .doc(`${beforeGameId}`)
            .get()
            .then((queryDocSnap) => {
              return queryDocSnap.get("matchesArray");
            }).then((matchesArray) => {
              if (matchesArray?.length === 0) {
                db.collection("games").doc(`${beforeGameId}`)
                    .update({lastPlayedDate: ""});
              } else {
                let latestDate = oldDate;
                for (const currentMatchId of matchesArray) {
                  if (currentMatchId !== matchId) {
                    db.collection("matches")
                        .doc(currentMatchId)
                        .get()
                        .then((queryDocSnap) => {
                          return queryDocSnap.get("date");
                        }).then((date) => {
                          if (latestDate === oldDate) {
                            latestDate = date;
                          } else if (+date.slice(6) > +latestDate.slice(6)) {
                            latestDate = date;
                          } else if (+date.slice(6) ===
                          +latestDate.slice(6) && +date.slice(0, 2) >
                          +latestDate.slice(0, 2)) {
                            latestDate = date;
                          } else if (+date.slice(6) ===
                          +latestDate.slice(6) && +date.slice(0, 2) ===
                          +latestDate.slice(0, 2) && +date.slice(3, 5) >
                          +latestDate.slice(3, 5) ) {
                            latestDate = date;
                          }
                          db.collection("games").doc(`${beforeGameId}`)
                              .update({lastPlayedDate: latestDate});
                        });
                  }
                }
              }
            }
            );
      }
      // on any operation, reorder the playOrders of every match
      db.collection("matches").get()
          .then((querySnapShot) => {
            const docs = querySnapShot.docs;
            let arrayOfMatches = [];
            for (const doc of docs) {
              arrayOfMatches.push({...doc.data(), id: doc.id});
            }
            arrayOfMatches.sort((a, b) => {
              // SORT BY DATE FIRST, PLAY ORDER 2ND 
              if (+a.date.slice(6) < +b.date.slice(6)) {
                return -1;
              } else if (+a.date.slice(6) === +b.date.slice(6) && 
                +a.date.slice(0, 2) < +b.date.slice(0, 2)) {
                return -1;
              } else if (+a.date.slice(6) ===
              +b.date.slice(6) && +a.date.slice(0, 2) ===
              +b.date.slice(0, 2) && +a.date.slice(3, 5) <
              +b.date.slice(3, 5)) {
                return -1;
              } else if (+a.date.slice(6) ===
              +b.date.slice(6) && +a.date.slice(0, 2) ===
              +b.date.slice(0, 2) && +a.date.slice(3, 5) ===
              +b.date.slice(3, 5) && a.playOrder < b.playOrder) {
                return -1
              } else {
                return 1
              }
            })
            let currentPlayOrder = 0
            arrayOfMatches = arrayOfMatches.map(match =>  {
              currentPlayOrder++
              return {...match, playOrder: currentPlayOrder}
            })
            arrayOfMatches.forEach(({ id, playOrder }) => {
              db.collection("matches").doc(`${id}`)
                .update({playOrder: playOrder});
            })
          });
          
      return null;
    });

exports.matchUpdatesOnPlayerNameChange = functions.firestore
  .document("players/{playerId}")
  .onUpdate((change, context) => {
    const playerId = context.params.playerId;
    const { after } = change;
    const newName = after.data().name;

    db.collection("matches").get().then((querySnapShot) => {
      const docs = querySnapShot.docs;
      for (const doc of docs) {
        if (typeof doc.data().participants[playerId] !== 'undefined') {
          db.collection("matches").doc(doc.id)
            .update({
              participants: {
                ...doc.data().participants,
                [`${playerId}`]: {
                  ...doc.data().participants[playerId],
                  name: newName
                }
              }
            });
        };
      }
    }) 
    return null;
  })

// when deleting a game, this will delete all associated matches
exports.deleteMatchesAfterGameDeletion = functions.firestore
  .document("games/{gameId}")
  .onDelete((snap, context) => {
    const gameId = context.params.gameId;
    functions.logger.log("LOGGER: just deleted game with id = ", gameId);

    db.collection("matches").get().then((querySnapShot) => {
      const docs = querySnapShot.docs;
      for (let doc of docs) {
        if (doc.data().gameId === gameId) {
          functions.logger.log("about to delete match with id = ", doc.id);
          db.collection("matches").doc(doc.id)
            .delete();
        };
      }
    }) 

    return null;
  })

// add the playerRatings object to each game when created by user
exports.giveNewGamesAPlayerRatingsObject = functions.firestore
  .document("games/{gameId}")
  .onCreate((snap, context) => {
    const gameId = context.params.gameId;
    functions.logger.log("LOGGER: adding playerRatings to game with id =", gameId);

    const playerRatings = {}

    db.collection("players").get().then((querySnapShot) => {
      const docs = querySnapShot.docs;
      for (let doc of docs) {
        functions.logger.log("LOGGER: playerRatings now =", playerRatings)
        playerRatings[doc.id] = {
          score: "0.0",
          scoreMap: {},
        }
      }
      db.collection("games").doc(`${gameId}`).update({
        playerRatings,
      });
    })

  return null;
  })

// when deleting a player, remove that player from each game's playerRatings object
exports.removePlayerFromPlayerRatingsInAllGames = functions.firestore
  .document("players/{playerId}")
  .onDelete((snap, context) => {
    const playerId = context.params.playerId;

    db.collection("games").get().then((querySnapShot) => {
      const docs = querySnapShot.docs;
      for (let doc of docs) {
        const newPlayerRatings = {...doc.data().playerRatings}
        delete newPlayerRatings[playerId]
        db.collection("games").doc(doc.id)
          .update({
            playerRatings: newPlayerRatings
          });
      }
    }) 

    return null;
  })

// when adding a new player, add said player to each game's playerRatings object
exports.addNewPlayerToEachGamesPlayerRatings = functions.firestore
  .document("players/{playerId}")
  .onCreate((snap, context) => {
    const playerId = context.params.playerId;
    functions.logger.log("LOGGER: adding new player to each game's playerRatings object");

    db.collection("games").get().then((querySnapShot) => {
      const docs = querySnapShot.docs;
      for (let doc of docs) {
        db.collection("games").doc(doc.id)
          .update({
            playerRatings: {
              ...doc.data().playerRatings,
              [playerId]: {
                score: "0.0",
                scoreMap: {}
              }
            }
          })
      }
    })
  
    return null;
  })

  // on match create, update its game's playerRating > playerId > score & scoreMap for each player
  exports.calculatePlayerScoresOnAGameAfterMatchAddition = functions.firestore
    .document("matches/{matchId}")
    .onCreate((snap, context) => {
      functions.logger.log("MOST RECENT RUNNING...");

      const matchId = context.params.matchId;
      const gameId = snap.data().gameId;

      const toBeAddedScores = {};

      const newMatchPlayers = Object.entries(snap.data().participants);

      // this excludes players with n/a results from being counted for scoring purposes
      const totalNumberOfPlayers = newMatchPlayers.filter(entry => {
        return entry[1].result === 'win' || entry[1].result === 'loss'
      }).length

      for (const player of newMatchPlayers) {
        let newScore = 'skip'

        if (player[1].result === 'loss') {
          newScore = -1 * ( 1 / totalNumberOfPlayers )
        } else if (player[1].result === 'win') {
          newScore = 1 + ( -1 * ( 1 / totalNumberOfPlayers ) )
        }
        
        if (newScore !== 'skip') {
          toBeAddedScores[player[0]] = newScore
        }
      }

      db.collection("games")
      .doc(`${gameId}`)
      .get()
      .then((queryDocSnap) => {
        return queryDocSnap.get("playerRatings");
      })
      .then((playerRatings) => {
        const newPlayerRatings = {...playerRatings}
        for (let playerId of Object.keys(toBeAddedScores)) {
          newPlayerRatings[playerId].scoreMap[matchId] = toBeAddedScores[playerId]
          newPlayerRatings[playerId].score = (100 * (Object.values( newPlayerRatings[playerId].scoreMap).reduce((tot,cur) => tot + cur) / Object.values( newPlayerRatings[playerId].scoreMap).length)).toFixed(1)
        }
        db.collection("games").doc(`${gameId}`)
          .update({
            playerRatings: newPlayerRatings
          })
        })


      // DONE iterate all particpants in the match
      // DONE calculate each of their scores, put all this info in a toBeAddedScores object
      // DONE extract the gameId from the created match
      // DONE get that game & extract playerRatings to a copied variable newPlayerRatings
      // DONE iterate toBeAddedScores object, and insert scores into newPlayerRatings
        // DONE during this same loop, run util helper function to calculate new score & update it
      // DONE set playerRatings to updated version

      return null;
    })
