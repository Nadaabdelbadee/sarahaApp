
import mongoose from "mongoose";
import { roles } from "../../middleware/auth.js";


export const enumGender = {
    male:"male",
    female:"female"
}

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        minLength:3,
        maxLength:10,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password:{
        type:String,
        required:true,
        minLength:8,
    },
    phone:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum:Object.values(enumGender),
        required:true
    },
    confirmed:{
        type :Boolean,
        default:false
    },
    role:{
        type:String,
        enum:Object.values(roles),
        default:roles.user
    },
    passwordChangedAT:Date,
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


const userModel = mongoose.models.user || mongoose.model("user" , userSchema)
export default userModel