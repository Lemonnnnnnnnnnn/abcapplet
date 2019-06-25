import { combineReducers } from 'redux'
import ads from './ads'
import user from './user'
import cbds from './cbds'
import dists from './dists'
import citys from './citys'
import rooms from './rooms'
import banners from './banners'
import articles from './articles'
import activities from './activities'
import recommends from './recommends'
import apartments from './apartments'

export default combineReducers({
  ads,
  user,
  cbds,
  dists,
  citys,
  rooms,
  banners,
  articles,
  activities,
  recommends,
  apartments,
})
