import {
  CURRENT_COMPTE,
  FAIL_COMPTE,
  LOAD_COMPTE,
  LOGIN_COMPTE,
  LOGOUT_COMPTE,
  REGISTER_COMPTE,
} from '../ActionTypes/comptes';

const initialState = {
  compte: null,
  isAuth: false,
  isAdmin: false,
  load: false,
  errors: null,
};

const compteReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_COMPTE:
      return { ...state, load: true };
    case REGISTER_COMPTE:
    case LOGIN_COMPTE: {
      const compte = payload.compte;
      localStorage.setItem('token', payload.token);
      localStorage.setItem('compte', JSON.stringify(compte));
      return { ...state, load: false, isAuth: true, isAdmin: !!compte?.isAdmin, compte, errors: null };
    }
    case CURRENT_COMPTE:
      return { ...state, load: false, isAuth: true, isAdmin: !!payload?.isAdmin, compte: payload, errors: null };
    case FAIL_COMPTE:
      return { ...state, load: false, errors: payload };
    case LOGOUT_COMPTE:
      localStorage.removeItem('token');
      localStorage.removeItem('compte');
      return { ...initialState };
    default:
      return state;
  }
};

export default compteReducer;

