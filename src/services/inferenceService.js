const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

const predictClassification = async (model, image) => {
   try {

    console.log('start of predict function');

      const tensor = tf.node
         .decodeJpeg(image)
         .resizeNearestNeighbor([224, 224])
         .expandDims()
         .toFloat();
      
      const prediction = model.predict(tensor);
      const scores = await prediction.data();
      const label = scores[0] > 0.5 ? 'Cancer' : 'Non-cancer';

      console.log('End of prediction:', { label, suggestion });
      
      return { 
        label,
        suggestion,};
        
   } catch(error) {
      console.error('Error in prediction:', error);
      throw new InputError(`Terjadi kesalahan input: ${error.message}`);
   }
}

module.exports = predictClassification;
