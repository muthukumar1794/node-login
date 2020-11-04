const mongoose = require('mongoose');

const seedSchema = mongoose.Schema({
    first_name:{
        type:String,
        require:true
    },
    last_name:{
        type:String,
        default:""
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
    phone_number:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    date_of_birth:{
        type:String,
        require:true
    },
    status: {
        type: String,
        enum: ['active', 'in_active'],
        default: "active"
    },
    user_type:{
        type: String,
        enum: ['guest', 'admin'],
        default: "guest"
    }
},{collection:'user',timestamps:true})

const seedModal = mongoose.model('user',seedSchema);

module.exports = seedModal