import Taro, { Component } from '@tarojs/taro'
import { LOCALE_AUTH } from '@constants/locale'
import { PAGE_HOME } from '@constants/page'
import { connect } from '@tarojs/redux'
import Auth from '@components/auth'
import logo from '@assets/icons/logo.png'
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
    const { code } = await Taro.login()
    const { encryptedData: encrypt_data, iv } = event.currentTarget

    this.props.dispatchLogin(
      { iv, code, encrypt_data, },
      { success: this.onLoginSuccess },
    )
  }

  /**
   * 登录成功后进行页面跳转
   */
  onLoginSuccess() {
    Taro.getCurrentPages().length > 1
      ? Taro.navigateBack({ delta: 2 })
      : Taro.reLaunch({ url: PAGE_HOME })
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
