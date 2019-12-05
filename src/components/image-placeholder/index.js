import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { COLOR_BLUE, COLOR_WHITE } from '@constants/styles'

class ImagePlaceholder extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    height: 404,
  }

  render() {
    const { height } = this.props

    const style = {
      width: '100%',
      height: `${Taro.pxTransform(height)}`,
      background: COLOR_BLUE,
      color: COLOR_WHITE,
    }

    return (
      <View className='page-demo text-lager text-bold' style={style}>
        ABC 公寓
      </View>
    )
  }
}

export default ImagePlaceholder
