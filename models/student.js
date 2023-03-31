// creating a schema for student
const mongoose = require('mongoose');

const studentSchema=new mongoose.Schema({
    batch:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
      },
    email:{
        type:String,
        required:true
    },
    college:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum: ['placed' , 'not placed'], //value can either be placed or not_placed
        default: 'not placed'
    },
    DSA_FinalScore :{
        type:Number,
        default:0
    },
    WebD_FinalScore :{
        type:Number,
        default:0
    },
    React_FinalScore :{
        type:Number,
        default:0
    },
    interviews: [
        {
          companyName: {
            type: String,
            required: true,
          },
          date: {
            type: String,
            required: true,
          },
          result: {
            type: String,
            enum: ["PASS", "FAIL", "Didn't Attempt", "On Hold"],
          },
        },
      ],


},{ 
    timestamps:true
});

const Student=mongoose.model('Student',studentSchema);

module.exports =Student;