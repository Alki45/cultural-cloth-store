import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Type: '',
    Description: '',
    Price: '',
    Quantity: '',
    Image: null
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewProduct(prevProduct => ({
      ...prevProduct,
      [name]: name === 'Image' ? files[0] : value
    }));
  };

  const handleAddProduct = async () => {
    try {
      setError('');
      setSuccessMessage('');
      if (!newProduct.Type || !newProduct.Description || !newProduct.Price || !newProduct.Quantity) {
        setError('Please fill in all fields.');
        return;
      }

      if (isNaN(newProduct.Price) || isNaN(newProduct.Quantity)) {
        setError('Price and Quantity should be numeric.');
        return;
      }

      setLoading(true);
      let imageUrl = '';
      if (newProduct.Image) {
        const imageRef = ref(storage, `images/${newProduct.Image.name}`);
        await uploadBytes(imageRef, newProduct.Image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const newProductData = {
        Type: newProduct.Type,
        Description: newProduct.Description,
        Price: Number(newProduct.Price),
        Quantity: Number(newProduct.Quantity),
        ImageUrl: imageUrl
      };

      const docRef = await addDoc(collection(db, 'products'), newProductData);
      setProducts(prevProducts => [...prevProducts, { ...newProductData, id: docRef.id }]);
      setNewProduct({
        Type: '',
        Description: '',
        Price: '',
        Quantity: '',
        Image: null
      });
      setSuccessMessage('Product added successfully.');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('An error occurred while adding the product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setError('');
      setSuccessMessage('');
      setLoading(true);
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter((product) => product.id !== productId));
      setSuccessMessage('Product deleted successfully.');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('An error occurred while deleting the product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <h2 className="mb-3">Add Product</h2>
          <form>
            <div className="form-group">
              <label htmlFor="Type">Type</label>
              <select
                className="form-control"
                id="Type"
                name="Type"
                value={newProduct.Type}
                onChange={handleInputChange}
              >
                <option value="">Select Type</option>
                <option value="Oromia">Oromia</option>
                <option value="Amhara">Amhara</option>
                <option value="Tigrie">Tigrie</option>
                <option value="Debub">Debub</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="Description">Description</label>
              <textarea
                className="form-control"
                id="Description"
                name="Description"
                rows="3"
                placeholder="Enter product description"
                value={newProduct.Description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="Price">Price</label>
              <input
                type="number"
                className="form-control"
                id="Price"
                name="Price"
                placeholder="Enter product price"
                value={newProduct.Price}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Image">Image</label>
              <input
                type="file"
                className="form-control"
                id="Image"
                name="Image"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Quantity">Quantity</label>
              <input
                type="number"
                className="form-control"
                id="Quantity"
                name="Quantity"
                placeholder="Enter product Quantity"
                value={newProduct.Quantity}
                onChange={handleInputChange}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleAddProduct} disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </button>
            {error && <div className="text-danger mt-2">{error}</div>}
            {successMessage && <div className="text-success mt-2">{successMessage}</div>}
          </form>
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">Existing Products</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.Type}</td>
                  <td>{product.Description}</td>
                  <td>${product.Price.toFixed(2)}</td>
                  <td>{product.Quantity}</td>
                  <td>
                    <img src={product.ImageUrl} alt={product.Type} style={{ width: '50px', height: '50px' }} />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  <div className="mt-4">
    <Link to="/admin" className="btn btn-secondary">
      Admin Dashboard
    </Link>
  </div>
</div>
);
};

export default ProductManager;
