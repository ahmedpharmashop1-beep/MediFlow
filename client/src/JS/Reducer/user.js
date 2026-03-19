const { LOAD_USER, REGISTER_USER, LOGIN_USER, CURRENT_USER, FAIL_USER, LOGOUT_USER } = require("../ActionTypes/user")







const initialeState={
    user:null,
    loadUser:false,
    isAuth:false,
    newUser:{},
    isAdmin:false
}

const userReducer=(state=initialeState,{type,payload})=> {
       switch (type) {
            case LOAD_USER:
             return{...state,loadUser:true}
             
              case REGISTER_USER:
                localStorage.setItem("token",payload.token)
             return{...state,loadUser:false,user:{...payload.user,password:null},isAuth:true}
            
             case LOGIN_USER:
            localStorage.setItem("token",payload.token)
  return{...state,loadUser:false,user:{...payload.user,password:null},isAuth:true,isAdmin:payload.isAdmin}
    
          case CURRENT_USER:
    
          return{...state,user:{...payload,password:null},loadUser:false,isAuth:true,isAdmin:payload.isAdmin}
    
        case FAIL_USER:
    
          return{...state,loadUser:false,errors:payload}

    case LOGOUT_USER:
    localStorage.removeItem("token")
          return{
       user:null,
       loadUser:false,
       isAuth:false,
       newUser:{},
       errors:null,
       isAdmin:false





          }
    
            default:
                return state;
        }
}


export default userReducer