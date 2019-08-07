import { combineReducers } from 'redux'
import ads from './ads'
import user from './user'
import cbds from './cbds'
import risks from './risks'
import dists from './dists'
import citys from './citys'
import rooms from './rooms'
import orders from './orders'
import banners from './banners'
import articles from './articles'
import activities from './activities'
import recommends from './recommends'
import apartments from './apartments'
import appointments from './appointment'
import message from './message'
import apartmentlook from './apartmentlook'
import apartmentsearch from './searchApartment'
import articleApartment from './articleApartment'
import cbdApartment from './cbdApartment'
import favoriteHouseType from './favoriteHouseType'
import favoriteApartment from './favoriteApartment'

export default combineReducers({
  ads,
  user,
  cbds,
  risks,
  dists,
  citys,
  rooms,
  orders,
  banners,
  articles,
  activities,
  recommends,
  apartments,
  appointments,
  message,
  apartmentlook,
  apartmentsearch,
  articleApartment,
  cbdApartment,
  favoriteHouseType,
  favoriteApartment
})
