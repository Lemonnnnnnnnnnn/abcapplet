import { combineReducers } from 'redux'
import ad from './ad'
import user from './user'
import home from './home'

export default combineReducers({
  ad,
  user,
  home,
})
