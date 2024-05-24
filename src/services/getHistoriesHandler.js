const { Firestore } = require('@google-cloud/firestore');

async function getPredictionHistories() {
    const db = new Firestore();

    try {
        const snapshot = await db.collection('predictions').get();
        const data = [];

        snapshot.forEach(doc => {
            data.push({ id: doc.id, history: { ...doc.data() } });
        });

        return data;
    } catch (error) {
        console.error('Error fetching prediction histories:', error);
        throw new Error('Error fetching prediction histories');
    }
}

module.exports = getPredictionHistories;
