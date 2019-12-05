// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseList from '@components/base-list'
import RoomItem from '@components/room-item'

// 常量
import { LOCALE_NO_DATA } from '@constants/locale'

class RoomList extends BaseList {

  render() {
    const { items, className, type } = this.props
    const { hasMore, loading, page } = this.state

    return (<View className={className}>
      {/* 渲染 公寓列表 */}
      {page != 1 && items.map(i =>
        <RoomItem
          room={i}
          key={i.id}
          type={type}
          className='mt-2'
          onDeleteFavorite={this.props.onDeleteFavorite}
        />
      )}

      {/* 无数据 */}
      {items.length === 0
        && hasMore === false
        && loading === false
        && <View class='page-demo'>{LOCALE_NO_DATA}</View>}
    </View>)
  }
}

export default RoomList
