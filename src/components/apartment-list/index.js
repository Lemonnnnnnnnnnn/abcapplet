// Taro 相关
import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

// 自定义组件
import BaseList from '@components/base-list'
import Placeholder from '@components/placeholder'
import ApartmentItem from '@components/apartment-item'

// 常量
import { LOCALE_NO_DATA } from '@constants/locale'


// Redux 相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'


@connect(state => state, {
  ...apartmentActions,
})

class ApartmentList extends BaseList {

  render() {
    const ScrollWrapStyle = {
      whiteSpace: "nowrap"
    }

    const imageStyle = {
      height: Taro.pxTransform(346),
      display: "inline-block",
      marginRight : Taro.pxTransform(28)
    }


    const { items, className, type, mini, show, nearbyPost , imgHeight} = this.props
    const { hasMore, loading, page } = this.state


    return (show && <View className={className}>


      {/* 渲染 公寓列表 */}
      <View className='at-row at-row--wrap mb-3 '>
        {
          nearbyPost
            ?
            <View style={ScrollWrapStyle} className='at-col'>
              <ScrollView scrollX>
                {nearbyPost.map((i) =>
                  <View style={imageStyle} className='image' key={i.id}>
                    <ApartmentItem
                      nearbyPost
                      mini={mini}
                      type={type}
                      apartment={i}
                      className='mt-2'
                    />
                  </View>
                )}
              </ScrollView>
            </View>
            :
            page != 1 && items.map((i, index) =>
              <View className={`at-col ${mini && (index % 2 === 0 ? 'pr-1' : 'pl-1')} ${mini ? 'at-col-6' : 'at-col-12'}`} key={i.id}>
                <ApartmentItem
                  mini={mini}
                  imgHeight={imgHeight}
                  type={type}
                  apartment={i}
                  className='mt-2'
                  onCreateFavorite={this.props.onCreateFavorite}
                  onDeleteFavorite={this.props.onDeleteFavorite}
                />
              </View>
            )
        }
      </View>


      {/* 无数据 */}
      {/* {items.length === 0
        && hasMore === false
        && loading === false
        && <View class='page-demo'>{LOCALE_NO_DATA}</View>} */}
    </View>)
  }
}

export default ApartmentList
