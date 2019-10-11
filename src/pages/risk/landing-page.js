// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import buryPoint from '../../utils/bury-point'

class RiskLandingPage extends Component {
  config = {
    navigationStyle: 'custom',
  }
  state = {
    statusBarHeight: 0,
  }
  async componentWillMount() {

    buryPoint()
    await Taro.getSystemInfo().then(res => {
      this.setState({ statusBarHeight: res.statusBarHeight })
    })
  }
  onReturn() {
    Taro.navigateBack()
  }

  render() {
    const { statusBarHeight } = this.state
    const returnStyle = {
      position: 'fixed',
      left: Taro.pxTransform(-10),
      top: Taro.pxTransform(statusBarHeight * 2 + 10),
      padding: Taro.pxTransform(10),
      zIndex: 20,
    }
    const bgStyle = {
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%,0)',
      width: '100%',
      zIndex: 10,
    }
    return (
      <View >
        {/* 返回按钮 */}
        <View onClick={this.onReturn} style={returnStyle}>
          <AtIcon className='pl-2 pr-2' value='chevron-left' size='22' ></AtIcon>
        </View>
        {/* 展示内容 */}
        <Image src='https://images.gongyuabc.com/image/RiskLandingPage_new.jpg' mode='widthFix' style={bgStyle}></Image>
      </View>
    )
  }
}

export default RiskLandingPage
