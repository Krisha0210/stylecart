import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Cart = () => {
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping Address State
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null); // stores created order data

  const handleInputChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckoutSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    navigate('/login?redirect=cart');
    return;
  }

  if (
    !shippingDetails.address ||
    !shippingDetails.city ||
    !shippingDetails.postalCode ||
    !shippingDetails.country
  ) {
    alert('Please fill out all shipping fields.');
    return;
  }

  try {
    setPlacingOrder(true);

    const orderPayload = {
      user: user._id,

      orderItems: cartItems,

      shippingAddress: shippingDetails,

      paymentMethod: 'Card',

      itemsPrice,

      taxPrice,

      shippingPrice,

      totalPrice,

      isPaid: false,

      isDelivered: false,
    };

    const { data } = await api.post('/orders', orderPayload);

    setOrderSuccess(data);

    clearCart();

    setPlacingOrder(false);

  } catch (error) {

    console.error('Checkout failed:', error);

    alert(
      error.response?.data?.message || 'Order creation failed'
    );

    setPlacingOrder(false);
  }
};
  // If order was successfully placed
  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="glass-panel p-10 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex justify-center text-violet-400">
            <CheckCircle2 size={64} className="animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-display text-slate-100">Order Placed Successfully!</h1>
            <p className="text-slate-400 text-sm">
              Thank you for shopping at StyleCart. Your transaction has been registered.
            </p>
          </div>

          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-900 text-left space-y-2 text-xs">
            <div>
              <span className="text-slate-500 font-semibold uppercase">Order Reference:</span>
              <span className="text-slate-350 ml-2 font-mono">{orderSuccess._id}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold uppercase">Total Amount:</span>
              <span className="text-violet-400 ml-2 font-bold">${orderSuccess.totalPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold uppercase">Deliver To:</span>
              <span className="text-slate-350 ml-2">
                {orderSuccess.shippingAddress.address}, {orderSuccess.shippingAddress.city}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              to="/products"
              className="bg-slate-900 hover:bg-slate-850 text-slate-300 font-semibold py-3 rounded-full text-xs border border-slate-800 transition-colors"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => {
                // If standard user, go to shop catalog, if admin, they can see in admin panel
                navigate(user.isAdmin ? '/admin' : '/products');
              }}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-full text-xs transition-colors shadow-lg shadow-violet-650/20"
            >
              {user.isAdmin ? 'Go to Admin Board' : 'View Catalog'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="glass-panel p-16 rounded-3xl max-w-lg mx-auto space-y-6">
          <div className="text-slate-600 flex justify-center">
            <ShoppingBag size={52} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-display text-slate-100">Your Shopping Cart is Empty</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Before checking out, you must add some products to your shopping cart.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors shadow-lg shadow-violet-600/10 cursor-pointer"
          >
            <span>Explore Store</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <h1 className="text-3xl font-bold font-display text-slate-100 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Item Listing List - Left */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4 sm:justify-between"
            >
              
              {/* Product Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-800/80 bg-slate-950"
                />
                <div>
                  <Link
                    to={`/products/${item.product}`}
                    className="font-semibold text-slate-200 hover:text-violet-400 transition-colors text-sm line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">Unit Price: ${item.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Adjustments & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-slate-900/50 sm:border-0 pt-3 sm:pt-0">
                
                {/* Quantity Select */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.product, Math.max(1, item.qty - 1))}
                    className="h-7 w-7 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center text-xs font-semibold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-200">{item.qty}</span>
                  <button
                    onClick={() => updateQuantity(item.product, Math.min(item.countInStock, item.qty + 1))}
                    className="h-7 w-7 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center text-xs font-semibold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-sm font-bold text-slate-200 w-16 text-right">
                  ${(item.price * item.qty).toFixed(2)}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="text-slate-550 hover:text-rose-400 p-1.5 rounded-lg border border-transparent hover:border-slate-800 transition-all cursor-pointer"
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary & Address Checkout - Right */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Summary calculations */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-850 space-y-4">
            <h3 className="text-slate-200 font-bold border-b border-slate-900 pb-3 text-sm uppercase tracking-wider">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs font-medium text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-slate-200">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fees</span>
                <span className="text-slate-200">
                  {shippingPrice === 0 ? <span className="text-emerald-400">Free</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="text-slate-200">${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-900 pt-4 text-sm font-bold text-slate-200">
              <span>Estimated Total</span>
              <span className="text-violet-400 font-display text-base">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout / User Address Forms */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-850">
            {user ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-slate-200 font-bold border-b border-slate-900 pb-3 text-sm uppercase tracking-wider">
                  Shipping Address
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={shippingDetails.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 text-slate-200 placeholder-slate-650"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={shippingDetails.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 text-slate-200 placeholder-slate-650"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={shippingDetails.postalCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 text-slate-200 placeholder-slate-650"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={shippingDetails.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 text-slate-200 placeholder-slate-650"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={placingOrder}
                  className="w-full bg-violet-650 hover:bg-violet-550 text-white font-bold py-3 rounded-full text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xl shadow-violet-650/20 active:scale-95 cursor-pointer mt-4"
                >
                  {placingOrder ? 'Processing...' : 'Place Order &amp; Checkout'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="text-slate-500"><ShieldCheck size={32} className="mx-auto" /></div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Please sign in to your StyleCart account to enter shipping address details and place your order.
                </p>
                <Link
                  to="/login?redirect=cart"
                  className="block bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-full text-xs transition-colors cursor-pointer"
                >
                  Sign In to Place Order
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;
