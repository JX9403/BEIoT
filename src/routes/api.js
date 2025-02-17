const express = require('express')
const { getServer } = require('../controllers/apiController.js')
const { postCreateSensorData, getAllSensorData, deleteSensorData } = require('../controllers/sensorDataController.js');
const { getAllActivityHistory, postCreateActivityHistory, deleteActivityHistory } = require('../controllers/activityHistoryController.js');

const routerAPI = express.Router();

routerAPI.get('/', getServer);

routerAPI.get('/sensor-data', getAllSensorData)
routerAPI.post('/sensor-data', postCreateSensorData)
routerAPI.delete('/sensor-data', deleteSensorData)

routerAPI.get('/activity-history', getAllActivityHistory)
routerAPI.post('/activity-history', postCreateActivityHistory)
routerAPI.delete('/activity-history', deleteActivityHistory)

module.exports = routerAPI;