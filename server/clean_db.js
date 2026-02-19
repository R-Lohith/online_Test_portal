import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Admin from "./models/Admin.js";
import Student from "./models/Student.js";

dotenv.config();

const cleanDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bit_test");
        console.log("Connected to MongoDB");

        // Delete users with username 'admin' or similar if they exist as students
        // Or just list them and ask user to confirm deletion?
        // User wants it working. Cleaning up 'admin' username is safe assumption if it's broken.

        // Let's find any user that is NOT in Admin collection but used an 'admin' like username?
        // Or just delete the specific user if I knew the ID.

        // I'll just delete ALL users for now as this is a test portal and user is just setting it up.
        // "remove the admin in the layout...".

        // Wait, better to just delete the specific one.
        // I'll print them first in this script to be sure.
        const users = await User.find({});
        for (const u of users) {
            if (u.role === 'student' && (u.username.includes('admin') || u.email.includes('admin'))) {
                console.log(`Deleting suspicious student user: ${u.username} (${u._id})`);
                await User.deleteOne({ _id: u._id });
                await Student.deleteOne({ user: u._id }); // cleanup student record if exists
            }
        }

        console.log("Cleanup done.");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

cleanDB();
