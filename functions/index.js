const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();


exports.syncMatchArray = functions.firestore
    .document("matches/{matchId}")
    .onWrite((change, context) => {
      const {before, after} = change;
      const matchId = context.params.matchId;
      let forGameId;
      functions.logger.log("I AM RUNNING BEFORE IF!");
      // for a new match...
      if (!before.exists) {
        forGameId = after.data().gameId;
        functions.logger.log("I AM RUNNING!");
        db.collection("games").doc(`${forGameId}`).update({
          matches: admin.firestore.FieldValue.arrayUnion(matchId),
        });
      }
      // TO ADD: if deleted, if updated...
      return null;
    });
