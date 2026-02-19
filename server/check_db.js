import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Admin from "./models/Admin.js";
import Student from "./models/Student.js";

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bit_test");
        console.log("Connected to MongoDB");

        const users = await User.find({});
        console.log("ALL USERS:", JSON.stringify(users, null, 2));

        const admins = await Admin.find({});
        console.log("ALL ADMINS:", JSON.stringify(admins, null, 2));

        const students = await Student.find({});
        console.log("ALL STUDENTS:", JSON.stringify(students, null, 2));

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkDB();
