import mongoose from "mongoose";

//define schemas(how the data should look like)
const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

const todoSchema = new mongoose.Schema({
    description: String,
    done: Boolean,
    ownerId: String
})

export const User = mongoose.model("User", userSchema)
export const Todo = mongoose.model("Todo", todoSchema)