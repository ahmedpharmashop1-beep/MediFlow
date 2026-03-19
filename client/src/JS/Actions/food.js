import axios from  "axios";
import { ADD_FOOD, FAIL_FOOD, GET_FOOD, GET_ONE_FOOD, LOAD_FOOD } from "../ActionTypes/food";





export const getFood=()=> async (dispatch)=> {
dispatch({type:LOAD_FOOD})
try {
  let result= await axios.get("http://localhost:5000/api/food/allfood")
        dispatch ({type:GET_FOOD,payload:result.data})
    console.log(result.data,"t2")   
} catch (error) {
                    dispatch ({type:FAIL_FOOD,payload:error.response})
    
}

}


export const addFood=(newFood,navigate)=> async (dispatch)=> {
dispatch({type:LOAD_FOOD})
try {
    const config ={
     headers: {
        authorization: localStorage.getItem("token"),
     },
    


    }
   




  let result= await axios.post("http://localhost:5000/api/food/add-food",newFood,config)
        dispatch ({type:ADD_FOOD,payload:result.data})
        dispatch(getFood())
        navigate('/listfood')
    
} catch (error) {
                    dispatch ({type:FAIL_FOOD,payload:error.response})
    
}

}


export const deleteFood=(id)=> async (dispatch)=> {
    dispatch({type:LOAD_FOOD})

     try {
     const config ={
     headers: {
        authorization: localStorage.getItem("token")
     }
    }
    await axios.delete(`http://localhost:5000/api/food/${id}`,config)
    dispatch(getFood()) // aa fixed
   }
   catch (error) {
                    dispatch ({type:FAIL_FOOD,payload:error.response})

   }

}

export const editFood=(id,newFood,navigate)=> async (dispatch ) => {
     dispatch({type:LOAD_FOOD})

     try {
     const config ={
     headers: {
        authorization: localStorage.getItem("token")
     }
    }
    await axios.put(`http://localhost:5000/api/food/${id}`,newFood,config)
    dispatch(getFood())
    navigate(-1)
} catch( error) {
                       dispatch ({type:FAIL_FOOD,payload:error.response})
 
}
}

export const getOneFood = (id) => async (dispatch) => {
    dispatch({ type: LOAD_FOOD })
    try {
        let result = await axios.get(`http://localhost:5000/api/food/${id}`)
        dispatch({ type: GET_ONE_FOOD, payload: result.data })
    } catch (error) {
        dispatch({ type: FAIL_FOOD, payload: error.response })
    }
}