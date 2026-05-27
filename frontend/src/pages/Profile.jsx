import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/user/${user._id}`
        );

        const data = await res.json();

        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="p-8 text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 text-white">

      <h1 className="text-3xl font-bold mb-8">
        My Profile
      </h1>

      <div className="bg-slate-900 p-6 rounded-xl mb-8">

        <h2 className="text-xl font-semibold">
          {user.name}
        </h2>

        <p className="text-slate-400">
          {user.email}
        </p>

      </div>

      <h2 className="text-2xl mb-4">
        My Orders
      </h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-slate-900 p-4 rounded-xl">
          No orders found
        </div>
      ) : (
        <div className="space-y-4">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-slate-900 p-5 rounded-xl"
            >

              <p>
                Order ID: {order._id}
              </p>

              <p>
                Total: ${order.totalPrice}
              </p>

              <p>
                Paid: {order.isPaid ? "Yes" : "No"}
              </p>

              <p>
                Delivered: {order.isDelivered ? "Yes" : "No"}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Profile;