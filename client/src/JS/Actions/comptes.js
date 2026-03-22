import axios from 'axios';
import {
  CURRENT_COMPTE,
  FAIL_COMPTE,
  LOAD_COMPTE,
  LOGIN_COMPTE,
  LOGOUT_COMPTE,
  REGISTER_COMPTE,
} from '../ActionTypes/comptes';

const API = 'http://localhost:5000/api/comptes';

export const registerCompte = (payload) => async (dispatch) => {
  dispatch({ type: LOAD_COMPTE });
  try {
    const { data } = await axios.post(`${API}/register`, payload);
    dispatch({ type: REGISTER_COMPTE, payload: data });
  } catch (error) {
    dispatch({ type: FAIL_COMPTE, payload: error?.response?.data?.errors || [{ msg: 'Registration failed' }] });
  }
};

export const loginCompte = (payload) => async (dispatch) => {
  dispatch({ type: LOAD_COMPTE });
  try {
    const { data } = await axios.post(`${API}/login`, payload);
    dispatch({ type: LOGIN_COMPTE, payload: data });
  } catch (error) {
    dispatch({ type: FAIL_COMPTE, payload: error?.response?.data?.errors || [{ msg: 'Login failed' }] });
  }
};

export const currentCompte = () => async (dispatch) => {
  dispatch({ type: LOAD_COMPTE });
  try {
    const config = { headers: { authorization: localStorage.getItem('token') } };
    const { data } = await axios.get(`${API}/current`, config);
    dispatch({ type: CURRENT_COMPTE, payload: data });
  } catch (error) {
    dispatch({ type: FAIL_COMPTE, payload: error?.response?.data?.errors || [{ msg: 'Current failed' }] });
  }
};

export const logoutCompte = () => (dispatch) => {
  dispatch({ type: LOGOUT_COMPTE });
};

