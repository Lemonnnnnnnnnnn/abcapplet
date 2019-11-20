// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

// 自定义组件
import BaseComponent from '@components/base'
import Borad from '@components/board'



class UserFeedbackOptions extends BaseComponent {
  static defaultProps = {
    lists: [],
  }


  render() {
    const { lists, className } = this.props

    return (
      <View className={className}>
        {
          lists.map(i => <Borad key={i.id} className='p-3 mb-2'>
              <View className='at-row at-row__justify--between' onClick={this.props.onClick.bind(this, i.method)}>
                {/* 左侧内容 */}
                <View className='at-row at-row__align--center ml-2'>
                  {/* 左侧图标 */}
                  <Image style={{ width: Taro.pxTransform(32), height: Taro.pxTransform(32), marginTop: Taro.pxTransform(4) }} src={i.icon}></Image>
                  {/* 文本内容 */}
                  <View className='ml-2 text-normal' style={{ color: '#000' }}>{i.title}</View>
                </View>

                {/* 右侧图片 */}
                <View className='at-col at-col-3 '>
                  <View className='at-row at-row__align--center at-row__justify--between'>
                    <View className='text-small text-secondary mr-2'>{i.extraText}</View>
                    <View style={{ marginBottom: Taro.pxTransform(4) }}>
                      <AtIcon value='chevron-right' color={COLOR_GREY_2} size={17} />
                    </View>
                  </View>
                </View>

              </View>
          </Borad>)
        }

      </View>
    )
  }
}

export default UserFeedbackOptions
