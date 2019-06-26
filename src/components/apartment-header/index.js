// Taro 组件相关
import Taro from '@tarojs/taro'
import { AtAvatar } from 'taro-ui'
import { View, Text } from '@tarojs/components'


// 自定义组件
import Tag from '@components/tag'
import BaseComponent from '@components/base'
import {
  LOCALE_HAVE_APARTMENT_TOTAL,
  LOCALE_SHOW_MORE_DESC,
  LOCALE_HIDE_MORE_DESC,
  LOCALE_NO_DATA,
} from '@constants/locale'

class ApartmentHeader extends BaseComponent {
  static defaultProps = {
    title: '',
    cover: '',
    desc: '',
    total: '',
    maxLength: 70,
  }

  state = {
    showDesc: false,
  }

  onShowDescToggle() {
    const { showDesc } = this.state
    this.setState({ showDesc: !showDesc })
  }

  render() {
    const { showDesc } = this.state
    const { cover, title, desc, total, maxLength } = this.props

    return (
      <View class='apartment-header at-row'>
        <View>
          <AtAvatar circle image={cover} />
        </View>
        <View className='pl-3'>
          <View className='at-row'>
            <View className='text-bold text-huge mr-3'>{title}</View>
            <Tag type='special' active small circle>
              {LOCALE_HAVE_APARTMENT_TOTAL.replace('%s', total)}
            </Tag>
          </View>

          {/* 当描述为空 */}
          {desc.length === 0 && <View className='text-small text-secondary mt-2'>
            {LOCALE_NO_DATA}
          </View>}

          {/* 当描述小于最大字符串长度 */}
          {desc.length > 0
            && desc.length < maxLength
            && <View className='text-small text-secondary mt-2'>
              {desc}
            </View>
          }

          {/* 当描述大于最大字符串长度 */}
          {desc.length > maxLength &&
            <View className='text-small text-secondary mt-2' onClick={this.onShowDescToggle} >
              {showDesc ? desc : `${desc.substring(0, maxLength)}...`}
              <Text className='text-yellow ml-2'>
                {showDesc ? LOCALE_HIDE_MORE_DESC : LOCALE_SHOW_MORE_DESC}
              </Text>
            </View>
          }

        </View>
      </View>
    )
  }
}

export default ApartmentHeader
