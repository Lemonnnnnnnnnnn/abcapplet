import { combineReducers } from 'redux'
import ads from './ads'
import user from './user'
import cbds from './cbds'
import citys from './citys'
import banners from './banners'
import articles from './articles'

export default combineReducers({
  ads,
  user,
  cbds,
  citys,
  banners,
  articles,
})
