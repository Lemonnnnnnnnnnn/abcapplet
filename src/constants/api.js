// 接口基础配置
const isDev = process.env.NODE_ENV === 'development'
export const DEV_HOST = "http://101.37.152.237:8081/mini"
export const PROD_HOST = "https://api.gongyuabc.com/mini"
export const HOST = isDev ? DEV_HOST : PROD_HOST

// 城市列表
export const API_CITY_LIST = `${HOST}/dict/listsitepost`

// 用户
export const API_USER_LOGIN = `${HOST}/auth/loginpost`

// 文章
export const API_BANNER_LIST = `${HOST}/article/listbannerpost`

// 商圈
export const API_HOT_CBD_LIST = `${HOST}/dict/listHotCbdPost`

// 广告
export const API_AD_LIST = `${HOST}/ad/adPost`

// 页面
export const PAGE_CBD_INDEX = '/pages/cbd/index'
export const PAGE_CBD_SHOW = '/pages/cbd/show'
export const PAGE_ARTICLE_SHOW = '/pages/article/show'
export const PAGE_HOME = '/pages/apartment/home'
