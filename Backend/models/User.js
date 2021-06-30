var mongoose = require('mongoose');
var bcrypt = require("bcryptjs");

const saltRounds = 10;

const User = new mongoose.Schema({
    UserId: {
        type: Number,
        auto: true
    },

    FirstName: {
        type: String,
        required: true
    },
    LastName:{
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true
    },
    Username:{
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    },
    Type:{
        type: String,
        required: true
    }
},
{ timestamps: true }
)

User.methods.comparePassword = function(Password) {
    const document = this;
    
    let value = bcrypt.compareSync(Password, document.Password)
    return  value;
}

User.pre('save', function(next){
  if(this.isNew || this.isModified('Password'))
    {
        //saving 'this', as in new scope
        const document = this;

        bcrypt.hash(document.Password, saltRounds, 
            function (err, hashedPass){
                if(err){
                    next(err);   
                }else{
                    document.Password = hashedPass;
                    next();
                }
            });   
    }
});

module.exports = mongoose.model('users', User);

