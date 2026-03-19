import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteFood } from "../../JS/Actions/food"; // ajuste le chemin

const FoodCard = ({ food }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
        width: "250px",
      }}
    >
      <img
        src={food.profile_img}
        alt={food.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "5px",
        }}
      />

      <h3>{food.name}</h3>
      <p>Price: ${food.price}</p>
      <p>{food.description}</p>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <button
          onClick={() => navigate(`/editfood/${food._id}`)}
          style={{
            padding: "5px 10px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>

        <button
          onClick={() => dispatch(deleteFood(food._id))}
          style={{
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FoodCard;