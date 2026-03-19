import axios from "axios";
import {  CURRENT_USER, FAIL_USER, LOAD_USER, LOGIN_USER, LOGOUT_USER, REGISTER_USER } from "../ActionTypes/user";




export const register = (newUser) => async(dispatch) => {
    dispatch({type : LOAD_USER})
    try {
            let result = await axios.post("http://localhost:5000/api/user/register",newUser)
            dispatch({type : REGISTER_USER , payload : result.data})
    } catch (error) {
            dispatch({type : FAIL_USER , payload : error.response.data.errors})
    }
}


export const login = (user) => async (dispatch) => {
    dispatch({type : LOAD_USER})
    try {
        let result = await axios.post("http://localhost:5000/api/user/login" , user)
        dispatch({type : LOGIN_USER , payload : result.data})
        
    } catch (error) {
        dispatch({type : FAIL_USER , payload : error.response.data.errors})
    }
}


export const current = () => async(dispatch) => {
    dispatch({type : LOAD_USER})
    try {
        const config = {
            headers : {
                authorization : localStorage.getItem("token")
            }
        }
        var result = await axios.get("http://localhost:5000/api/user/current" , config)
        dispatch({type : CURRENT_USER , payload : result.data})
    } catch (error) {
        console.log(result,"t5")
        console.log(error.response.data.errors,"t5")
        dispatch({type : FAIL_USER , payload : error.response.data.errors,})    
    }
}




export const logout = () => async(dispatch) => {
    dispatch({type : LOGOUT_USER})
}

