import {createStore} from 'redux';
import rootReducer from './root.reducer';

const configureStore = () => {
  return createStore(rootReducer);
};
export default configureStore;
