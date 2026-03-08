const User = require("../models/User");
const config = require("../config/env");

const ensureAdminUser = async () => {
  const email = config.adminEmail.toLowerCase();
  const existing = await User.findOne({ email }).select("+password");

  if (!existing) {
    await User.create({
      firstName: "System",
      lastName: "Admin",
      email,
      password: config.adminPassword,
      role: "admin",
      licenseNumber: "ADMIN",
      phone: "+0000000000",
      isActive: true,
    });
    console.log(`Bootstrap: admin user created for ${email}`);
    return;
  }

  let changed = false;
  if (existing.role !== "admin") {
    existing.role = "admin";
    changed = true;
  }
  if (!existing.isActive) {
    existing.isActive = true;
    changed = true;
  }

  if (changed) {
    await existing.save();
    console.log(`Bootstrap: admin user normalized for ${email}`);
  } else {
    console.log(`Bootstrap: admin user already present (${email})`);
  }
};

module.exports = { ensureAdminUser };
