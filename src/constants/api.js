// 接口基础配置
const isDev = process.env.NODE_ENV === 'development'
export const DEV_HOST = "https://api.gongyuabc.com/mini"
export const PROD_HOST = "https://api.gongyuabc.com/mini"
export const HOST = isDev ? DEV_HOST : PROD_HOST

// 用户
export const DEAFULT_HOME_PAGE = '/pages/apartment/home'
export const API_USER_LOGIN = `${HOST}/auth/loginpost`

// 首页
export const API_CITY_LIST = `${HOST}/dict/listsitepost`
export const API_BANNER_LIST = `${HOST}/article/listbannerpost`
export const API_HOT_CDB_LIST = `${HOST}/dict/listHotCbdPost`
