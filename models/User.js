import mongoose from "mongoose";
//данные пользователя описываем 
//requred - обяазтельнаяли часть 
//unique - уникальная ли 

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String
    },
}, {
    //дата создания и обноваления сохраняется
    timestamps: true,
});

export default mongoose.model('User', UserSchema);


