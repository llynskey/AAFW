
export default function Login(){
    if (Username.length <= 20 && Username.length > 1) {
        try {
            userModel.findOne({ Username }, (err, user) => {
                console.log(Username)
                if (err)
                    console.log("error" + err);
                if (!user) {
                    res.status(401).json({
                        msg: "User Not Found"
                    });
                } else {
                    if (!user.comparePassword(Password)) {
                        res.status(401).json({
                            msg: "Incorrect Password"
                        });
                    } else {
                        console.log("user found");

                        jwt.sign({ userId: user._id, username: user.Username, userRole: user.Type }, privateKey, { expiresIn: '1d' }, (err, token) => {
                            console.log(token)
                            if (err)
                                console.log("error" + err)
                            try {
                                var t = new tokenModel({
                                    UserId: user._id,
                                    Username: user.username,
                                    UserRole: user.Type,
                                    Token: token
                                });
                                t.save();
                            } catch (err) {
                                console.log("token error");
                            }
                            console.log("user logged in")
                            res.json({
                                token: 'Bearer ' + token
                            });
                        });

                    }
                }
            });

        } catch (error) {
            res.status(500).json({
                msg: "Error: Database Connection error"
            });
        }

    } else {
        res.status(400).json({
            msg: "Error: Bad Input"
        });
    }
}

