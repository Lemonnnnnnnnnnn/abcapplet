import Taro, { Component } from '@tarojs/taro'
import { MESSAGE_AUTH } from '@constants/message'
import { DEAFULT_HOME_PAGE } from '@constants/api'
import { connect } from '@tarojs/redux'
import Auth from '@components/auth'
import logo from '@assets/icons/logo.png'
import * as actions from '@actions/user'


@connect(state => state.user, actions)
class UserAuth extends Component {
  config = {
    navigationBarTitleText: '授权登录',
    enablePullDownRefresh: true,
  }

  /**
   * 用户授权登录
   * @param {*} event 默认事件
   */
  async onLogin(event) {
    // fetch()
    const { code } = await Taro.login()
    const { encryptedData: encrypt_data, iv } = event.currentTarget

    this.props.dispatchLogin({
      payload: { iv, code, encrypt_data, },
      fetchOptions: { success: this.onLoginSuccess },
    })
  }

  /**
   * 登录成功后进行页面跳转
   */
  onLoginSuccess() {
    Taro.getCurrentPages().length > 1
      ? Taro.navigateBack({ delta: 2 })
      : Taro.reLaunch({ url: DEAFULT_HOME_PAGE })
  }

  render() {
    return (
      <Auth
        logo={logo}
        message={MESSAGE_AUTH}
        onLogin={this.onLogin}
      />
    )
  }
}

export default UserAuth
