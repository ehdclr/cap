const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const config = require("../config/database");
const reUser = require("../models/reuser");
const reuser = require("../models/reuser");

// 1. 사용자 등록
router.post("/register", (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    corporate: req.body.corporate,
    phone: req.body.phone,
  });

  User.getUserByUsername(newUser.username, (err, user) => {
    if (err) throw err;
    if (user) {
      return res.json({
        success: false,
        msg: "같은 아이디가 존재합니다.",
      });
    } else {
      User.addUser(newUser, (err, user) => {
        if (err) {
          res.json({ success: false, msg: "사용자 등록 실패" });
        } else {
          res.json({ success: true, msg: "사용자 등록 성공" });
        }
      });
    }
  });
});

/// 2. 사용자 인증 및 JWT 토큰 발급
router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found. 등록된 사용자가 없습니다.",
      });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        let tokenUser = {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        };
        const token = jwt.sign({ data: tokenUser }, config.secret, {
          expiresIn: 604800, // 1 week
        });
        res.json({
          success: true,
          token: token,
          userNoPW: tokenUser,
        });
      } else {
        return res.json({
          success: false,
          msg: "Wrong password. 패스워드가 맞지 않습니다.",
        });
      }
    });
  });
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({
      user: {
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
      },
    });
  }
);

// 리스트 원본
router.get("/homecustomer", (req, res, next) => {
  reUser.getAll((err, users) => {
    if (err) throw err;
    res.json(users);
  });
});







//예약하기

// router.post("/homecustomer", (req, res, next) => {
//   let renewUser = new reUser({
//     name: req.body.name,
//     phone: req.body.phone,
//     date: req.body.date,
//     password: req.body.password,
//   });
//   reUser.addUser(renewUser, (err, user) => {
//     if (err) {
//       res.json({ success: false, msg: "Failed to register user" });
//     } else {
//       res.json({ success: true, msg: "User registered" });
//     }
//   });
// });

// //예약하기 원본
// router.post("/homecustomer", (req, res, next) => {



//   let renewUser = new reUser({
//     _id: req.body._id,
//     name: req.body.name,
//     phone: req.body.phone,
//     date: req.body.date,
//     password: req.body.password,
//   });
//   reUser.getUserByPhone(renewUser.phone, (err, phone) => {
//     if (err) throw err;
//     if (phone) {
//       return res.json({
//         success: false,
//         msg: "이미 등록된 전화번호 입니다.",
//       });
//     } else {
//       reUser.addUser(renewUser, (err, phone) => {
//         if (err) {
//           res.json({ success: false, msg: "이미 등록된 번호입니다." });
//         } else {
//           res.json({ 
//             success: true, 
//             msg: "예약 성공",
//             renewuser :renewUser,
        
//         });
//         }
//       });
//     }
//   });
// });

//예약하기 복사
router.post("/homecustomer", (req, res, next) => {

  var phone = req.body.phone;  
   var result = "*".repeat(phone.length - 4) + phone.slice(-4);
  
  let renewUser = new reUser({
    _id: req.body._id,
    name: req.body.name,
    phone: result,
    date: req.body.date,
    password: req.body.password,
  });
  reUser.getUserByPhone(renewUser.phone, (err, phone) => {
    if (err) throw err;
    if (phone) {
      return res.json({
        success: false,
        msg: "이미 등록된 전화번호 입니다.",
      });
    } else {
      reUser.addUser(renewUser, (err, phone) => {
        if (err) {
          res.json({ success: false, msg: "이미 등록된 번호입니다." });
        } else {
          res.json({ 
            success: true, 
            msg: "예약 성공",
            renewuser :renewUser,
        
        });
        }
      });
    }
  });
});





//손님 예약하기 qr 코드 
router.get("/customer_reserve", (req,res,next) => {
  const phone = req.body.phone;
  const name = req.body.name;

  reUser.getUserByPhone(phone,(err,reuser) =>{
    if(err) throw err;
    if(!reuser) {
        return res.json({success: false, msg: 'User not found. 등록된 사용자가 없습니다.'});
    }
    reUser.comparePhone(phone,reuser.phone, (err,isMatch) =>{
      if(err) throw err;
      if(isMatch){
        
         

        
        res.json({
          success:true,
          name: reuser.name,
          phone:reuser.phone,
          id:reuser._id,


        });
        
      }else{
        return res.json({success:false, msg: '등록된 전화번호가 없습니다.'})
      }

    });

  });
  

});


