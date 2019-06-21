// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'

class Decorate extends BaseComponent {
  static defaultProps = {
    height: 100,
  }

  render() {
    const { height } = this.props

    const style = {
      height: `${Taro.pxTransform(parseInt(height))}`,
    }

    return (
      <View className='decorate' style={style}></View>
    )
  }
}

export default Decorate
