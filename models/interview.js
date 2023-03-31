// creating a schema for interview
const mongoose = require('mongoose');
const interview = new mongoose.Schema({
    companyName :{
        type : String,
        required : true
    },
    date :{
        type : Date,
        default : Date.now()
    },
    students: [
        {
          student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
          },
          result: {
            type: String,
            enum: ["PASS", "FAIL", "Didn't Attempt", "On Hold"],
          },
        },
      ],
},{timestamps : true});

const Interview = mongoose.model('Interview' , interview);
module.exports = Interview;