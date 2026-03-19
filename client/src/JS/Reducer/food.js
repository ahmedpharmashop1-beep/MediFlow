const { ADD_FOOD, LOAD_FOOD, GET_FOOD, GET_ONE_FOOD, FAIL_FOOD } = require("../ActionTypes/food");






//initialeSAte
const initialState={
listFood:[],
foodToGet:{},
load:false,
errors:null,

}


// pure function





const foodReducer=(state=initialState,{type,payload})=> {
    switch (type) {
        case LOAD_FOOD:
         return{...state,load:true}
         
          case GET_FOOD:
         return{...state,load:false,listFood:payload.listfood}
        
         case GET_ONE_FOOD:
                return {...state , load : false ,foodToGet : payload.foodToGet }

        case ADD_FOOD:
                return {...state, load: false, listFood: [payload.newFood, ...state.listfood]}

      case FAIL_FOOD:

      return{...state,load:false,errors:payload}


        default:
            return state;
    }
}


export default foodReducer