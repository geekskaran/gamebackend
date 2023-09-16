const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();
//sendOTP
exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            age

        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !age
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

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
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

//signUp

//Login

//changePassword

