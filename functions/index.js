const functions = require("firebase-functions");

const admin = require("firebase-admin");
const { match } = require("assert");
admin.initializeApp();
const db = admin.firestore();


exports.gameUpdatesFromMatchWrites = functions.firestore
    .document("matches/{matchId}")
    .onWrite((change, context) => {
      const {before, after} = change;
      const matchId = context.params.matchId;
      functions.logger.log("syncMatchArray RUNNING...");

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
              if (matchesArray.length === 0) {
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
            functions.logger.log("arrayOfMatches =", arrayOfMatches);
            arrayOfMatches.forEach(({ id, playOrder }) => {
              db.collection("matches").doc(`${id}`)
                .update({playOrder: playOrder});
            })
          });
          
      return null;
    });
