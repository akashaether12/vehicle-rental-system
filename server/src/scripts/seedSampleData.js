const mongoose = require("mongoose");
const connectDatabase = require("../config/db");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

const run = async () => {
  try {
    await connectDatabase();

    const customerEmail = "customer@velocityrentals.com";
    const existingCustomer = await User.findOne({ email: customerEmail });
    if (!existingCustomer) {
      await User.create({
        firstName: "Demo",
        lastName: "Customer",
        email: customerEmail,
        password: "Customer@123",
        phone: "+910000000000",
        licenseNumber: "DL-DEM0-12345",
        role: "customer",
      });
      console.log(`Created demo customer: ${customerEmail} / Customer@123`);
    }

    const existingVehicles = await Vehicle.countDocuments();
    if (existingVehicles === 0) {
      await Vehicle.insertMany([
        {
          name: "City Cruiser",
          brand: "Honda",
          model: "City",
          type: "sedan",
          year: 2023,
          seats: 5,
          transmission: "automatic",
          fuelType: "petrol",
          location: "Bangalore",
          pricePerDay: 2500,
          images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"],
          description: "Comfortable sedan for city and highway drives.",
        },
        {
          name: "Adventure X",
          brand: "Mahindra",
          model: "XUV700",
          type: "suv",
          year: 2024,
          seats: 7,
          transmission: "automatic",
          fuelType: "diesel",
          location: "Hyderabad",
          pricePerDay: 4200,
          images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"],
          description: "Spacious SUV for family trips and weekend getaways.",
        },
        {
          name: "Eco Spark",
          brand: "Tata",
          model: "Nexon EV",
          type: "ev",
          year: 2024,
          seats: 5,
          transmission: "automatic",
          fuelType: "electric",
          location: "Chennai",
          pricePerDay: 3000,
          images: ["https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80"],
          description: "Electric SUV with modern features and fast charging support.",
        },
      ]);
      console.log("Inserted sample vehicles.");
    } else {
      console.log("Vehicles already exist, skipped vehicle seeding.");
    }

    console.log("Sample seed complete.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed sample data:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

run();
