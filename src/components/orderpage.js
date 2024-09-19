import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { db } from '../firebase'; // Import the Firestore instance
import { collection, getDocs, addDoc } from 'firebase/firestore';

const OrderForm = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
  });

  const [orderDetails, setOrderDetails] = useState({
    productType: '',
    quantity: 0,
    pricePerUnit: 0,
    totalPrice: 0,
    status: 'Pending',
  });

  const [showFemaleMeasurements, setShowFemaleMeasurements] = useState(false);
  const [showMaleMeasurements, setShowMaleMeasurements] = useState(false);
  const [femaleMeasurements, setFemaleMeasurements] = useState({
    shoulder: '',
    upperBust: '',
    bust: '',
    underBust: '',
    waist: '',
    hip: '',
    skirtLength: '',
    frontLengthChest: '',
    frontLengthBust: '',
    frontLengthUnderBust: '',
    frontLengthWaistline: '',
    sleeveLength: '',
    forearmPerimeter: '',
  });

  const [maleMeasurements, setMaleMeasurements] = useState({
    shoulder: '',
    sleeveLength: '',
    chest: '',
    naturalWaist: '',
    seat: '',
    backLength: '',
    trouserWaist: '',
    outsideLeg: '',
    insideLeg: '',
    hem: '',
    waistcoatLength: '',
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setOrders(ordersData);
    };

    fetchOrders();
  }, []);

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleOrderDetailsChange = (field, value) => {
    setOrderDetails(prev => {
      const updatedDetails = { ...prev, [field]: value };
      if (field === 'quantity' || field === 'pricePerUnit') {
        updatedDetails.totalPrice = updatedDetails.quantity * updatedDetails.pricePerUnit;
      }
      return updatedDetails;
    });
  };

  const handleFemaleMeasurementsChange = (field, value) => {
    setFemaleMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleMaleMeasurementsChange = (field, value) => {
    setMaleMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const toggleFemaleMeasurements = () => {
    setShowFemaleMeasurements(prev => !prev);
    setShowMaleMeasurements(false);
  };

  const toggleMaleMeasurements = () => {
    setShowMaleMeasurements(prev => !prev);
    setShowFemaleMeasurements(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'orders'), {
        customerInfo,
        orderDetails,
        measurements: showFemaleMeasurements ? femaleMeasurements : maleMeasurements,
      });
      console.log('Form submitted successfully!');

      // Reset form fields after submission
      setCustomerInfo({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
      });
      setOrderDetails({
        productType: '',
        quantity: 0,
        pricePerUnit: 0,
        totalPrice: 0,
        status: 'Pending',
      });
      setFemaleMeasurements({
        shoulder: '',
        upperBust: '',
        bust: '',
        underBust: '',
        waist: '',
        hip: '',
        skirtLength: '',
        frontLengthChest: '',
        frontLengthBust: '',
        frontLengthUnderBust: '',
        frontLengthWaistline: '',
        sleeveLength: '',
        forearmPerimeter: '',
      });
      setMaleMeasurements({
        shoulder: '',
        sleeveLength: '',
        chest: '',
        naturalWaist: '',
        seat: '',
        backLength: '',
        trouserWaist: '',
        outsideLeg: '',
        insideLeg: '',
        hem: '',
        waistcoatLength: '',
      });
      setShowFemaleMeasurements(false);
      setShowMaleMeasurements(false);

      // Fetch updated orders
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Order Form</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h3>Customer Information</h3>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              value={customerInfo.name}
              onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              className="form-control"
              value={customerInfo.address}
              onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              className="form-control"
              value={customerInfo.phoneNumber}
              onChange={(e) => handleCustomerInfoChange('phoneNumber', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              value={customerInfo.email}
              onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Product Type:</label>
          <input
            type="text"
            className="form-control"
            value={orderDetails.productType}
            onChange={(e) => handleOrderDetailsChange('productType', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            className="form-control"
            value={orderDetails.quantity}
            onChange={(e) => handleOrderDetailsChange('quantity', parseInt(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Price per Unit:</label>
          <input
            type="number"
            className="form-control"
            value={orderDetails.pricePerUnit}
            onChange={(e) => handleOrderDetailsChange('pricePerUnit', parseFloat(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Total Price:</label>
          <input
            type="number"
            className="form-control"
            value={orderDetails.totalPrice}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Order Status:</label>
          <input
            type="text"
            className="form-control"
            value={orderDetails.status}
            onChange={(e) => handleOrderDetailsChange('status', e.target.value)}
          />
        </div>

        <Button variant="secondary" onClick={toggleFemaleMeasurements} className="mr-2">
          Put your size here if you are Female
        </Button>
        <Button variant="secondary" onClick={toggleMaleMeasurements}>
          Put your size here if you are Male
        </Button>

        {showFemaleMeasurements && (
          <div className="mt-4">
            <h3>Female Measurements</h3>
            {Object.keys(femaleMeasurements).map((key) => (
              <div className="form-group" key={key}>
                <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(' ', ' ').replace('length', 'Length').replace('perimeter', 'Perimeter')}:</label>
                <input
                  type="text"
                  className="form-control"
                  value={femaleMeasurements[key]}
                  onChange={(e) => handleFemaleMeasurementsChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {showMaleMeasurements && (
          <div className="mt-4">
            <h3>Male Measurements</h3>
            {Object.keys(maleMeasurements).map((key) => (
              <div className="form-group" key={key}>
                <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(' ', ' ').replace('length', 'Length').replace('waist', 'Waist')}:</label>
                <input
                  type="text"
                  className="form-control"
                  value={maleMeasurements[key]}
                  onChange={(e) => handleMaleMeasurementsChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <Button variant="primary" type="submit" className="mt-3">
          Submit Order
        </Button>
      </form>

      <h3 className="mt-5">Orders</h3>
      <Table striped bordered hover>         <thead>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Product Type</th>
            <th>Quantity</th>
            <th>Price per Unit</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerInfo.name}</td>
              <td>{order.orderDetails.productType}</td>
              <td>{order.orderDetails.quantity}</td>
              <td>{order.orderDetails.pricePerUnit}</td>
              <td>{order.orderDetails.totalPrice}</td>
              <td>{order.orderDetails.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderForm;
