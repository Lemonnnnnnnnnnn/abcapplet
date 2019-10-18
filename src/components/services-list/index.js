import Taro,{Component} from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件

import Placeholder from '@components/placeholder'
import ServiceItem from '@components/services-item'


// 常量
import { LOCALE_NO_DATA } from '@constants/locale'
import BaseList from '../base-list'

class ServiceList extends BaseList {
  render() {
    const { hasMore, loading, page } = this.state
    const {  mini , lists ,time} = this.props

    return (
    <View className>

      {/* 渲染 行程列表 */}
      <View className='at-row at-row--wrap'>
        {page !== 0 && lists.map((i, index) =>
          <View className={`at-col ${mini && (index % 2 === 0 ? 'pr-1' : 'pl-1')} ${mini ? 'at-col-6' : 'at-col-12'}`} key={i.id}>
            <ServiceItem
              mini={mini}
              service={i}
              time={time}
              className='mt-1'
              onSetReset={this.props.onSetReset}
            />
          </View>
        )}
      </View>


      {/* 无数据 */}
      {lists.length === 0
        && hasMore === false
        && loading === false
        && <View class='page-demo'>{LOCALE_NO_DATA}</View>}
    </View>)
  }
}

export default ServiceList

