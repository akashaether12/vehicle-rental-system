const mongoose = require("mongoose");
const connectDatabase = require("../config/db");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

const sampleVehicles = [
  {
    name: "Honda City ZX",
    brand: "Honda",
    model: "City ZX",
    type: "sedan",
    year: 2024,
    seats: 5,
    transmission: "automatic",
    fuelType: "petrol",
    location: "Bangalore",
    pricePerDay: 2500,
    images: [],
    description: "A polished sedan for airport runs, city meetings, and long urban commutes.",
  },
  {
    name: "Mahindra XUV700 AX7",
    brand: "Mahindra",
    model: "XUV700 AX7",
    type: "suv",
    year: 2024,
    seats: 7,
    transmission: "automatic",
    fuelType: "diesel",
    location: "Hyderabad",
    pricePerDay: 4200,
    images: [],
    description: "A full-size SUV tuned for family travel, highway comfort, and weekend road trips.",
  },
  {
    name: "Tata Nexon EV Empowered",
    brand: "Tata",
    model: "Nexon EV Empowered",
    type: "ev",
    year: 2024,
    seats: 5,
    transmission: "automatic",
    fuelType: "electric",
    location: "Chennai",
    pricePerDay: 3000,
    images: [],
    description: "A quiet electric option with modern cabin tech and low running cost for urban rentals.",
  },
  {
    name: "Toyota Innova HyCross GX",
    brand: "Toyota",
    model: "Innova HyCross GX",
    type: "van",
    year: 2024,
    seats: 8,
    transmission: "automatic",
    fuelType: "hybrid",
    location: "Mumbai",
    pricePerDay: 4800,
    images: [],
    description: "Built for group movement, airport transfers, and comfortable intercity family travel.",
  },
  {
    name: "Royal Enfield Meteor 350",
    brand: "Royal Enfield",
    model: "Meteor 350",
    type: "bike",
    year: 2024,
    seats: 2,
    transmission: "manual",
    fuelType: "petrol",
    location: "Goa",
    pricePerDay: 1400,
    images: [],
    description: "A relaxed cruiser bike for scenic coastal routes and easy weekend rides.",
  },
  {
    name: "BMW 330Li M Sport",
    brand: "BMW",
    model: "330Li M Sport",
    type: "luxury",
    year: 2024,
    seats: 5,
    transmission: "automatic",
    fuelType: "petrol",
    location: "Delhi",
    pricePerDay: 9500,
    images: [],
    description: "A premium long-wheelbase sedan for executive travel, events, and high-comfort rentals.",
  },
];

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

    for (const vehicle of sampleVehicles) {
      await Vehicle.findOneAndUpdate(
        { brand: vehicle.brand, model: vehicle.model },
        { $set: vehicle },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`Upserted ${sampleVehicles.length} sample vehicles.`);

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
