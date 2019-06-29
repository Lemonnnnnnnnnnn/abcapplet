// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as orderActions from '@actions/order'

// 自定义组件
import Decorate from '@components/decorate'
import OrderList from '@components/order-list'

// 自定义常量
import { PAYLOAD_ORDER_LIST } from '@constants/api'

@connect(state => state, {
  ...orderActions,
})
class OrderIndex extends Component {
  config = {
    navigationBarTitleText: '我的订单',
    navigationBarBackgroundColor: '#FFC919',
  }

  refOrderList = node => this.orderList = node

  /**
   * 到底部加载公寓下一页
   */
  onReachBottom() {
    this.orderList.onNextPage()
  }

  render() {
    const { orders } = this.props

    return (
      <View className='px-3'>
        {/* 背景底色 */}
        <Decorate height='300' />

        {/* 订单列表 */}
        <OrderList
          items={orders.list}
          ref={this.refOrderList}
          defaultPayload={PAYLOAD_ORDER_LIST}
          dispatchList={this.props.dispatchOrderList}
          dispatchNextPageList={this.props.dispatchNextPageOrderList}
        />
      </View>
    )
  }
}

export default OrderIndex
