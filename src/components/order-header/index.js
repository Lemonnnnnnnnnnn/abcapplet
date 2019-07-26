// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

// 自定义组件
import Borad from '@components/board'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'
import { COLOR_YELLOW } from '@constants/styles'
import { LOCALE_LOCK_NOTICE } from '@constants/locale';

class OrderHeader extends BaseComponent {

  static defaultProps = {
    items: [],
    size: 'normal',
  }

  render() {
    const { items, className, size } = this.props
    const grayline = {
      borderBottom: "1Px solid #3D3D3D",
    }
    const PicStyle = {
      width: '30px',
      height: '35px'
    }
    return (
      <Borad color='black' className={className}>
        {size === 'normal' && <View className='px-3 py-3'>
          <View className='at-row at-row__justify--center'>
            <View className='text-small text-secondary mb-2'>{LOCALE_LOCK_NOTICE}</View>
          </View>
          {/* 灰色分割线 */}
          <View className='mb-3' style={grayline}></View>

          <View className='at-row '>
            {items.map(i =>
              <View className='at-row ml-3 ' key={i.id}>
                <View className='at-col-4'>
                  <Image src={i.url} style={PicStyle}></Image>
                </View>
                <View className='at-col-6 at-col__justify--center'>
                  <View className='text-white text-normal'>{i.title}</View>
                  <View className='text-secondary text-small'>({i.desc})</View>
                </View>
              </View>
            )}
          </View>
        </View>
        }

        {size === 'small' && <View className='px-3 py-3'>
          <View className='at-row at-row__justify--around'>
            {items.map(i => <View key={i.id}>
              <View className='at-row at-row__align--center'>
                <View className='at-row'>
                  <ABCIcon icon={i.icon} color={COLOR_YELLOW} size='45' />
                  <View className='text-white text-normal ml-2'>
                    <View className='text-white text-normal'>{i.title}</View>
                    <View className='text-secondary text-small'>{i.desc}</View>
                  </View>
                </View>
              </View>
            </View>
            )}
          </View>
        </View>}
      </Borad>
    )
  }
}

export default OrderHeader
