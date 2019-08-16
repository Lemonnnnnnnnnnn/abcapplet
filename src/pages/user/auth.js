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

  componentDidMount() {
    this.autoUpdate()
  }

  autoUpdate() {
    if (Taro.canIUse('getUpdateManager')) {
      //创建UpdateManager实例
      const updateManager = Taro.getUpdateManager();
      //检测版本更新
      updateManager.onCheckForUpdate((res) => {
        if (!res.hasUpdate) return;

        //请求更新
        updateManager.onUpdateReady(() => {
          Taro.showModal({
            title: '更新提示',
            content: '新版本已经准备好了，是否重启应用？',
            success: (res) => res.confirm && updateManager.applyUpdate(),
          });
        });

        //更新失败
        updateManager.onUpdateFailed(() => {
          Taro.showModal({
            title: '已经有新版本咯~~',
            content: '新版本已经上线，请您删除当前小程序，重新搜索打开。',
          });
        });

      });
    } else {
      //希望用户在最新版本的客户端上体验您的小程序
      Taro.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试'
      })
    }
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
