const functions = require("firebase-functions");

const admin = require("firebase-admin");
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

      // update the last played date on every
      // operation except for deletes
      if (after.exists) {
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
      }

      return null;
    });
