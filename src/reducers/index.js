import { combineReducers } from 'redux'
import ad from './ad'
import cbd from './cbd'
import city from './city'
import user from './user'
import home from './home'
import banner from './banner'

export default combineReducers({
  ad,
  cbd,
  city,
  user,
  home,
  banner,
})
