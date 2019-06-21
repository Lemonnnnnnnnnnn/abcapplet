// Taro 相关
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'
import { COLOR_YELLOW, COLOR_GREY_0 } from '@constants/styles'

class UserOptions extends BaseComponent {
  static defaultProps = {
    lists: [],
    size: 17,
  }

  onNavigation({ url }) {
    Taro.navigateTo({ url })
  }

  render() {
    const { lists, size, className } = this.props

    return (
      <Board className={className}>
        {
          lists.map((item, index) =>
            <View className='user-list-item py-3 mx-3'
              key={index}
              onClick={this.onNavigation.bind(this, item)}
            >
              <View className='at-row at-row__justify--around'>
                {/* 左侧内容 */}
                <View className='at-col'>
                  {/* 左侧图标 */}
                  <AtIcon className='mr-2' value={item.icon} color={COLOR_YELLOW} size={size} />

                  {/* 文本内容 */}
                  <Text className='mr-2 text-normal'>{item.title}</Text>
                  <Text className='text-small text-muted'>{item.extraText}</Text>
                </View>

                {/* 右侧图片 */}
                <AtIcon value='chevron-right' color={COLOR_GREY_0} size={size} />
              </View>

            </View>
          )}

      </Board>
    )
  }
}

export default UserOptions
