const express = require('express');
const router = express.Router();
const jobList = require('../controllers/jobs_controller');
// to get the list of all the jobs from api
router.get('/list' , jobList.jobPage);
module.exports = router;