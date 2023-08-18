/* IMPORT ACTIONS FOR USER REDUCER */
import actions from '../actions/user.action';

/* INITIALIZE STATE VARIABLES */
const initialState = {
  totalUsers: 0,
  totalAssets: 0,
  web3Data: {},
  selectedToken: 'USDT',
  transactions: [],
  withdrawData: {},
  fetchData: false,
  poolAddress: {},
};

/* INITIALIZE ACTIONS */
const {
  SET_HOME_TOTAL_USER,
  SET_HOME_TOTAL_ASSETS,
  SET_WEB3_DATA,
  SET_SELECT_TOKEN_DATA,
  SET_TRANSACTION_DATA,
  SET_WITHDRAW_DATA,
  SET_FETCH_DATA,
  SET_POOL_ADDRESS,
} = actions;

/* CREATE USER REDUCER FUNCTION */
const userReducer = (state = initialState, action) => {
  const {type, data} = action;

  /* CREATE SWITCH CASE FOR ACTIONS */
  switch (type) {
    /* SET TOTAL USER DATA */
    case SET_HOME_TOTAL_USER:
      return {
        ...state,
        totalUsers: data,
      };
    /* SET ASSETS DATA TOKEN */
    case SET_HOME_TOTAL_ASSETS:
      return {
        ...state,
        totalAssets: data,
      };
    /* SET Web3 DATA */
    case SET_WEB3_DATA:
      return {
        ...state,
        web3Data: data,
      };
    /* SET SELECTED TOKEN DATA */
    case SET_SELECT_TOKEN_DATA:
      return {
        ...state,
        selectedToken: data,
      };
    /* SET TRANSACTION DATA */
    case SET_TRANSACTION_DATA:
      return {
        ...state,
        transactions: data,
      };

    /* SET WITHDRAW DATA */
    case SET_WITHDRAW_DATA:
      return {
        ...state,
        withdrawData: data,
      };

    /* SET FETCH DATA */
    case SET_FETCH_DATA:
      return {
        ...state,
        fetchData: data,
      };

    /* SET POOL ADDRESS */
    case SET_POOL_ADDRESS:
      return {
        ...state,
        fetchData: data,
      };

    default:
      return state;
  }
};

export default userReducer;
