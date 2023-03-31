// creating a schema for employee 
const mongoose = require('mongoose');

const employeeSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true, //email is a required property
        unique:true //should be unique 
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
      }

},{ 
    timestamps:true
});

const Employee=mongoose.model('Employee',employeeSchema);

module.exports =Employee;