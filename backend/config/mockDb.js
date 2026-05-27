import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const __dirname = path.resolve();
const DB_FILE = path.join(__dirname, 'data', 'mock_db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial seed products (same as in seed.js)
const initialProducts = [
  {
    _id: 'prod_1',
    name: 'Classic Leather Jacket',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    description: 'Timeless outerwear crafted from premium full-grain leather. Features signature silver hardware, functional zip pockets, and a tailored fit that only gets better with age.',
    category: 'Apparel',
    price: 129.99,
    countInStock: 15,
    rating: 4.8,
    numReviews: 24,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_2',
    name: 'Vintage Crewneck Sweatshirt',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-soft fleece cotton sweater with a relaxed vintage fit. Perfect for layering during cooler seasons or lounging around in ultimate comfort.',
    category: 'Apparel',
    price: 49.99,
    countInStock: 30,
    rating: 4.5,
    numReviews: 15,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_3',
    name: 'Minimalist Linen Shirt',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    description: 'Breathable and lightweight shirt made from 100% organic linen. Designed with a clean band collar, single chest pocket, and relaxed sleeves.',
    category: 'Apparel',
    price: 39.99,
    countInStock: 20,
    rating: 4.3,
    numReviews: 9,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_4',
    name: 'Slim Fit Denim Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
    description: 'Premium stretch denim in a versatile medium wash. Designed with a slim, modern leg opening and classic five-pocket configuration.',
    category: 'Apparel',
    price: 59.99,
    countInStock: 25,
    rating: 4.6,
    numReviews: 18,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_5',
    name: 'Active Noise Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Immerse yourself in pure sound. These wireless headphones deliver state-of-the-art hybrid noise cancelling, up to 40 hours of battery life, and high-fidelity acoustics.',
    category: 'Electronics',
    price: 199.99,
    countInStock: 10,
    rating: 4.9,
    numReviews: 42,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_6',
    name: 'Minimalist Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: 'Compact 75% layout keyboard with hot-swappable linear switches, gorgeous pastel keycaps, and customizable RGB backlighting. Built for speed and productivity.',
    category: 'Electronics',
    price: 89.99,
    countInStock: 8,
    rating: 4.7,
    numReviews: 29,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_7',
    name: 'Portable Wireless Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    description: 'Waterproof IPX7 speaker with 360-degree sound distribution and punchy bass. Small enough to fit in your bag, loud enough to fill a room.',
    category: 'Electronics',
    price: 79.99,
    countInStock: 12,
    rating: 4.4,
    numReviews: 14,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_8',
    name: 'Wireless Ergonomic Mouse',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    description: 'Sculpted mouse built for comfortable scrolling and tracking. Features dual-mode wireless connectivity and programmable side navigation buttons.',
    category: 'Electronics',
    price: 49.99,
    countInStock: 18,
    rating: 4.5,
    numReviews: 11,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_9',
    name: 'Classic Chronograph Watch',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80',
    description: 'A stately timepiece featuring a dark brushed stainless-steel casing, black dial, calendar window, and a genuine brown leather strap.',
    category: 'Accessories',
    price: 149.99,
    countInStock: 7,
    rating: 4.7,
    numReviews: 31,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  
  {
    _id: 'prod_11',
    name: 'Retro Matte Sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    description: 'Polarized lenses with 100% UV protection inside a durable, lightweight matte black polycarbonate frame. Timeless square silhouette.',
    category: 'Accessories',
    price: 24.99,
    countInStock: 50,
    rating: 4.2,
    numReviews: 8,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_12',
    name: 'Canvas Travel Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'Heavy-duty water-resistant canvas backpack with magnetic leather straps, padded 15.6-inch laptop pocket, and spacious secondary compartments.',
    category: 'Accessories',
    price: 69.99,
    countInStock: 14,
    rating: 4.7,
    numReviews: 27,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_13',
    name: 'Scented Soy Candle Set',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
    description: 'Three hand-poured soy candles infused with essential oils of Sandalwood, Lavender, and Fig. Burns cleanly for up to 45 hours per jar.',
    category: 'Home & Living',
    price: 19.99,
    countInStock: 60,
    rating: 4.5,
    numReviews: 35,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_14',
    name: 'Ceramic Matte Mug',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    description: 'Handmade stoneware mug glazed in a subtle off-white matte. Designed with an oversized loop handle for cozy mornings.',
    category: 'Home & Living',
    price: 14.99,
    countInStock: 100,
    rating: 4.8,
    numReviews: 52,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
 
  {
    _id: 'prod_16',
    name: 'Waffle Weave Throw Blanket',
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600&auto=format&fit=crop&q=80',
    description: 'Woven throw blanket made from 100% pre-washed organic cotton. Standard waffle texture makes it highly breathable yet warm and cozy.',
    category: 'Home & Living',
    price: 44.99,
    countInStock: 22,
    rating: 4.7,
    numReviews: 19,
    user: 'usr_admin',
    createdAt: new Date().toISOString(),
  },
];

// Helper to read database file
const readDB = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Create with initial structure
      const salt = bcrypt.genSaltSync(10);
      const adminPassword = bcrypt.hashSync('admin123456', salt);
      const userPassword = bcrypt.hashSync('user123456', salt);

      const initialData = {
        users: [
          {
            _id: 'usr_user',
            name: 'Jane Doe',
            email: 'user@stylecart.com',
            password: userPassword,
            isAdmin: false,
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'usr_admin',
            name: 'StyleCart Admin',
            email: 'admin@stylecart.com',
            password: adminPassword,
            isAdmin: true,
            createdAt: new Date().toISOString(),
          },
        ],
        products: initialProducts,
        orders: [],
      };

      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }

    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read mock DB file:', err);
    return { users: [], products: [], orders: [] };
  }
};

