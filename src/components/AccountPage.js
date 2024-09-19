import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Form, Button, Table, Image } from 'react-bootstrap';
import { getDocs,addDoc,updateDoc,getDoc, collection, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase'; 

function AccountPage() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [phoneNumber, setPhoneNumber] = useState('123-456-7890');
  const [password, setPassword] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState('');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name);
            setEmail(userData.email);
            setPhoneNumber(userData.phoneNumber);
            setPhotoURL(userData.photoURL);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const addressesSnapshot = await getDocs(collection(db, 'addresses'));
        const addressesList = addressesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAddresses(addressesList);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const wishlistSnapshot = await getDocs(collection(db, 'wishlist'));
        const wishlistList = wishlistSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWishlist(wishlistList);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchUserData();
    fetchOrders();
    fetchAddresses();
    fetchWishlist();
  }, []);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      let updatedPhotoURL = photoURL;

      if (photo) {
        const storageRef = ref(storage, `profile_photos/${user.uid}_${photo.name}`);
        await uploadBytes(storageRef, photo);
        updatedPhotoURL = await getDownloadURL(storageRef);
        setPhotoURL(updatedPhotoURL);
      }

      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, { name, email, phoneNumber, photoURL: updatedPhotoURL });

      setIsEditMode(false); // Exit edit mode after updating
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleEditClick = () => setIsEditMode(true);

  const handleAddAddress = async () => {
    try {
      const newAddress = { street: 'New Street', city: 'New City', state: 'New State', zip: '12345' };
      const docRef = await addDoc(collection(db, 'addresses'), newAddress);
      setAddresses([...addresses, { id: docRef.id, ...newAddress }]);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteDoc(doc(db, 'addresses', addressId));
      setAddresses(addresses.filter(address => address.id !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'users', user.uid));
        await user.delete();
        // Optionally redirect to a different page after account deletion
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <Container>
      <Tabs defaultActiveKey="profile" id="account-tabs">
        <Tab eventKey="profile" title="Profile">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4>Profile</h4>
              {isEditMode ? (
                <Form onSubmit={handleProfileUpdate}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={handleNameChange} />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={handleEmailChange} />
                  </Form.Group>
                  <Form.Group controlId="formPhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={handlePasswordChange} />
                  </Form.Group>
                  <Form.Group controlId="formPhoto">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
                  </Form.Group>
                  <Button variant="primary" type="submit">Save Changes</Button>
                </Form>
              ) : (
                <>
                  <p>Name: {name}</p>
                  <p>Email: {email}</p>
                  <p>Phone Number: {phoneNumber}</p>
                  {photoURL && <Image src={photoURL} alt="Profile" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />}
                </>
              )}
            </div>
            <div>
              {!isEditMode && (
                <Button variant="info" onClick={handleEditClick}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        </Tab>
        <Tab eventKey="orders" title="Orders">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>${order.total ? order.total.toFixed(2) : 'N/A'}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="addresses" title="Addresses">
          <Button variant="success" onClick={handleAddAddress}>Add New Address</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Address ID</th>
                <th>Street</th>
                <th>City</th>
                <th>State</th>
                <th>Zip</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.id}>
                  <td>{address.id}</td>
                  <td>{address.street}</td>
                  <td>{address.city}</td>
                  <td>{address.state}</td>
                  <td>{address.zip}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteAddress(address.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="wishlist" title="Wishlist">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>${item.price ? item.price.toFixed(2) : 'N/A'}</td>
                  <td>
                    <Button variant="danger">Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="settings" title="Settings">
          <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default AccountPage;
