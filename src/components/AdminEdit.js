import React, { useState } from 'react';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AdminEdit = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleUpdate = async () => {
    setError(null);
    setSuccess(null);
    try {
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      if (password) {
        await updatePassword(user, password);
      }

      // Update additional user data in Firestore if needed
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { email }, { merge: true });

      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleManageOrders = () => {
    // Redirect to admin dashboard after successful login or profile update
    navigate('/admin');
  };

  const handleManageProducts = () => {
    // Redirect or navigate to manage products page
    navigate('/product');
  };

  return (
    <div>
      <h2>Edit Admin Profile</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Profile</button>
      <button onClick={handleManageOrders}>Manage Orders</button>
      <button onClick={handleManageProducts}>Manage Products</button>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default AdminEdit;