router.get("/homecustomer/:id", (req, res, next) => {
  reUser.findById(req.params.id)
  .exec((err, users) => {
    if (err) throw err;
    res.json(users);
  });
});


router.get("/QRcustomers/:id", (req, res, next) => {
  reUser.findById(req.params.id)
  .exec((err, users) => {
    if (err) throw err;
    res.json(users);
  });
});




//식당 손님 리스트 삭제 

// router.delete("/customer_delete",(req,res,next) =>{
//   let renewUser = new reUser({
//     name: req.body.name,
//     phone: req.body.phone,
//     date: req.body.date,
//     password: req.body.password,
//   });

//   reUser.getUserByPhone(renewUser.phone, (err, phone) => {
//     if (err) throw err;
//     if (phone) {

//       reUser.removeData(renewUser.phone,(err,phone) =>{

//         return res.json({
//           success: true,
//           msg: "삭제 완료.",
//         });
//       });
      
//     } else {
//       return res.json({
//         success: false,
//         msg: "등록된 번호가 아닙니다. 삭제 실패",

//       });
//     }
//   });

// });

router.delete("/homecustomer/:id", async (req, res, next) => {

 await reUser.findByIdAndDelete(req.params.id);
 res.json({
  message: "Ok! delete complete!",
  
  
});
  

  
});

router.post('/QRcustomers', (req,res,next) =>{
  
  const phone = req.body.renewuser.phone;
  console.log(phone);
  reUser.getUserByPhone(phone,(err,reuser) =>{
    if (err) throw err;
    if (!reuser) {
      return res.json({ success: false, 
        
        msg: "대기하지 않은 손님입니다.",
      });
    
    }else{

      const currentTime = req.body.currentTime; //클라이언트의 시간 
      console.log()
      const currentTime1 = new Date().getTime(); // 서버의 현재 시간

      const diffTime=currentTime1-currentTime;

      let verified = false;
      if(diffTime< 3600000000) verified =true;
      
      if(verified)
      {
        let customerinformation= {
          _id: reuser._id,
          name: reuser.name,
          phone: reuser.phone,

        };
        return res.json({ success: true, 
          msg: `${reuser.name}`+"님 어서오세요. 테이블로 안내해드리겠습니다.",
          customerinformation: customerinformation,
          
  
        });
        

      } else {
        return res.json({
          success: false,
          msg: "시간이 초과되었습니다. qr코드를 재발급 받으세요.",
      });


      }

      
    }

    


  });
  
});

// router.post('/QRcustomers/:id', (req,res,next) =>{
//   const customer = req.params.id;
//   console.log(phone);
//   reUser.findById(customer,(err,reuser) =>{
//     if (err) throw err;
//     if (!customer) {
//       return res.json({ success: false, 
        
//         msg: "대기하지 않은 손님입니다.",
//       });
    
//     }else{

//       const currentTime = req.body.currentTime; //클라리언트의 시간 
//       const currentTime1 = new Date().getTime(); // 서버의 현재 시간

//       const diffTime=currentTime1-currentTime;

//       let verified = false;
//       if(diffTime< 3600000) verified =true;
      
//       if(verified)
//       {
//         let customerinformation= {
//           _id: reuser._id,
//           name: reuser.name,
//           phone: reuser.phone,

//         };
//         return res.json({ success: true, 
//           msg: `${reuser.name}`+"님 어서오세요. 테이블로 안내해드리겠습니다.",
//           customerinformation: customerinformation,
  
//         });

//       } else {
//         return res.json({
//           success: false,
//           msg: "시간이 초과되었습니다. qr코드를 재발급 받으세요.",
//       });


//       }

      
//     }

    


//   });
//   reUser.deleteOne(customer);







// });





module.exports = router;
