import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { COLOR_YELLOW, COLOR_GREY_0 } from '@constants/styles'

class Lists extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    lists: [],
    size: 17,
  }

  onNavigation(item) {
    // TODO Taro.reLaunch({ url: item.url })
    console.log(item.url)
  }

  render() {
    const { lists, size } = this.props

    return (
      <View className='mt-4'>
        {
          lists.map((item, index) =>
            <View className='user-list-item p-3'
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

      </View>
    )
  }
}

export default Lists