// Helper to write database file
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write mock DB file:', err);
  }
};

// Mock Models API
export const mockDb = {
  reset: () => {
    if (fs.existsSync(DB_FILE)) {
      fs.unlinkSync(DB_FILE);
    }
    return readDB();
  },

  users: {
    find: () => readDB().users,
    findOne: (filter) => {
      const db = readDB();
      return db.users.find(u => u.email === filter.email) || null;
    },
    findById: (id) => {
      const db = readDB();
      return db.users.find(u => u._id === id) || null;
    },
    create: (userData) => {
      const db = readDB();
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(userData.password, salt);
      
      const newUser = {
        _id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        isAdmin: userData.isAdmin || false,
        createdAt: new Date().toISOString(),
      };
      
      db.users.push(newUser);
      writeDB(db);
      return newUser;
    }
  },

  products: {
    find: (filter = {}) => {
      const db = readDB();
      let list = db.products;

      if (filter.category) {
        list = list.filter(p => p.category === filter.category);
      }
      if (filter.keyword) {
        const regex = new RegExp(filter.keyword, 'i');
        list = list.filter(p => regex.test(p.name) || regex.test(p.description));
      }
      return list;
    },
    findById: (id) => {
      const db = readDB();
      return db.products.find(p => p._id === id) || null;
    },
    create: (productData) => {
      const db = readDB();
      const newProduct = {
        _id: 'prod_' + Math.random().toString(36).substring(2, 9),
        name: productData.name,
        image: productData.image,
        description: productData.description,
        category: productData.category,
        price: productData.price,
        countInStock: productData.countInStock,
        rating: 4.5,
        numReviews: 1,
        user: productData.user,
        createdAt: new Date().toISOString(),
      };
      db.products.unshift(newProduct);
      writeDB(db);
      return newProduct;
    },
    update: (id, productData) => {
      const db = readDB();
      const idx = db.products.findIndex(p => p._id === id);
      if (idx !== -1) {
        db.products[idx] = {
          ...db.products[idx],
          ...productData,
          updatedAt: new Date().toISOString(),
        };
        writeDB(db);
        return db.products[idx];
      }
      return null;
    },
    delete: (id) => {
      const db = readDB();
      const initialLength = db.products.length;
      db.products = db.products.filter(p => p._id !== id);
      writeDB(db);
      return db.products.length !== initialLength;
    }
  },

  orders: {
    find: (filter = {}) => {
      const db = readDB();
      let list = db.orders;
      
      if (filter.user) {
        list = list.filter(o => o.user._id === filter.user || o.user === filter.user);
      }
      return list;
    },
    findById: (id) => {
      const db = readDB();
      return db.orders.find(o => o._id === id) || null;
    },
    create: (orderData) => {
      const db = readDB();
      
      const newOrder = {
        _id: 'ord_' + Math.random().toString(36).substring(2, 9),
        user: orderData.user, // will be resolved to object during fetch/populate
        orderItems: orderData.orderItems,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod || 'Card',
        itemsPrice: orderData.itemsPrice,
        taxPrice: orderData.taxPrice,
        shippingPrice: orderData.shippingPrice,
        totalPrice: orderData.totalPrice,
        isPaid: false,
        isDelivered: false,
        createdAt: new Date().toISOString(),
      };
      
      db.orders.unshift(newOrder);
      writeDB(db);
      return newOrder;
    },
    deliver: (id) => {
      const db = readDB();
      const idx = db.orders.findIndex(o => o._id === id);
      if (idx !== -1) {
        db.orders[idx].isDelivered = true;
        db.orders[idx].deliveredAt = new Date().toISOString();
        writeDB(db);
        return db.orders[idx];
      }
      return null;
    }
  }
};
