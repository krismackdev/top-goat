const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();


exports.syncMatchArray = functions.firestore
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

      return null;
    });
