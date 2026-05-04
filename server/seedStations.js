import mongoose from "mongoose";
import dotenv from "dotenv";
import Station from "./models/Station.js";

dotenv.config();

const stations = [
  {
    name: "Police Station Hapur Nagar",
    address: "Free Ganj, Road, Hapur, Uttar Pradesh 245101",
    phone: "0122 230 4642",
    location: { type: "Point", coordinates: [77.7774, 28.7306] }
  },
  {
    name: "Police Station Pilkhuwa",
    address: "Hapur Rd, Pilkhuwa, Uttar Pradesh 245304",
    phone: "0122 232 2011",
    location: { type: "Point", coordinates: [77.6565, 28.7115] }
  },
  {
    name: "Police Station Babugarh",
    address: "Babugarh, Cantt, Hapur, Uttar Pradesh 245201",
    phone: "0122 231 1007",
    location: { type: "Point", coordinates: [77.8398, 28.7161] }
  },
  {
    name: "Hafizpur Police Station",
    address: "Hafizpur, Hapur, Uttar Pradesh 245101",
    phone: "0122 230 3302",
    location: { type: "Point", coordinates: [77.7594, 28.6750] }
  },
  {
    name: "Gulaothi Police Station",
    address: "Gulaothi, Bulandshahr, Uttar Pradesh 203408",
    phone: "05732 237 021",
    location: { type: "Point", coordinates: [77.7891, 28.5919] }
  },
  {
    name: "South Delhi Police Station",
    address: "Hauz Khas, New Delhi, Delhi 110016",
    phone: "011 2685 8474",
    location: { type: "Point", coordinates: [77.2104, 28.5442] }
  },
  {
    name: "Parliament Street Police Station",
    address: "Sansad Marg, New Delhi, Delhi 110001",
    phone: "011 2336 1252",
    location: { type: "Point", coordinates: [77.2157, 28.6291] }
  },
  {
    name: "Chanakyapuri Police Station",
    address: "Niti Marg, Chanakyapuri, New Delhi, Delhi 110021",
    phone: "011 2301 3232",
    location: { type: "Point", coordinates: [77.1919, 28.5933] }
  },
  {
    name: "Connaught Place Police Station",
    address: "New Delhi, Delhi 110001",
    phone: "011 2334 1000",
    location: { type: "Point", coordinates: [77.2195, 28.6328] }
  },
  {
    name: "Indirapuram Police Station",
    address: "Niti Khand I, Indirapuram, Ghaziabad, Uttar Pradesh 201014",
    phone: "0120 412 1000",
    location: { type: "Point", coordinates: [77.3735, 28.6441] }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing stations
    await Station.deleteMany({});
    console.log("Existing stations cleared.");

    // Insert new stations
    await Station.insertMany(stations);
    console.log(`${stations.length} stations seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
