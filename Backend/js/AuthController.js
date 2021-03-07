const { static } = require('express');
var userModel = require('../models/User');

class AuthController{
constructor(req){
 this.req = req;
}


 createUser(req) {
    const u = User({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Email: req.body.Email,
            Username: req.body.Username,
            Password: req.body.Pass,
            Type: req.body.Type
        });
    try{
        u.save();
    }catch(err){
        return "Could not create User";
    }
    return "User created Successfully";
}
    



static loginUser(Username,req,res) {
    If
    try {
        console.log("login")
        userModel.findOne({Username},function(err,user) {
            if(err){
                console.log("error")
            }
            if(!user){
                console.log("user not found");
               return res={msg:"user not found"}
            }
            (user.comparePassword(Password)?req.session.user = user:console.log("incorrect Password") && res.json({msg: "incorrect Password"}));
            console.log(req.session.user);
            return res ={
                msg: "Login Successful"
            };
        });

     } catch (error) {
        console.error(error); 
        return res ={
             msg: "Error: Database Connection error"
         };
     }
}

}

module.exports = AuthController.loginUser();

