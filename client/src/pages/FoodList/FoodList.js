import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFood } from "../../JS/Actions/food";
import FoodCard from "../../components/FoodCard/FoodCard";

const ListFood = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let listFood = useSelector((state) => state.foodReducer.listFood);

  const load = useSelector((state) => state.foodReducer.load);
  const error = useSelector((state) => state.foodReducer.error);
  console.log(listFood,"t1")

  useEffect(() => {
    dispatch(getFood());
  }, [dispatch]);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Food List Page</h1>
        <button 
          onClick={() => navigate("/addfood")}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Add Food
        </button>
      </div>

      {load && <h3>Loading...</h3>}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      <div style={{ marginTop: "20px" }}>
        {listFood && listFood.length === 0 ? (
          <h3>No food available</h3>
        ) : (
          listFood?.map((food) => <FoodCard key={food._id} food={food} />)
        )}
      </div>
    </div>
  );
};

export default ListFood;