// Taro 相关
import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'//遮盖层
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'
import ApartmentItemMask from '@components/apartment-item-mask'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

class ApartmentListMask extends BaseComponent {
  static defaultProps = {
    show: false,
    apartments: [],
  }

  render() {
    let { show, apartments } = this.props

    return show && <View className='apartment-mask'>
      {/* 主体内容 */}
      <Board fixed='bottom' border='top'>
        <View className='m-3'>
          {/* 公寓头部 */}
          <View className='at-row at-row__justify--between mb-3'>
            <View className='text-bold'>查看公寓详情</View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>

          <ScrollView scrollY style={{ height: '250px' }}>
            {/* 公寓列表 */}
            {apartments.map(i => <ApartmentItemMask key={i.id} apartment={i} />)}
          </ScrollView>

          {/* 无公寓详情 */}
          {apartments.length === 0 && <View>无公寓详情</View>}
        </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} />
    </View>
  }
}

export default ApartmentListMask
