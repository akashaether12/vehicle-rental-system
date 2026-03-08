const mongoose = require("mongoose");
const config = require("../config/env");
const connectDatabase = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await connectDatabase();

    const existing = await User.findOne({ email: config.adminEmail.toLowerCase() });
    if (existing) {
      existing.role = "admin";
      existing.isActive = true;
      await existing.save();
      console.log(`Admin already exists: ${existing.email}`);
      process.exit(0);
    }

    const admin = await User.create({
      firstName: "System",
      lastName: "Admin",
      email: config.adminEmail.toLowerCase(),
      password: config.adminPassword,
      role: "admin",
      licenseNumber: "ADMIN",
      phone: "+0000000000",
    });

    console.log(`Admin created: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();
