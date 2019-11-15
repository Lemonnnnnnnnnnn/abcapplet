// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseList from '@components/base-list'

import ApartmentBargainItem from '@components/apartment-bargain-item'



class ApartmentBargainList extends BaseList {

  render() {
    const { bargainList ,block } = this.props
    return (
      <View>
        {
          bargainList.map(i =>
            <ApartmentBargainItem
              item={i}
              block={block}
              key={i}
            />)
        }
      </View>
    )

  }
}
export default ApartmentBargainList

