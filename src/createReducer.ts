import { createAction } from './createAction';

interface actionInterface {
  type: symbol,
  payload?: any,
  error?: any
}

const updateState = (updates : object, state : object, action : actionInterface) => {
  const updateMethod = updates[action.type];
  if (updateMethod) {
    return updateMethod(state, action);
  }
  return state;
}

export const createReducer = (initState, updates = {}) => {
  return (state = initState, action) => {
    return updateState(updates, state, action);
  }
}

export const createAsyncReducer = (types : symbol[], initState : object = {}, updates) => {
  const [ request, success, fail ] = types;
  const defaultUpdates : object = {
    [request]: (state : object) =>{
      return { ...state, pending: true };
    },
    [success]: (state : object, action) => {
      return {
        ...state,
        ...action.payload,
        pending: false,
      };
    },
    [fail]: (state: object, action) => {
      return {
        ...state,
        error: action.error,
        pending: false
      }
    }
  }

  return createReducer(initState, Object.assign({}, defaultUpdates, updates))
}