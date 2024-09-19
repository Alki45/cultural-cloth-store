import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const staticAdminCredentials = {
    username: 'admin@example.com',
    password: '123456',
  };

  const handleLogin = async () => {
    try {
      if (username === staticAdminCredentials.username && password === staticAdminCredentials.password) {
        console.log('Static admin credentials matched');
        navigate('/adminedit');
      } else {
        console.log('Attempting Firebase authentication');
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();

        if (userData && userData.isAdmin) {
          console.log('Firebase admin credentials matched');
          navigate('/adminedit');
        } else {
          console.log('Not an admin, redirecting to account');
          navigate('/account');
        }
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setError(error.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="login-container">
        <h2>Login</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </Container>
  );
};

export default AdminLogin;
