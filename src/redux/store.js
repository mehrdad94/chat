import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import migrations from './migrations'
import rootReducer from './reducers'
import actionsSharedState from './middlewares/actionsSharedState'

const persistConfig = {
  key: 'root',
  version: '2',
  storage,
  migrate: createMigrate(migrations, { debug: true })
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, applyMiddleware(actionsSharedState))
export const persistor = persistStore(store)
