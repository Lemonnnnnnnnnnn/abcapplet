// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

// 自定义组件
import BaseList from '@components/base-list'
import OrderItem from '@components/order-item'


class OrderList extends BaseList {

  render() {
    const { items, className, show } = this.props
    const { hasMore, loading, page } = this.state

    const pageBgStyle = {
      marginTop : Taro.pxTransform(180)
    }

    return (show && <View className={className}>

      {/* 渲染 公寓列表 */}
      {page != 1 && items.map(i =>
        <OrderItem key={i.id} order={i} className='my-3' />
      )}

      {/* 无数据 */}
      {items.length === 0
        && hasMore === false
        && loading === false
        && <View className='pt-4 pb-2 default-page-background' style={pageBgStyle}>
          <Image lazyLoad mode='widthFix' src='https://images.gongyuabc.com/image/page_order.png' className='default-page-picture' ></Image>
          <View style={{ position: 'relative' }}>
            <View className='text-large text-center default-page-font' >您还没有订单哦~</View>
          </View>
        </View>}
    </View>)
  }
}

export default OrderList
