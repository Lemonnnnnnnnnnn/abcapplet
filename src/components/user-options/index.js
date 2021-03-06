// Taro 相关
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_YELLOW, COLOR_GREY_0 } from '@constants/styles'

class UserOptions extends BaseComponent {
  static defaultProps = {
    lists: [],
    size: 17,
  }

  render() {
    const { lists, size, className } = this.props

    return (
      <Board className={className}>
        {
          lists.map(i =>
            <View className='user-list-item py-3 mx-3' onClick={this.props.onClick.bind(this, i.method)} key={i.id}>
              <View className='at-row at-row__justify--around'>
                {/* 左 */}
                <View className='at-row'>
                  <Image mode='widthFix' className='mr-2 page-middile mt-1' src={i.icon} style={{ width: Taro.pxTransform(43), height: Taro.pxTransform(32) }} />
                  <View className='at-row at-row__align--center'>
                    <Text className='mr-2 text-normal'>{i.title}</Text>
                    <Text className='text-small text-muted'>{i.extraText}</Text>
                  </View>
                </View>
                {/* 右 */}
                <AtIcon value='chevron-right' color={COLOR_GREY_0} size={size} />
              </View>
            </View>)
        }

      </Board>
    )
  }
}

export default UserOptions
