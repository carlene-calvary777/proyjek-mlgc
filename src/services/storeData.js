const { Firestore } = require('@google-cloud/firestore');


async function storeData(id, data) {
  const db = new Firestore({
      databaseId: '(default)',
      projectId: 'submissionmlgc-carlenecalvary'
  });

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

module.exports = storeData;
