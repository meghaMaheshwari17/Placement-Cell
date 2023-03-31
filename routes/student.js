// firing up the express
const express = require('express');
const router=express.Router();

const studentController=require('../controllers/student_controller');

// get the dashboard
router.get('/dashboard',studentController.dashboard);
// add student page
router.get('/student',studentController.addStudentPage);
// adding student
router.post('/addstudent',studentController.addStudent);

// delete a student
router.get('/deleteStudent/:studentId',studentController.deleteStudent)

// to show edit student page
router.get('/editStudentPage/:studentId',studentController.editStudentPage);

// to  edit student 
router.post('/editStudent/:studentId',studentController.editStudent);
// to download csv file
router.get('/download',studentController.downloadFile);

module.exports=router;