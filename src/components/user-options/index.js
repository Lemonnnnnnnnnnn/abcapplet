// Taro 相关
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
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
    const { lists, size, className , onOpenCard } = this.props

    return (
      <Board className={className}>

        {/* 我的心愿卡 */}
        <View className='user-list-item py-3 mx-3'
          onClick={this.onNavigation.bind(this, lists)}
        >
          <View className='at-row at-row__justify--around'>
            {/* 左侧内容 */}
            <View className='at-col'>
              {/* 左侧图标 */}
              <AtIcon className='mr-2' value={lists.icon} color={COLOR_YELLOW} size={size} />

              {/* 文本内容 */}
              <Text className='mr-2 text-normal'>{lists.title}</Text>
              <Text className='text-small text-muted'>{lists.extraText}</Text>
            </View>

            {/* 右侧图片 */}
            <AtIcon value='chevron-right' color={COLOR_GREY_0} size={size} />
          </View>
        </View>

        {/* 我的需求卡 */}

        <View className='user-list-item py-3 mx-3' onClick={onOpenCard}>
          <View className='at-row at-row__justify--around'>
            <View className='at-row at-row__align--center'>
              <Image style={{ width: Taro.pxTransform(32), height: Taro.pxTransform(32) }} src='https://images.gongyuabc.com/image/requirementCard.png'></Image>
              <Text className='mr-2 text-normal ml-2'>我的需求卡</Text>
            </View>

            <AtIcon value='chevron-right' color={COLOR_GREY_0} size={17} />
          </View>

        </View>

      </Board>
    )
  }
}

export default UserOptions
