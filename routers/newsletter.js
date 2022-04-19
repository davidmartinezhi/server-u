const express = require('express');
const NewsLetterController = require('../controllers/newsletter');

const api = express.Router();

api.post("/subscribe-newsletter/:email", NewsLetterController.subscribeEmail);

module.exports = api;
