// Taro 相关
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'

// 自定义常量
import {
  LOCALE_ONLINE_SERVICE,
  LOCALE_CONTACT_VIA_PHONE,
  LOCALE_CONSUMER_HOTLINE
} from '@constants/locale'


@connect(state => state, {
  ...userActions
})
class CustomerServiceMask extends Taro.Component {
  static defaultProps = {
    user: {
      city_id: '',
      username: '',
      headimgurl: '',
      sex: ''
    }
  }

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  onCallPhone() {
    Taro.makePhoneCall({ phoneNumber: LOCALE_CONSUMER_HOTLINE })
  }

  render() {
    let { show ,user } = this.props
    const { city_id, username, headimgurl, sex } = user

    const sessionFrom = { nickName: username, avatarUrl: headimgurl, sex, city: city_id }

    const fontStyle = {
      padding: Taro.pxTransform(30),
      textAlign: 'center',
      color: '#888888',
      fontSize: Taro.pxTransform(26),
    }

    const buttonStyle = {
      border: "1px solid #fff",
      color: "#888",
      padding: 0,
      width: '100%',
    }

    return <View className='user-customer-service' onTouchMove={this.onMaskTouchMove}>
      {/* 主体内容 */}
      <AtFloatLayout isOpened={show} onClose={this.props.onClose}>
        <Button
          open-type='contact'
          session-from={JSON.stringify(sessionFrom)}
          size='mini'
          plain
          bindcontact='handleContact'
          style={buttonStyle}
        >
          <View className='text-normal text-secondary text-center ' style={{ padding: Taro.pxTransform(20) }}>
            {LOCALE_ONLINE_SERVICE}
          </View>
        </Button>

        <View className='gray-line' ></View>

        <View
          onClick={this.onCallPhone}
          style={fontStyle}
        >{LOCALE_CONTACT_VIA_PHONE}</View>
      </AtFloatLayout>
      {/* 遮罩层 */}
    </View >
  }
}

export default CustomerServiceMask
