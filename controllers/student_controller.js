// to validate emails
const validator = require('validator');
// to convert to csv format
const converter=require('objects-to-csv');
const Student=require('../models/student');
const Interview = require('../models/interview');

// displaying students on employee dashboard
module.exports.dashboard=async function(req, res){
    // getting all the students
    const studentsList=await Student.find({});
    return res.render('employeeDashboard',{
        title:"Employee | Dashboard",
        studentsList: studentsList
    })
}

// add student page
module.exports.addStudentPage= function(req,res){
    return res.render('addStudent',{
        title:"Add New Student"
    })
}
// adding student in database
module.exports.addStudent=async function(req,res){
    try{
        // if email entered is not valid
       if(!validator.isEmail(req.body.email)){
         req.flash('error' ,'Enter valid Email!');
          return res.redirect('back');
       }else{
          const isStudentPresent=await Student.findOne({email:req.body.email});
          if(isStudentPresent){ //if the student exists
            req.flash('error' ,'This student already exists');
            return res.redirect('back');
          }else{ //if they don't exist
             await Student.create({
                batch:req.body.batch,
                name:req.body.name,
                email:req.body.email,
                college:req.body.college,
                status:req.body.status,
                DSA_FinalScore:req.body.DSA_FinalScore,
                WebD_FinalScore:req.body.WebD_FinalScore,
                React_FinalScore:req.body.React_FinalScore
             });
             req.flash('success' , 'Student Added Successfully!');
             return res.redirect('/employee/dashboard');
          }
       }
    }catch(error){
        req.flash('error', 'Error in adding a student')
        return res.send('Error in adding student');
    }
}

// delete student from database
module.exports.deleteStudent = async function(req,res){
    try{
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    const interviewsOfStudent = student.interviews;
    // delete reference of student from companies in which this student is enrolled
    if (interviewsOfStudent.length > 0) {
      for (let interview of interviewsOfStudent) {
        await Interview.findOneAndUpdate(
          { company: interview.company },
          { $pull: { students: { student: studentId } } }
        );
      }
    }
    student.remove();
    req.flash("success", "Student deleted!");
    return res.redirect("back");
    }catch(error){
        console.log(error);
        req.flash('error', 'Error in deleting a student');
        return res.send('Error in adding student');
    }
}

// render edit student page
module.exports.editStudentPage = async function(req, res){
    try{
       let {studentId}=req.params;
       let student=await Student.findById(studentId);
       return res.render('editStudent',{
        title:'Edit Student',
        student:student
       })

    }catch(error){
       req.flash('error','Error in fetching the page');
       return res.redirect('back');
    }
}

// editing a student
module.exports.editStudent = async function(req, res){
    try{
        let {studentId}=req.params;
        let student=await Student.findById(studentId);
        student.batch=req.body.batch;
        student.name=req.body.name;
        student.email=req.body.email;
        student.college=req.body.college;
        student.status=req.body.status;
        student.DSA_FinalScore=req.body.DSA_FinalScore;
        student.WebD_FinalScore=req.body.WebD_FinalScore;
        student.React_FinalScore=req.body.React_FinalScore;
        await student.save();
        req.flash('success','Student successfully edited!');
        return res.redirect('/employee/dashboard');

    }catch(error){
        req.flash('error','Error in editing the student');
        return res.redirect('back');
    }
}

// downloading the csv file
module.exports.downloadFile=async function(req,res){
    // getting all the students
    try{
        const studentsList=await Student.find({});
        let allStudentData=[]; // to store the data and then convert array of objects into csv
        for(let i=0;i<studentsList.length;i++){
            let student=studentsList[i];
            // iterating over all the interviews
            for(let j=0;j<student.interviews.length;j++){
                let interview=student.interviews[j];
                  // making the object to convert it to csv file
                let data={
                    StudentId:student.id,
                    Name:student.name,
                    Batch:student.batch,
                    Email:student.email,
                    Status:student.status,
                    College:student.college,
                    DSA:student.DSA_FinalScore,
                    WebD:student.WebD_FinalScore,
                    React:student.React_FinalScore,
                    CompanyName:interview.companyName,
                    InterviewDate:interview.date.toString().substring(4,15),
                    Result:interview.result
                  };
                  allStudentData.push(data);
            }
            // if there are no interviews the student is enrolled in
            if(student.interviews.length==0){
                let data={
                    StudentId:student.id,
                    Name:student.name,
                    Batch:student.batch,
                    Email:student.email,
                    Status:student.status,
                    College:student.college,
                    DSA:student.DSA_FinalScore,
                    WebD:student.WebD_FinalScore,
                    React:student.React_FinalScore
                  };
                allStudentData.push(data);
            }
    
        }
    let csv=new converter(allStudentData);
    await csv.toDisk('./studentData.csv');
    req.flash('success' , 'File downloaded successfully!');
    return res.download('./studentData.csv');
    }catch(error){
        console.log(error);
    }
    
}
