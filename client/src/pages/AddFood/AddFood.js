import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addFood } from '../../JS/Actions/food';
import './AddFood.css';

const AddFood = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const load = useSelector((state) => state.foodReducer.load);

  const [food, setFood] = useState({});
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    let data = new FormData();
    data.append("name", food.name);
    data.append("price", food.price);
    data.append("category", food.category);
    data.append("image", file);

    dispatch(addFood(data, navigate));
  };

  return (
    <div className="add-container">
      <form className="add-form" onSubmit={handleAdd}>
        <h2>Add Food</h2>

        <input
          type="text"
          name="name"
          placeholder="Food Name"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          required
        />

        <input
          type="file"
          onChange={handlePhoto}
          required
        />

        <button type="submit" disabled={load}>
          {load ? "Loading..." : "Add Food"}
        </button>
      </form>
    </div>
  );
};

export default AddFood;