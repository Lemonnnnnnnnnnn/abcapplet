import { combineReducers } from 'redux'
import ads from './ads'
import user from './user'
import risks from './risks'
import dists from './dists'
import citys from './citys'
import rooms from './rooms'
import orders from './orders'
import articles from './articles'
import apartments from './apartments'
import appointments from './appointment'
import message from './message'
import apartmentlook from './apartmentlook'
import apartmentsearch from './searchApartment'
import articleApartment from './articleApartment'
import cbdApartment from './cbdApartment'
import favoriteHouseType from './favoriteHouseType'
import favoriteApartment from './favoriteApartment'
import activityApartment from './activityApartment'
import home from './home'
import sublet from './sublet'

export default combineReducers({
  ads,
  user,
  risks,
  dists,
  citys,
  rooms,
  orders,
  articles,
  apartments,
  appointments,
  message,
  apartmentlook,
  apartmentsearch,
  articleApartment,
  cbdApartment,
  favoriteHouseType,
  favoriteApartment,
  activityApartment,
  home,
  sublet,
})
