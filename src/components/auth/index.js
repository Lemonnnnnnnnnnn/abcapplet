import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'

class Auth extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    logo: '',
    text: '确定',
    onLogin: () => { },
    message: '为提供安全且愉悦的使用体验，需要你进行确认微信授权',
  }

  async componentDidShow() {
    const { code } = await Taro.login()
    Taro.setStorageSync('code', code)
  }

  onNavigation() {
    Taro.switchTab({ url: '/pages/common/home' })
  }

  render() {
    const imageStyle = {
      width: `${Taro.pxTransform(200)}`,
      height: `${Taro.pxTransform(200)}`,
    }
    const { logo, message, text, onLogin } = this.props

    return (
      <View className='mt-5 mx-3'>
        {/* Logo */}
        <View className='text-center'>
          <Image src={logo} mode='aspectFit' style={imageStyle}></Image>
        </View>

        {/* 授权说明 */}
        <View className='text-center m-3'>
          <Text className='text-muted text-normal'>{message}</Text>
        </View>

        {/* 确认按钮 */}
        <View>
          <AtButton className='btn-green' openType='getUserInfo' onGetUserInfo={onLogin} >{text}</AtButton>
          <AtButton className='btn-grey mt-3' onClick={this.onNavigation}>取消</AtButton>
        </View>
      </View>
    )
  }
}

export default Auth
