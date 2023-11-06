const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,

    },
    pic: {
        type: String,
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"

    },

}, {
    timestamp: true
})

const user = mongoose.model('User', userModel)

module.exports = user