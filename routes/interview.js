// firing up the express
const express = require('express');
const router=express.Router();

const interviewPage=require('../controllers/interview_controller');

// to show all the interviews
router.get('/interview_page',interviewPage.interviewPage);

router.get('/interview_form',interviewPage.interviewForm);

// to add student to interview
router.post('/addStudentToInterview',interviewPage.addStudentToInterview);
// to create interview 
router.post('/interview_creation',interviewPage.interviewCreation);


// to delete an interview of a student 
router.post('/deleteStudentInterview',interviewPage.deleteStudentInterview);

module.exports=router;