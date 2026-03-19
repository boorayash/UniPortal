const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require("../model/schema/admin.js");

async function createAdmin() {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI);

    const email = process.env.ADMIN_EMAIL;
    const rawpassword = process.env.ADMIN_PASSWORD;

    const hashedPassword = await bcrypt.hash(rawpassword, 10);

    await Admin.create({ email, password: hashedPassword });
    console.log("Admin created successfully");
    mongoose.disconnect();
}

createAdmin();