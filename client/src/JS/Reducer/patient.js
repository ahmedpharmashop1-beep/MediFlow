import {
  CURRENT_PATIENT,
  FAIL_PATIENT,
  LOAD_PATIENT,
  LOGIN_PATIENT,
  LOGOUT_PATIENT,
  REGISTER_PATIENT,
} from '../ActionTypes/patient';

const initialState = {
  patient: null,
  isAuth: false,
  isAdmin: false,
  load: false,
  errors: null,
};

const patientReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_PATIENT:
      return { ...state, load: true };
    case REGISTER_PATIENT:
    case LOGIN_PATIENT: {
      const patient = payload.patient;
      localStorage.setItem('token', payload.token);
      localStorage.setItem('patient', JSON.stringify(patient));
      return { ...state, load: false, isAuth: true, isAdmin: !!patient?.isAdmin, patient, errors: null };
    }
    case CURRENT_PATIENT:
      return { ...state, load: false, isAuth: true, isAdmin: !!payload?.isAdmin, patient: payload, errors: null };
    case FAIL_PATIENT:
      return { ...state, load: false, errors: payload };
    case LOGOUT_PATIENT:
      localStorage.removeItem('token');
      localStorage.removeItem('patient');
      return { ...initialState };
    default:
      return state;
  }
};

export default patientReducer;

