import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Check,
  TrendingUp,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State for Create/Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Apparel',
    countInStock: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [resProducts, resOrders] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
      ]);

      setProducts(resProducts.data);
      setOrders(resOrders.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load database records');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchData();
    }
  }, [user]);

  // Product CRUD Handlers
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setProductForm({
      name: '',
      price: '',
      description: '',
      image: '',
      category: 'Apparel',
      countInStock: '',
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setSelectedProductId(product._id);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      countInStock: product.countInStock,
    });
    setShowProductModal(true);
  };

  const handleFormInputChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        countInStock: Number(productForm.countInStock),
      };

      if (modalMode === 'create') {
        await api.post('/products', payload);
      } else {
        await api.put(`/products/${selectedProductId}`, payload);
      }

      setShowProductModal(false);
      fetchData(); // Reload list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product details');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchData(); // Reload list
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  // Order Delivery Handler
  const handleDeliverOrder = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      fetchData(); // Reload list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update delivery status');
    }
  };

  // Overview calculations
  const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const averageOrderValue = orders.length > 0 ? totalSales / orders.length : 0;
  const outOfStockItems = products.filter((p) => p.countInStock === 0).length;

  if (!user || !user.isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-100 mb-1">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage StyleCart catalog products, adjust stocks, and ship customer orders.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-violet-650 hover:bg-violet-550 text-white text-xs font-bold px-5 py-3 rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-violet-650/15 cursor-pointer self-start"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-905 mb-8">
        {['overview', 'products', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold border-b-2 capitalize transition-colors cursor-pointer ${
              activeTab === tab
                ? 'border-violet-500 text-violet-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading & Error Overlays */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse text-sm">
          Loading dashboard metrics...
        </div>
      ) : error ? (
        <div className="glass-panel p-10 max-w-md mx-auto text-center border border-rose-950/20 text-rose-450 text-sm">
          <AlertCircle size={32} className="mx-auto mb-3 text-rose-400" />
          <p className="font-semibold mb-2">Error Connecting to Server</p>
          <p className="text-slate-450 text-xs mb-4">{error}</p>
          <button onClick={fetchData} className="bg-slate-900 border border-slate-800 text-xs px-4 py-2 rounded-lg cursor-pointer">
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* KPI 1 */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="bg-violet-600/10 border border-violet-500/20 p-3.5 rounded-xl text-violet-400 shrink-0">
                    <DollarSign size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Sales</p>
                    <h3 className="text-xl font-bold font-display text-slate-200">${totalSales.toFixed(2)}</h3>
                  </div>
                </div>

                {/* KPI 2 */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="bg-violet-600/10 border border-violet-500/20 p-3.5 rounded-xl text-violet-400 shrink-0">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Orders</p>
                    <h3 className="text-xl font-bold font-display text-slate-200">{orders.length}</h3>
                  </div>
                </div>

                {/* KPI 3 */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="bg-violet-600/10 border border-violet-500/20 p-3.5 rounded-xl text-violet-400 shrink-0">
                    <Package size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Catalog Items</p>
                    <h3 className="text-xl font-bold font-display text-slate-200">{products.length}</h3>
                  </div>
                </div>

                {/* KPI 4 */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl text-rose-450 shrink-0">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Out of Stock</p>
                    <h3 className="text-xl font-bold font-display text-rose-400">{outOfStockItems}</h3>
                  </div>
                </div>

              </div>

              {/* Secondary details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="glass-panel p-6 rounded-2xl border border-slate-850">
                  <h3 className="text-slate-200 font-bold border-b border-slate-900 pb-3 text-xs uppercase tracking-wider mb-4">
                    Sales Statistics Overview
                  </h3>
                  <div className="space-y-3 text-xs font-semibold text-slate-400">
                    <div className="flex justify-between">
                      <span>Average Order Value:</span>
                      <span className="text-slate-200">${averageOrderValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Deliveries:</span>
                      <span className="text-emerald-400">
                        {orders.filter((o) => o.isDelivered).length} / {orders.length} orders
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-slate-850">
                  <h3 className="text-slate-200 font-bold border-b border-slate-900 pb-3 text-xs uppercase tracking-wider mb-4">
                    Quick Stock Status Checks
                  </h3>
                  <div className="max-h-32 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                    {products.slice(0, 5).map((p) => (
                      <div key={p._id} className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400 truncate max-w-xs">{p.name}</span>
                        <span className={p.countInStock === 0 ? 'text-rose-400' : p.countInStock <= 5 ? 'text-amber-400' : 'text-slate-500'}>
                          {p.countInStock} available
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PRODUCT CRUD MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                      <th className="p-4">Image</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">In Stock</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-slate-850/80 font-medium">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-slate-900/30 transition-colors">
                        
                        <td className="p-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-800"
                          />
                        </td>
                        
                        <td className="p-4 text-slate-200 font-semibold truncate max-w-[200px]" title={product.name}>
                          {product.name}
                        </td>
                        
                        <td className="p-4 text-slate-400">
                          {product.category}
                        </td>
                        
                        <td className="p-4 font-bold text-slate-200">
                          ${product.price.toFixed(2)}
                        </td>
                        
                        <td className="p-4">
                          <span className={product.countInStock === 0 ? 'text-rose-400 font-bold' : product.countInStock <= 5 ? 'text-amber-400 font-bold' : 'text-slate-450'}>
                            {product.countInStock}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="text-violet-400 hover:text-violet-300 p-1.5 rounded-lg border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDER LOGS */}
          {activeTab === 'orders' && (
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Purchasing Customer</th>
                      <th className="p-4">Placed Date</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Delivered</th>
                      <th className="p-4 text-center">Status Action</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-slate-850/80 font-medium">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-900/30 transition-colors">
                        
                        <td className="p-4 font-mono text-slate-350" title={order._id}>
                          {order._id.substring(0, 10)}...
                        </td>
                        
                        <td className="p-4 text-slate-200">
                          {order.user ? order.user.name : <span className="text-slate-500">Deleted User</span>}
                        </td>
                        
                        <td className="p-4 text-slate-455">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        
                        <td className="p-4 text-slate-200 font-bold">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        
                        <td className="p-4">
                          {order.isDelivered ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">
                              <Check size={10} />
                              <span>Delivered</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/15">
                              <span>Pending</span>
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          {!order.isDelivered ? (
                            <button
                              onClick={() => handleDeliverOrder(order._id)}
                              className="bg-violet-650/15 hover:bg-violet-650 text-violet-400 hover:text-white px-3 py-1.5 rounded-full border border-violet-550/25 hover:border-transparent transition-all cursor-pointer font-bold"
                            >
                              Mark Delivered
                            </button>
                          ) : (
                            <span className="text-slate-500 text-xs">Closed</span>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal for Product Creation / Editing */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          
          {/* Backdrop overlay */}
          <div
            onClick={() => setShowProductModal(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          ></div>

          {/* Modal content */}
          <div className="glass-panel-heavy border border-slate-800 rounded-3xl w-full max-w-lg p-6 relative z-10 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h3 className="text-lg font-bold font-display text-slate-200 capitalize">
                {modalMode === 'create' ? 'Create New Catalog Item' : 'Update Catalog Item'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-slate-500 hover:text-slate-350 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={productForm.name}
                    onChange={handleFormInputChange}
                    placeholder="Classic T-Shirt"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-550"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    value={productForm.price}
                    onChange={handleFormInputChange}
                    placeholder="29.99"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-550"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Category Collection
                  </label>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleFormInputChange}
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-555"
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    required
                    value={productForm.countInStock}
                    onChange={handleFormInputChange}
                    placeholder="25"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-550"
                  />
                </div>

              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  required
                  value={productForm.image}
                  onChange={handleFormInputChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-550"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Product Description
                </label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  value={productForm.description}
                  onChange={handleFormInputChange}
                  placeholder="Write descriptive marketing details here..."
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-550 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="bg-slate-900 hover:bg-slate-850 text-slate-400 font-semibold px-4 py-2 rounded-xl text-xs border border-slate-850 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-650 hover:bg-violet-550 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-violet-655/15 cursor-pointer"
                >
                  {modalMode === 'create' ? 'Add Product' : 'Save Details'}
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
