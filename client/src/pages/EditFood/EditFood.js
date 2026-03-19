import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { editFood, getOneFood } from "../../JS/Actions/food";

const EditFood = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [file, setFile] = useState(null);

  const foodToGet = useSelector((state) => state.foodReducer.foodToGet);
  const load = useSelector((state) => state.foodReducer.load);
  useEffect(() => {
    dispatch(getOneFood(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (foodToGet) {
      const item = foodToGet.food || foodToGet; 
      setNewFood({
        name: item.name || "",
        price: item.price !== undefined ? String(item.price) : "",
        category: item.category || "",
      });
    }
  }, [foodToGet]);

  const handleChange = (e) => {
    setNewFood({ ...newFood, [e.target.name]: e.target.value });
  };
  const handlePhoto = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEdit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", newFood.name);
    data.append("price", newFood.price);
    data.append("category", newFood.category);
    if (file) data.append("image", file);

    dispatch(editFood(id, data, navigate));
  };

  if (load) return <h2>Loading...</h2>;
  if (!foodToGet) return <h2>No food found</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit Food</h1>

      <form
        onSubmit={handleEdit}
        style={{ display: "grid", gap: 10, maxWidth: 400 }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newFood.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newFood.price}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newFood.category}
          onChange={handleChange}
        />

        <input type="file" onChange={handlePhoto} />

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditFood;