import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';
import { mockDb } from '../config/mockDb.js';

const router = express.Router();

// @desc    Fetch all products (with search & category filtering)
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    if (global.isMockDB) {
      const products = mockDb.products.find({
        keyword: req.query.keyword,
        category: req.query.category,
      });
      res.json(products);
      return;
    }

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category
      ? {
          category: req.query.category,
        }
      : {};

    // Combine filters
    const filter = { ...keyword, ...category };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    if (global.isMockDB) {
      const product = mockDb.products.findById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404);
        throw new Error('Product not found');
      }
      return;
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;

    if (!name || !price || !description || !image || !category) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    if (global.isMockDB) {
      const createdProduct = mockDb.products.create({
        name,
        price,
        description,
        image,
        category,
        countInStock,
        user: req.user._id,
      });
      res.status(201).json(createdProduct);
      return;
    }

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      countInStock: countInStock || 0,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
});

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;

    if (global.isMockDB) {
      const updatedProduct = mockDb.products.update(req.params.id, {
        name,
        price,
        description,
        image,
        category,
        countInStock,
      });
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404);
        throw new Error('Product not found');
      }
      return;
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    if (global.isMockDB) {
      const success = mockDb.products.delete(req.params.id);
      if (success) {
        res.json({ message: 'Product removed' });
      } else {
        res.status(404);
        throw new Error('Product not found');
      }
      return;
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
