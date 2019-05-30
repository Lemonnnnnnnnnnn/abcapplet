import logo from '@assets/icons/logo.png'

export const USER_DEFAULT = {
  userInfo: {
    // 城市数据
    city: "",
    country: "中国",
    province: "",

    // 用户数据
    id: 0,
    nickname: "未登录",
    headimgurl: logo,
    create_time: "",
    update_time: "",

    // 默认配置
    openid: "",
    language: "zh_CN",
    sex: 1,
  }
}


export const USER_INFO = 'USER_INFO'
export const USER_LOGIN = 'USER_LOGIN'
export const USER_LOGOUT = 'USER_LOGOUT'
