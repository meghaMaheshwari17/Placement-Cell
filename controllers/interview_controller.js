const Student = require('../models/student');
const Interview = require('../models/interview');

// rendering interviewPage
module.exports.interviewPage = async function (req, res) {
  const interviewList = await Interview.find({}).populate('students.student'); //displaying all the interviews
  return res.render('interview', {
    title: 'Interviews',
    interviewList: interviewList,
  });
};

// rendering form for interview allocation
module.exports.interviewForm = async function (req, res) {
  return res.render('interviewAllocationForm', {
    title: 'Interview Allocation Form',
    id: req.params.id,
  });
};

// create an interview in a company
module.exports.interviewCreation = async function (req, res) {
  try {
    // check if interview already exists
    let companyPresent = await Interview.findOne({
      companyName: req.body.companyName,
      date:req.body.date
    });
    if (!companyPresent) {
      //if the interview in that company does not exist
      // creating an interview in that company
      companyPresent = await Interview.create({
        companyName: req.body.companyName,
        date: req.body.date,
      });
      req.flash('success', 'Interview created successfully!');
    } else {
      //if company already exists
      req.flash('error', 'Company already exists!');
    }
    return res.redirect('/student/interview_page');
  } catch (error) {
    return res.send('error in allocating interview');
  }
};

// add a particular student for an interview in a company
module.exports.addStudentToInterview = async function (req, res) {
  try {
    console.log(req.body);
    let student = await Student.findOne({ email: req.body.email });
    if (student) {  //add interview only if that student exists
        // check if that student is not already present in that interview
      let studentExists = await Interview.findOne({
        'students.student': student._id,
        'companyName':req.body.company_name,
        'date':req.body.date
      });

      if (!studentExists) { //add student to that interview only if doesn't already exist in that interview
        let company = await Interview.findOne({
          companyName: req.body.company_name,
          date:req.body.date
        });
        company.students.push({
          student: student._id,
          result: req.body.result,
        });
        await company.save();
        // add that interview in student database too
        student.interviews.push({
            companyName: req.body.company_name,
            date: req.body.date,
            result: req.body.result,
          });
          await student.save();
        req.flash('success', 'Student enrolled!');
      } else {
        req.flash(
          'error',
          `${student.name} is already enrolled in ${req.body.company_name}!`
        );
      }

      return res.redirect('back');
    } else {
      req.flash('error', "student doesn't exist!");
      return res.redirect('back');
    }
  } catch (error) {
    console.log(error);
  }
};

// delete that student interview from that company
module.exports.deleteStudentInterview = async function (req, res) {
  try {
    // delete student from Interview database 
    await Interview.findOneAndUpdate(
      { companyName: req.body.companyName },
      { $pull: { students: { student: req.body.studentId } } }
    );
    // delete student from Student database 
    await Student.findOneAndUpdate(
      { _id: req.body.studentId },
      { $pull: { interviews: { companyName: req.body.companyName } } }
    );
    req.flash('success', `student removed from the ${req.body.companyName}`);
    return res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};
