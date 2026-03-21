import axios from 'axios';
import {
  CURRENT_PATIENT,
  FAIL_PATIENT,
  LOAD_PATIENT,
  LOGIN_PATIENT,
  LOGOUT_PATIENT,
  REGISTER_PATIENT,
} from '../ActionTypes/patient';

const API = 'http://localhost:5000/api/patient';

export const registerPatient = (payload) => async (dispatch) => {
  dispatch({ type: LOAD_PATIENT });
  try {
    const { data } = await axios.post(`${API}/register`, payload);
    dispatch({ type: REGISTER_PATIENT, payload: data });
  } catch (error) {
    dispatch({ type: FAIL_PATIENT, payload: error?.response?.data?.errors || [{ msg: 'Registration failed' }] });
  }
};

export const loginPatient = (payload) => async (dispatch) => {
  dispatch({ type: LOAD_PATIENT });
  try {
    const { data } = await axios.post(`${API}/login`, payload);
    dispatch({ type: LOGIN_PATIENT, payload: data });
  } catch (error) {
    dispatch({ type: FAIL_PATIENT, payload: error?.response?.data?.errors || [{ msg: 'Login failed' }] });
  }
};

export const currentPatient = () => async (dispatch) => {
  dispatch({ type: LOAD_PATIENT });
  try {
    const config = { headers: { authorization: localStorage.getItem('token') } };
    const { data } = await axios.get(`${API}/current`, config);
    dispatch({ type: CURRENT_PATIENT, payload: data });
  } catch (error) {
    dispatch({ type: FAIL_PATIENT, payload: error?.response?.data?.errors || [{ msg: 'Current failed' }] });
  }
};

export const logoutPatient = () => (dispatch) => {
  dispatch({ type: LOGOUT_PATIENT });
};

