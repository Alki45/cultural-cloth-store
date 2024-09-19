import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [acceptedOrders, setAcceptedOrders] = useState(0);
  const [declinedOrders, setDeclinedOrders] = useState(0);
  const [orders, setOrders] = useState([]);
  const [showMeasurements, setShowMeasurements] = useState({});

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const total = ordersData.length;
      const pending = ordersData.filter(order => order.orderDetails.status === 'Pending').length;
      const accepted = ordersData.filter(order => order.orderDetails.status === 'Accepted').length;
      const declined = ordersData.filter(order => order.orderDetails.status === 'Declined').length;

      setTotalOrders(total);
      setPendingOrders(pending);
      setAcceptedOrders(accepted);
      setDeclinedOrders(declined);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { 'orderDetails.status': 'Accepted' });
      fetchOrderData();
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  const handleDecline = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { 'orderDetails.status': 'Declined' });
      fetchOrderData();
    } catch (error) {
      console.error('Error declining order:', error);
    }
  };

  const toggleMeasurements = (orderId) => {
    setShowMeasurements((prevShowMeasurements) => ({
      ...prevShowMeasurements,
      [orderId]: !prevShowMeasurements[orderId],
    }));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="d-flex justify-content-between mb-4">
        <div>
          <p>Total Orders: {totalOrders}</p>
          <p>Pending Orders: {pendingOrders}</p>
          <p>Accepted Orders: {acceptedOrders}</p>
          <p>Declined Orders: {declinedOrders}</p>
        </div>
        <div>
          <button className="btn btn-primary mr-3" onClick={() => navigate("/product")}>
            Manage Products
          </button>
        </div>
      </div>
      <h2>Orders</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Price</th>
            <th>Order Date</th>
            <th>Delivery Date</th>
            <th>Status</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Other Info</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <tr>
                <td>{order.customerInfo?.name}</td>
                <td>{order.orderDetails?.productType}</td>
                <td>{order.orderDetails?.quantity}</td>
                <td>{order.orderDetails?.totalPrice}</td>
                <td>{order.orderDetails?.pricePerUnit}</td>
                <td>{order.orderDate}</td>
                <td>{order.deliveryDate}</td>
                <td>{order.orderDetails?.status}</td>
                <td>{order.customerInfo?.address}</td>
                <td>{order.customerInfo?.phoneNumber}</td>
                <td>{order.otherInfo}</td>
                <td>
                  {order.orderDetails?.status === 'Pending' && (
                    <>
                      <button
                        className="btn btn-success mr-2"
                        onClick={() => handleApprove(order.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDecline(order.id)}
                      >
                        Decline
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-info"
                    onClick={() => toggleMeasurements(order.id)}
                  >
                    {showMeasurements[order.id] ? 'Hide Measurements' : 'View Measurements'}
                  </button>
                </td>
              </tr>
              {showMeasurements[order.id] && order.measurements && (
                <tr>
                  <td colSpan="12">
                    <h4>Measurements</h4>
                    <table className="table">
                      <tbody>
                        {Object.entries(order.measurements).map(([type, details]) => (
                          <React.Fragment key={type}>
                            <tr>
                              <td colSpan="2"><strong>{type.charAt(0).toUpperCase() + type.slice(1)}</strong></td>
                            </tr>
                            {Object.entries(details).map(([key, value]) => (
                              <tr key={key}>
                                <td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</td>
                                <td>{value}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminDashboard;
