// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseList from '@components/base-list'
import RiskItem from '@components/risk-item'

// 常量
import { LOCALE_NO_DATA } from '@constants/locale'

class OrderList extends BaseList {

  render() {
    const { items, className, show } = this.props
    const { hasMore, loading, page } = this.state

    return (show && <View className={className}>

      {/* 渲染 公寓列表 */}
      {page != 1 && items.map(i =>
        <RiskItem key={i.id} risk={i} className='mb-3' />
      )}

      {/* 无数据 */}
      {items.length === 0
        && hasMore === false
        && loading === false
        && <View class='page-demo'>{LOCALE_NO_DATA}</View>}
    </View>)
  }
}

export default OrderList
