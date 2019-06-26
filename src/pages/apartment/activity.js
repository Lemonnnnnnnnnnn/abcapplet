// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as distActions from '@actions/dist'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import Select from '@components/select'
import ApartmentList from '@components/apartment-list'

// 自定义常量
import { PAYLOAD_ACTIVITY_APARTMENT_LIST } from '@constants/api'

@connect(state => state, {
  ...userActions,
  ...distActions,
  ...apartmentActions,
})
class ApartmentCbd extends Component {
  config = {
    navigationBarTitleText: '活动合集',
  }

  state = {
    defaultPayload: {},
  }

  refApartmentList = (node) => this.apartmentList = node

  componentWillMount() {
    const { id = 3 } = this.$router.params
    const { payload: user } = this.props.dispatchUser()
    this.props.dispatchDistList(user.citycode)

    const defaultPayload = {
      ...PAYLOAD_ACTIVITY_APARTMENT_LIST,
      id,
      city: user.citycode,
    }
    this.setState({ defaultPayload })
  }

  /**
   * 当选择栏变化时更新公寓数据
   */
  onApartmentPayloadChange({ payload }) {
    const { defaultPayload } = this.state
    this.apartmentList.onReset({ ...defaultPayload, ...payload })
  }


  render() {

    const { apartments, dists } = this.props
    const { defaultPayload } = this.state
    return <View className='page-white'>
      <View className='mx-2'>
        {/* 赛选器 */}
        <Select
          top={0}
          isFixed={false}
          autoSortDist={[]}
          cbdDist={dists.cbd_list}
          priceDist={dists.price_list}
          houseTypeDist={dists.housetype_list}
          specialSelectDist={dists.special_select}
          onApartmentPayloadChange={this.onApartmentPayloadChange}
        />

        {/* 公寓列表 */}
        <ApartmentList
          key={apartments.type}
          type={apartments.type}
          items={apartments.list}
          ref={this.refApartmentList}
          defaultPayload={defaultPayload}

          // onCreateFavorite={this.onCreateFavorite}
          // onDeleteFavorite={this.onDeleteFavorite}
          dispatchList={this.props.dispatchActivityApartmentList}
          dispatchNextPageList={this.props.dispatchNextPageActivityApartmentList}
        />
      </View>
    </View>
  }
}

export default ApartmentCbd
