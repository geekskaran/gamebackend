const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();
//signUp
exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            age,
            password,
            confirmPassword


        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !age||
            !password||
            !confirmPassword
        ) {
            return res.status(403).send({
                success: false,
                message: "All fields must be provided"
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password not match"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
			firstName,
			lastName,
			email,
            age
		});

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully"
        });
    }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "User cannot be registered. Please try again.",
            });
        }
    }


//Login

exports.login = async (req, res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                status: false,
                message:"Invalid email or password"
            });
        }

        const  user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success: false,
                message:"User not found"
            });
        }
        

		// Generate JWT token and Compare Password
		// Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

			// Save token to user document in database
			user.token = token;
			user.password = undefined;
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		} else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});

    }
 
}

//changePassword

