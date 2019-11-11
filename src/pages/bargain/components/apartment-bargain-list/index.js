// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseList from '@components/base-list'
import ApartmentBargainItem from '../apartment-bargain-item'


class ApartmentBargainList extends BaseList {

  render() {
    const locale = [1, 2, 3]
    return (
      <View>
        {
          locale.map(i =>
            <ApartmentBargainItem key={i} />)
        }
      </View>
    )

  }
}
export default ApartmentBargainList

