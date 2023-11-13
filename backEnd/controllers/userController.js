const { validationResult } = require('express-validator');
const User = require('../models/userModel')
const jwtToken = require('../config/jwt')
const bcrypt = require('bcrypt');
// const { use } = require('../routes/userRoutes');

exports.userSignUp = async (req, res) => {

    try {
        const { name, email, password, pic } = req.body
        let success = false
        const errors = validationResult(req);
        //if there error exists then catch that error and send the errors back
        if (!errors.isEmpty()) {
            return res.json({ success, errors: errors.array() });
        }


        const user = await User.findOne({ email: email })


        //if email exists we suggest the user to log in
        if (user) {
            return res.json({ success, msg: "email already exists...log in" });
        }
        const salt = await bcrypt.genSalt(10)

        const secPassword = await bcrypt.hash(password, salt)
        //else 
        let newuser = await User.create({
            name,
            email,
            password: secPassword,
            pic
        })


        const createUser = await newuser.save()



        const token = await jwtToken(createUser._id)
        success = true



        return res.status(201).json({
            success,
            msg: "successfully registered",
            _id: createUser._id,
            name: createUser.name,
            pic: createUser.pic,
            isAdmin: createUser.isAdmin,
            email: createUser.email, token
        });
        // res.status(201).json({success,msg:"logged in sucessfully",authToken });

    } catch (e) {
        return res.status(500).json({ msg: "error in the server side", error: e });
    }


}

exports.userLogIn = async (req, res) => {

    try {
        const { email, password } = req.body
        let success = false
        const errors = validationResult(req);
        //if there error exists then catch that error and send the errors back
        if (!errors.isEmpty()) {
            return res.json({ success, errors: errors.array() });
        }

        const userExists = await User.findOne({ email })
    

        //if email doesnot exists we suggest the user to signup
        if (!userExists) {
            return res.json({ success, msg: "email doesnot exists...try  signup" });
        }
        
        const ispassword = await bcrypt.compare(password, userExists.password)
        if (!ispassword) {
            return res.json({ success, msg: "Invalid credentials" });
        }

        const token = await jwtToken(userExists._id)
        success = true

        return res.status(201).json({
            success,
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
            // isAdmin: userExists.isAdmin,
            pic: userExists.pic,
            token,
        });




    } catch (e) {
        return res.status(500).json({ msg: "error in the server side", error: e });
    }


}

exports.getUser = async (req, res) => {
    try {
        let success = false
        const keyword = req.query.search
            ? {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } }
                ]
            } :
            {}
        // let user = await User.find(keyword).find({ _id: { $ne: req.user } }).select("name","email","pic")
        let user = await User.find({
            $and: [
                keyword,
                { _id: { $ne: req.user } }
            ]
        }).select("name email pic");

        if (user.length === 0) {
            user = "Not found"
        }
        success = true
        return res.json({ success, data: user })
    } catch (e) {
        res.json({ e, msg: "error" })
    }
}