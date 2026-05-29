import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Products from './models/Product.js';
import Order from './models/Order.js';

import { mockDb } from './config/mockDb.js';

dotenv.config();

const products = [
  // APPAREL
  {
    name: 'Classic Leather Jacket',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    description: 'Timeless outerwear crafted from premium full-grain leather. Features signature silver hardware, functional zip pockets, and a tailored fit that only gets better with age.',
    category: 'Apparel',
    price: 129.99,
    countInStock: 15,
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: 'Vintage Crewneck Sweatshirt',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-soft fleece cotton sweater with a relaxed vintage fit. Perfect for layering during cooler seasons or lounging around in ultimate comfort.',
    category: 'Apparel',
    price: 49.99,
    countInStock: 30,
    rating: 4.5,
    numReviews: 15,
  },
  {
    name: 'Minimalist Linen Shirt',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    description: 'Breathable and lightweight shirt made from 100% organic linen. Designed with a clean band collar, single chest pocket, and relaxed sleeves.',
    category: 'Apparel',
    price: 39.99,
    countInStock: 20,
    rating: 4.3,
    numReviews: 9,
  },
  {
    name: 'Slim Fit Denim Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
    description: 'Premium stretch denim in a versatile medium wash. Designed with a slim, modern leg opening and classic five-pocket configuration.',
    category: 'Apparel',
    price: 59.99,
    countInStock: 25,
    rating: 4.6,
    numReviews: 18,
  },
  // ELECTRONICS
  {
    name: 'Active Noise Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Immerse yourself in pure sound. These wireless headphones deliver state-of-the-art hybrid noise cancelling, up to 40 hours of battery life, and high-fidelity acoustics.',
    category: 'Electronics',
    price: 199.99,
    countInStock: 10,
    rating: 4.9,
    numReviews: 42,
  },
  {
    name: 'Minimalist Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: 'Compact 75% layout keyboard with hot-swappable linear switches, gorgeous pastel keycaps, and customizable RGB backlighting. Built for speed and productivity.',
    category: 'Electronics',
    price: 89.99,
    countInStock: 8,
    rating: 4.7,
    numReviews: 29,
  },
  {
    name: 'Portable Wireless Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    description: 'Waterproof IPX7 speaker with 360-degree sound distribution and punchy bass. Small enough to fit in your bag, loud enough to fill a room.',
    category: 'Electronics',
    price: 79.99,
    countInStock: 12,
    rating: 4.4,
    numReviews: 14,
  },
  {
    name: 'Wireless Ergonomic Mouse',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    description: 'Sculpted mouse built for comfortable scrolling and tracking. Features dual-mode wireless connectivity and programmable side navigation buttons.',
    category: 'Electronics',
    price: 49.99,
    countInStock: 18,
    rating: 4.5,
    numReviews: 11,
  },
  // ACCESSORIES
  {
    name: 'Classic Chronograph Watch',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80',
    description: 'A stately timepiece featuring a dark brushed stainless-steel casing, black dial, calendar window, and a genuine brown leather strap.',
    category: 'Accessories',
    price: 149.99,
    countInStock: 7,
    rating: 4.7,
    numReviews: 31,
  },
  {
    name: 'Premium Leather Wallet',
    image: 'https://images.unsplash.com/photo-1627124118303-624c8f57008f?w=600&auto=format&fit=crop&q=80',
    description: 'Bi-fold pocket wallet made from vegetable-tanned leather. RFID-blocking layer built-in with 6 card slots and a dedicated cash sleeve.',
    category: 'Accessories',
    price: 34.99,
    countInStock: 40,
    rating: 4.6,
    numReviews: 20,
  },
  {
    name: 'Retro Matte Sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    description: 'Polarized lenses with 100% UV protection inside a durable, lightweight matte black polycarbonate frame. Timeless square silhouette.',
    category: 'Accessories',
    price: 24.99,
    countInStock: 50,
    rating: 4.2,
    numReviews: 8,
  },
  {
    name: 'Canvas Travel Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'Heavy-duty water-resistant canvas backpack with magnetic leather straps, padded 15.6-inch laptop pocket, and spacious secondary compartments.',
    category: 'Accessories',
    price: 69.99,
    countInStock: 14,
    rating: 4.7,
    numReviews: 27,
  },
  // HOME & LIVING
  {
    name: 'Scented Soy Candle Set',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
    description: 'Three hand-poured soy candles infused with essential oils of Sandalwood, Lavender, and Fig. Burns cleanly for up to 45 hours per jar.',
    category: 'Home & Living',
    price: 19.99,
    countInStock: 60,
    rating: 4.5,
    numReviews: 35,
  },
  {
    name: 'Ceramic Matte Mug',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    description: 'Handmade stoneware mug glazed in a subtle off-white matte. Designed with an ergonomic oversized loop handle for cozy mornings.',
    category: 'Home & Living',
    price: 14.99,
    countInStock: 100,
    rating: 4.8,
    numReviews: 52,
  },
  {
    name: 'Double-Walled Glass Carafe',
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&auto=format&fit=crop&q=80',
    description: 'Insulated borosilicate glass carafe that keeps hot drinks warm and iced tea chilled. Pouring lid prevents spills and filters ice.',
    category: 'Home & Living',
    price: 29.99,
    countInStock: 15,
    rating: 4.6,
    numReviews: 12,
  },
  {
    name: 'Waffle Weave Throw Blanket',
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600&auto=format&fit=crop&q=80',
    description: 'Woven throw blanket made from 100% pre-washed organic cotton. Standard waffle texture makes it highly breathable yet warm and cozy.',
    category: 'Home & Living',
    price: 44.99,
    countInStock: 22,
    rating: 4.7,
    numReviews: 19,
  },
];

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stylecart');
    console.log(`MongoDB Connected for Seeding: ${conn.connection.host}`);

    // Clear existing database collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Database cleared of old records.');

    // Hash passwords for seed accounts
    const userPassword = await bcrypt.hash('user123456', 10);
    const adminPassword = await bcrypt.hash('admin123456', 10);

    // Create users
    const createdUsers = await User.insertMany([
      {
        name: 'Jane Doe',
        email: 'user@stylecart.com',
        password: userPassword,
        isAdmin: false,
      },
      {
        name: 'StyleCart Admin',
        email: 'admin@stylecart.com',
        password: adminPassword,
        isAdmin: true,
      },
    ]);

    const adminUser = createdUsers.find(u => u.isAdmin)._id;

    // Attach admin user id to products
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Database successfully seeded with Users and Products!');
    process.exit(0);
  } catch (error) {
    console.warn(`\n⚠️  MongoDB connection failed during seeding: ${error.message}`);
    console.warn('⚠️  Falling back to seeding the offline local JSON database (backend/data/mock_db.json)...');
    
    try {
      mockDb.reset();
      console.log('Offline database successfully seeded with Users and Products!');
      process.exit(0);
    } catch (err) {
      console.error(`Mock database seeding failed: ${err.message}`);
      process.exit(1);
    }
  }
};

seedData();
