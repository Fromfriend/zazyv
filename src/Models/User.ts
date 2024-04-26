import mongoose, { Schema, model } from "mongoose";

interface IUser {
    _id?: mongoose.Types.ObjectId;
    user_id: string;
    group_id: string;
    first_name: string;
    username: string;
}

const userSchema = new Schema({
    user_id: String,
    group_id: String,
    first_name: String,
    username: String,
});

export default model("user", userSchema);
