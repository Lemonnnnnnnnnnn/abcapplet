import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseList from '@components/base-list'
import Placeholder from '@components/placeholder'
import ServiceItem from '@components/services-item'

// 常量
import { LOCALE_NO_DATA } from '@constants/locale'

class ServiceList extends BaseList {
  render() {
    const { hasMore, loading, page } = this.state
    const {  mini , items } = this.props

    console.log('-------------')
    console.log(this.props)
    console.log(this.state)

    return (
    <View >

      {/* 渲染 行程列表 */}
      <View className='at-row at-row--wrap'>
        {page !== 1 && items.map((i, index) =>
          <View className={`at-col ${mini && (index % 2 === 0 ? 'pr-1' : 'pl-1')} ${mini ? 'at-col-6' : 'at-col-12'}`} key={i.id}>
            <ServiceItem
              mini={mini}
              service={i}
              className='mt-2'
            />
          </View>
        )}
      </View>

      {/* 记载效果 */}
      <Placeholder
        className='mt-2'
        show={loading && !mini}
        quantity={5}
      />

      {/* 无数据 */}
      {items.length === 0
        && hasMore === false
        && loading === false
        && <View class='page-demo'>{LOCALE_NO_DATA}</View>}
    </View>)
  }
}

export default ServiceList

