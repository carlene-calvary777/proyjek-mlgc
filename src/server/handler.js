const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const InputError = require('../exceptions/InputError');
const getPredictionHistories = require('../services/getHistoriesHandler'); 


async function postPredictHandler(request, h) {
  try {

    
    const { image } = request.payload;
    const { model } = request.server.app;

    // if image does  not exist
    if (!image || !image._data) {
      throw new InputError("Image file is missing or invalid");
    }

    // if image exceeds the size limit
    if (image._data.length > 1000000) {
      throw new InputError("Payload content length greater than maximum allowed: 1000000");
    }

    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: label,
      suggestion: label == 'Cancer' ? 'Segera konsultasi ke dokter!' : 'Monitor terus',
      createdAt
    };

    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully.',
      data
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('Error:', error); 

    if (error instanceof InputError) {
      return h.response({
        status: 'fail',
        message: error.message
      }).code(413); 
    } else {
      return h.response({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi'
      }).code(400); 
    }
  }
}

async function getHistoriesHandler(_request, h) {
  try {
    const histories = await getPredictionHistories();
    const response = h.response({
      status: 'success',
      data: histories
    });
    return response;
  } catch (error) {
    console.error('Error:', error); 

    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam mendapatkan riwayat prediksi'
    }).code(400);
  }
}

module.exports = {
  postPredictHandler,
  getHistoriesHandler
};
  

