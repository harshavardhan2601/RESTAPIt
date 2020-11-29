var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  var reqs= req.body
  mongoose.model('student').find({},function (err,studentobj) {
    if (err) {
      console.log(err);
    } else {
      if (studentobj) {
        res.render('table',{data:studentobj});
      }
    }
  });
  // res.render('table');
});

function randomString(length) {
  chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

router.post('/uploadfile', function(req, res) {
  //console.log(req.body);
  var data = req.body.data;
  var filedata = data.filedata;
  try {
      fileId = randomString(10);
      // ImageToPdf(fileId, filedata.filetype);
      //
      if (filedata.filetype == 'image/jpeg') fileId = '/uploads/' + fileId + ".jpeg";
      if (filedata.filetype == 'image/jpg') fileId = '/uploads/' + fileId + ".jpg";
      if (filedata.filetype == 'image/png') fileId = '/uploads/' + fileId + ".png";
      if (filedata.filetype == 'application/pdf') fileId = '/uploads/' + fileId + ".pdf";
      if (filedata.filetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') fileId = '/uploads/' + fileId + ".docx";
      if (filedata.filetype == 'application/msword') fileId = '/uploads/' + fileId + ".doc";
      fs.writeFile('public/' + fileId, new Buffer(filedata.base64, "base64"), function(err) {
          if (err) {
              // console.log(err);
              var res_data = { status: 0, message: 'error while uploading' };
              // res.send(commonData.oecy(res_data));

          } else {
              var res_data = { status: 1, message: 'Uploaded Successfully', savedpath: fileId };
              res.send(res_data);
          }
      });
  } catch (e) {
      console.log("Error ==" + e);
  }

});

router.post('/unlinkfile', function (req, res, next) {
  // console.log(req.body.filename); 
  const path = req.body.filename
  //console.log(path);
  //console.log(path);
  fs.unlink('public/' + path, (err) => {
    if (err) {
      console.error(err)
      return
    } else {
      console.log('File Deleted');
    }
    //file removed
  })
});

/* Post Student Data */
router.post('/studentdata', function (req, res, next) {
  try {
    var reqs = req.body;
    // console.log(reqs);
    var newstudent = {
      studentid:reqs.studentid,
      sstudentname:reqs.sstudentname,
      studentcountry:reqs.studentcountry,
      studentstate:reqs.studentstate,
      studentdistrict:reqs.studentdistrict,
      studentmandal:reqs.studentmandal,
      studentvillage:reqs.studentvillage,
      studentdob:reqs.studentdob,
      // student_pic: reqs.student_pic_hidden,
      status:0
    }
    //file_attach1:
    mongoose.model('student').create(newstudent, function (err, newstudentObj) {
      if (err) {
        console.log(err);
        res.json({ data: 'Failure' });
      } else {
        if (newstudentObj) {
          console.log(newstudentObj);
          // res.json(newStudentObj);
          res.redirect('/');
          // res.render('transport/adddriver');
        } else {
          res.json({ data: 'Failure' });
          console.log('Object Failure');
        }
      }
    });
  }
  catch (e) {
    console.log(e);
  }
});

router.post('/update_student',function (req,res,next) {
  var reqs = req.body
  console.log(reqs._id);
  mongoose.model('student').findOneAndUpdate({_id: reqs._id },{
    $set:{
      studentid:reqs.student_obj.studentid,
      sstudentname:reqs.student_obj.sstudentname,
      studentcountry:reqs.student_obj.studentcountry,
      studentstate:reqs.student_obj.studentstate,
      studentdistrict:reqs.student_obj.studentdistrict,
      studentmandal:reqs.student_obj.studentmandal,
      studentvillage:reqs.student_obj.studentvillage,
      studentdob:reqs.student_obj.studentdob
    }
  },function (err,updatestudent_obj) {
    if (err) {
      console.log(err);
    } else {
      res.json({ msg: updatestudent_obj, status: 1 });
    }
  })
});

router.get('/studentdelete/:dataId',function (req,res,next) {
  var user_id = req.params.dataId;
    console.log(user_id);
    mongoose.model('student').remove({ _id: user_id }, (err, dataObj) => {
      if (err) {
        console.log(err);
      } else {
        if (dataObj) {
          res.redirect('/');
        } 
      }
    });
})


module.exports = router;
