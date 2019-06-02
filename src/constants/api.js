// 接口基础配置
const isDev = process.env.NODE_ENV === 'development'
export const DEV_HOST = "http://101.37.152.237:8081/mini"
export const PROD_HOST = "https://api.gongyuabc.com/mini"
export const HOST = isDev ? DEV_HOST : PROD_HOST

// 城市列表
export const API_CITY_LIST = `${HOST}/dict/listsitepost`

// 用户
export const API_USER_LOGIN = `${HOST}/auth/loginpost`


// 商圈
export const API_HOT_CBD_LIST = `${HOST}/dict/listHotCbdPost`

// 广告
export const API_AD_LIST = `${HOST}/ad/adPost`

// 公寓
export const API_RECOMMEND_LIST = `${HOST}/recommend/recommendPost`

// 文章-轮播-活动
export const API_ARTICLE_SHOW = `${HOST}/article/getpost`
export const API_BANNER_LIST = `${HOST}/article/listbannerpost`
export const API_ACTIVITY_LIST = `${HOST}/article/listHotActivityPost`
