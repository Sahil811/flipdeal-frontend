import React from "react";
//import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  saveProduct,
  listProducts,
  deleteProduct,
} from "../actions/productActions";
import axios from "axios";
import Pagination from "./Pagination";
import Modal from "./Modal/Modal";

const ProductsScreen = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageId, setImageId] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const productList = useSelector((state) => state.productList);
  const { loading, products, error } = productList;
  const productSave = useSelector((state) => state.productSave);
  const productDelete = useSelector((state) => state.productDelete);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = products.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const {
    loading: loadingSave,
    success: successSave,
    error: errorSave,
  } = productSave;

  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = productDelete;

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
      setModalStatus(true);
    }
    dispatch(listProducts());
    return () => {};
  }, [successSave, successDelete]);

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setUploading(true);
    axios
      .post("/api/uploads", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setImageId(response.data);

        setUploading(false);
      })
      .catch((err) => {
        setUploading(false);
      });
  };

  const openModel = (product) => {
    setModalVisible(true);
    setId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setBrand(product.brand);
    setCategory(product.category);
    setCountInStock(product.countInStock);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveProduct({
        _id: id,
        name,
        image: imageId,
        price,
        brand,
        category,
        countInStock,
        description,
      })
    );
  };

  const deleteHandler = (product) => {
    dispatch(deleteProduct(product._id));
  };

  const isFormValid = () => {
    return name && brand && category && price && countInStock;
  };

  return (
    <>
      <div className="content content-margined">
        <div className="product-header">
          <h3>Products</h3>
          <button className="button primary" onClick={() => openModel({})}>
            Create Product
          </button>
        </div>

        {modalVisible && (
          <div className="form">
            <form onSubmit={submitHandler}>
              <ul className="form-container">
                <li>
                  <h2>Create Product</h2>
                </li>

                <li>
                  {loadingSave && <div>Loading...</div>}
                  {errorSave && <div>{errorSave}</div>}
                </li>

                <li>
                  <label htmlFor="name">name</label>
                  <input
                    value={name}
                    type="name"
                    name="name"
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </li>

                <li>
                  <label htmlFor="price">Price</label>
                  <input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </li>

                <li>
                  <label htmlFor="image-file">Image File</label>
                  <input
                    type="file"
                    id="image-file"
                    label="Choose Image"
                    onChange={uploadFileHandler}
                  />

                  {uploading && <div>Loading...</div>}
                </li>

                <li>
                  <label htmlFor="brand">Brand</label>
                  <input
                    value={brand}
                    type="text"
                    name="brand"
                    id="brand"
                    onChange={(e) => setBrand(e.target.value)}
                  ></input>
                </li>

                <li>
                  <label htmlFor="countInStock">Count in stock</label>
                  <input
                    value={countInStock}
                    type="text"
                    name="countInStock"
                    id="countInStock"
                    onChange={(e) => setCountInStock(e.target.value)}
                  ></input>
                </li>

                <li>
                  <label htmlFor="category">category</label>
                  <input
                    value={category}
                    type="text"
                    name="category"
                    id="category"
                    onChange={(e) => setCategory(e.target.value)}
                  ></input>
                </li>

                <li>
                  <label htmlFor="description">Description</label>
                  <textarea
                    value={description}
                    name="description"
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </li>

                <li>
                  <button
                    disabled={!isFormValid()}
                    type="submit"
                    className="button primary"
                  >
                    {id ? "update" : "Create"}
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => setModalVisible(false)}
                    className="button secondary"
                  >
                    Back
                  </button>
                </li>
              </ul>
            </form>
          </div>
        )}

        <Modal show={modalStatus} modalClosed={setModalStatus}>
          <strong>Product is updated:</strong>
          <p>ID: {id}</p>
          <p>Name: {name}</p>
        </Modal>
        <div className="product-list">
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentPosts.map((product, i) => (
                <tr key={product._id}>
                  <td className="productNumber">
                    {i + 1 + (currentPage - 1) * postsPerPage}
                  </td>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <button
                      className="button"
                      onClick={() => openModel(product)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="button"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={products.length}
        paginate={paginate}
      />
    </>
  );
};

export default ProductsScreen;
