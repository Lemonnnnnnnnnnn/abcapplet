// Taro 相关
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

// 自定义组件
import BaseList from '@components/base-list'
import Placeholder from '@components/placeholder'
import ApartmentItem from '@components/apartment-item'

// 常量
import { LOCALE_NO_DATA, LOCALE_NO_MORE } from '@constants/locale'

class ApartmentList extends BaseList {

  render() {
    const { items, className, type } = this.props
    const { hasMore, loading, page } = this.state

    return (<View className={className}>
      {/* 渲染 公寓列表 */}
      {page != 1 && items.map(i =>
        <ApartmentItem
          key={i.uni_key}
          type={type}
          apartment={i}
          className='mt-2'
          onCreateFavorite={this.props.onCreateFavorite}
          onDeleteFavorite={this.props.onDeleteFavorite}
        />
      )}

      {/* 记载效果 */}
      <Placeholder
        className='mt-2'
        show={loading}
        quantity={5}
      />

      {/* 无数据 */}
      {items.length === 0
        && hasMore === false
        && loading === false
        && <View class='page-demo'>{LOCALE_NO_DATA}</View>}

      {/* 无更多数据 */}
      {items.length !== 0
        && !loading
        && !hasMore
        && <View className='text-center text-small my-3'>
          <Text className='text-muted'>{LOCALE_NO_MORE}</Text>
        </View>
      }
    </View>)
  }
}

export default ApartmentList
