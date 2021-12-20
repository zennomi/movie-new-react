import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices

import ticketReducer from './slices/ticket';


// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const ticketPersistConfig = {
  key: 'ticket',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['tickets', 'total']
};

const rootReducer = combineReducers({
  ticket: persistReducer(ticketPersistConfig, ticketReducer)
});

export { rootPersistConfig, rootReducer };
