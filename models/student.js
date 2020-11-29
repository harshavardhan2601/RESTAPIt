var mongoose = require("mongoose");
var studentSchema = new mongoose.Schema({
    studentid:String,
    sstudentname:String,
    studentcountry:String,
    studentstate:String,
    studentdistrict:String,
    studentmandal:String,
    studentvillage:String,
    studentdob:String,
    // student_pic:String,
    status:Number,
  create_date: {
    type: Date,
    default: Date.now
  }
  
});

mongoose.model("student", studentSchema );