import Taro, { Component } from '@tarojs/taro'
import { LOCALE_AUTH } from '@constants/locale'
import { PAGE_HOME } from '@constants/page'

import Auth from '@components/auth'
import logo from '@assets/icons/logo.png'
// redux
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'


@connect(state => state.user, actions)
class UserAuth extends Component {
  config = {
    navigationBarTitleText: '授权登录',
  }

  /**
   * 用户授权登录
   * @param {*} event 默认事件
   */
  async onLogin(event) {
    let code = Taro.getStorageSync('code')
    // code ? code = code : code =  await Taro.login()

    const { encryptedData: encrypt_data, iv } = event.currentTarget

    const urlCode = encodeURIComponent(code)
    const urlEncrypt_data = encodeURIComponent(encrypt_data)
    const urlIv = encodeURIComponent(iv)

    this.props.dispatchLogin(
      { iv: urlIv, code: urlCode, encrypt_data: urlEncrypt_data, },
      { success: this.onLoginSuccess },
    )
  }

  /**
   * 登录成功后进行页面跳转
   */
  onLoginSuccess() {
    // Taro.getCurrentPages().length > 1
    //   ? Taro.navigateBack({ delta: 2 })
    //   : Taro.reLaunch({ url: PAGE_HOME })
    Taro.reLaunch({ url: PAGE_HOME })
  }

  render() {
    return (
      <Auth
        logo={logo}
        message={LOCALE_AUTH}
        onLogin={this.onLogin}
      />
    )
  }
}

export default UserAuth
