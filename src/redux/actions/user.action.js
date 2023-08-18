/* CREATE ACTIONS FOR USER REDUCER */
const actions = {
  SET_HOME_TOTAL_USER: 'SET_HOME_TOTAL_USER',
  SET_HOME_TOTAL_ASSETS: 'SET_HOME_TOTAL_ASSETS',
  SET_WEB3_DATA: 'SET_WEB3_DATA',
  SET_SELECT_TOKEN_DATA: 'SET_SELECT_TOKEN_DATA',
  SET_TRANSACTION_DATA: 'SET_TRANSACTION_DATA',
  SET_WITHDRAW_DATA: 'SET_WITHDRAW_DATA',
  SET_FETCH_DATA: 'SET_FETCH_DATA',
  SET_POOL_ADDRESS: 'SET_POOL_ADDRESS',

  setHomeTotalUser: data => {
    return {type: actions.SET_HOME_TOTAL_USER, data};
  },
  setHomeTotalAssets: data => {
    return {type: actions.SET_HOME_TOTAL_ASSETS, data};
  },
  setWeb3Data: data => {
    return {type: actions.SET_WEB3_DATA, data};
  },
  setToken: data => {
    return {type: actions.SET_SELECT_TOKEN_DATA, data};
  },
  setTransaction: data => {
    return {type: actions.SET_TRANSACTION_DATA, data};
  },
  setWithdrawData: data => {
    return {type: actions.SET_WITHDRAW_DATA, data};
  },
  setFetchData: data => {
    return {type: actions.SET_FETCH_DATA, data};
  },
  setPoolAddress: data => {
    return {type: actions.SET_POOL_ADDRESS, data};
  },
};

export default actions;
