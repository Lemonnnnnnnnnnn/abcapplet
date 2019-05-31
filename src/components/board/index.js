import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

class Board extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    height: 100,
  }

  render() {
    const { height } = this.props

    const style = {
      height: `${Taro.pxTransform(parseInt(height))}`,
    }

    return (
      <View className='board' style={style}></View>
    )
  }
}

export default Board
