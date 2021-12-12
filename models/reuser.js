const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");

// reUser Schema
const reUserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
});

const reUser = mongoose.model("reUser", reUserSchema);

reUser.getUserById = function (id, callback) {
  reUser.findById(id, callback);
};


reUser.getUserByPhone = function (phone, callback) {
  const query = { phone: phone };
  reUser.findOne(query, callback);
};
// reUser.addUser = function (renewUser, callback) {
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(renewUser.phone, salt, (err, hash) => {
//       if (err) throw err;
//       renewUser.phone = hash;
//       renewUser.save(callback);
//     });
//   });
// };

reUser.addUser = function (renewUser, callback) {
  
      
      renewUser.save(callback);
    
  
};


reUser.comparePhone = function(candidatePhone, hash, callback){
  bcrypt.compare(candidatePhone, hash, (err, isMatch) =>{
      if(err) throw err;
      callback(null, isMatch);
  });
}


reUser.getAll = function (callback) {
  reUser.find(callback);
};


reUser.deletebyphone = function(phone, callback){
  const query = { phone: phone };
  var phone1=reUser.findOne(query, callback);
  reUser.deleteOne(phone1);

}

module.exports = mongoose.model("reUser",reUserSchema );
