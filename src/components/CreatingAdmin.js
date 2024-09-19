import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; // Import your Firebase app instance

// Function to create an admin user
const createAdminUser = async (email, password) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user to Firestore with isAdmin field set to true
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      isAdmin: true // Set isAdmin to true for admin users
    });

    console.log('Admin user created successfully:', user.uid);
    return user.uid; // Return the user ID if needed
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    throw error;
  }
};

// Usage example
createAdminUser('alikibretmuhamed@gmail.com', '123456')
  .then((userId) => {
    console.log('Admin user created with ID:', userId);
  })
  .catch((error) => {
    console.error('Error creating admin user:', error);
  });
