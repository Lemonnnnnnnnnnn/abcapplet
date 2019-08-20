// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

// 自定义组件
import BaseList from '@components/base-list'
import RiskItem from '@components/risk-item'


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
        && <View className='mt-2 pt-4 pb-2 default-page-background' >
          <Image mode='widthFix' src='https://images.gongyuabc.com/image/page_risk.png' className='default-page-picture'></Image>
          <View  style={{ position: 'relative' }}>
            <View className='text-large text-center default-page-font' >您没有申请赔付哦~</View>
          </View>
        </View>


      }
    </View>)
  }
}

export default OrderList
