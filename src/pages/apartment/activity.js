// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as distActions from '@actions/dist'
import * as activityActions from '@actions/activity'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import Select from '@components/select'
import ApartmentList from '@components/apartment-list'
import ApartmentHeader from '@components/apartment-header'

// 自定义常量
import { PAGE_HOME } from '@constants/page'
import { PAYLOAD_ACTIVITY_APARTMENT_LIST } from '@constants/api'

@connect(state => state, {
  ...userActions,
  ...distActions,
  ...activityActions,
  ...apartmentActions,
})
class ApartmentCbd extends Component {
  config = {
    navigationBarTitleText: '活动合集',
  }

  state = {
    id: 0,
    defaultPayload: {},
  }

  refApartmentList = (node) => this.apartmentList = node

  componentWillMount() {
    const { id } = this.$router.params
    const { payload: user } = this.props.dispatchUser()

    const defaultPayload = {
      ...PAYLOAD_ACTIVITY_APARTMENT_LIST,
      id, city: user.citycode,
    }

    // 获取字典
    this.props.dispatchDistList(user.citycode)

    // 获取活动详情
    this.props.dispatchActivityShow(defaultPayload)
      .catch(() => Taro.reLaunch({ url: PAGE_HOME }))

    // 设置状态
    this.setState({ id, defaultPayload })
  }

  /**
   * 添加心愿单
   */
  onCreateFavorite({ payload }) {
    this.props.dispatchFavoriteCreate(payload)
  }

  /**
   * 删除心愿单
   */
  onDeleteFavorite({ payload }) {
    this.props.dispatchFavoriteDelete(payload)
  }

  /**
   * 到底部加载公寓下一页
   */
  onReachBottom() {
    this.apartmentList.onNextPage()
  }

  /**
   * 当选择栏变化时更新公寓数据
   */
  onApartmentPayloadChange({ payload }) {
    const { defaultPayload } = this.state
    this.apartmentList.onReset({ ...defaultPayload, ...payload })
  }

  render() {
    const { apartments, dists, activities } = this.props
    const { id, defaultPayload } = this.state

    const activity = activities.find(i => i.id == id) || {
      title: '',
      cover: '',
      desc: '',
    }

    activity.title !== '' && Taro.setNavigationBarTitle({ title: activity.title })

    return <View className='page-white'>

      {/* 头部 */}
      <View className='mx-2 py-3'>
        <ApartmentHeader
          title={activity.title}
          cover={activity.cover}
          desc={activity.subtitle}
          total={activity.apartment_num}
        />
      </View>

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
      <View className='mx-2'>
        <ApartmentList
          key={apartments.type}
          type={apartments.type}
          items={apartments.list}
          ref={this.refApartmentList}
          defaultPayload={defaultPayload}

          onCreateFavorite={this.onCreateFavorite}
          onDeleteFavorite={this.onDeleteFavorite}
          dispatchList={this.props.dispatchActivityApartmentList}
          dispatchNextPageList={this.props.dispatchNextPageActivityApartmentList}
        />
      </View>
    </View>
  }
}

export default ApartmentCbd
