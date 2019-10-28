// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as distActions from '@actions/dist'
// import * as activityActions from '@actions/activity'
import * as apartmentActions from '@actions/apartment'
import * as homeActions from '@actions/home'

// 自定义组件
import Select from '@components/select'
import ApartmentList from '@components/apartment-list'

// 自定义常量
import { PAGE_HOME } from '@constants/page'
import { PAYLOAD_ACTIVITY_APARTMENT_LIST } from '@constants/api'

import buryPoint from '../../utils/bury-point'
import ApartmentHeader from './components/apartment-header'

@connect(state => state, {
  ...userActions,
  ...distActions,
  // ...activityActions,
  ...apartmentActions,
  ...homeActions,
})
class ApartmentCbd extends Component {
  config = {
    navigationBarTitleText: '活动合集',
  }

  state = {
    id: 0,
    defaultPayload: {},
    // 选择器相关
    selectIsFixed: false,
    selectScrollTop: null,
    cityCode: 0,
  }

  refApartmentList = (node) => this.apartmentList = node

  componentWillMount() {
    const { id } = this.$router.params
    const { payload: user } = this.props.dispatchUser()

    buryPoint()

    this.setState({ cityCode: user.citycode })

    const {
      selectScrollTop,
    } = this.state

    const defaultPayload = {
      ...PAYLOAD_ACTIVITY_APARTMENT_LIST,
      id,
      city: user.citycode,
    }

    // 获取筛选器和搜索框距离顶部的距离

    setTimeout(() => {
      !selectScrollTop
        && Taro.createSelectorQuery()
          .in(this.$scope)
          .select('.activity-select')
          .boundingClientRect()
          .exec(res => this.setState({ selectScrollTop: res[0].top, }))
    }, 500);

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

  /**
 * 利用坐标来确定什么时候 fixed 搜索栏和选择栏
 */

  onPageScroll({ scrollTop }) {
    const {
      selectIsFixed,
      selectScrollTop,
    } = this.state

    scrollTop > selectScrollTop
      && !selectIsFixed
      && this.setState({ selectIsFixed: true })


    scrollTop < selectScrollTop
      && selectIsFixed
      && this.setState({ selectIsFixed: false })

  }

  render() {
    const { dists, home, activityApartment } = this.props
    const { id, defaultPayload, selectIsFixed, cityCode } = this.state

    const activity = home.hot_activity.find(i => i.id == id) || {
      title: '',
      cover: '',
      desc: '',
    }

    activity.title !== '' && Taro.setNavigationBarTitle({ title: activity.title })

    return <View style={{ overflow: "hidden" }} className='page-white'>

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
      <View className='activity-select'>
        <Select
          top={0}
          isFixed={selectIsFixed}
          autoSortDist={[]}

          cbdSelect
          cityCode={cityCode}

          cbdDist={dists.cbd_list}
          priceDist={dists.price_list}
          houseTypeDist={dists.housetype_list}
          specialSelectDist={dists.special_select}
          onApartmentPayloadChange={this.onApartmentPayloadChange}
        />
      </View>

      {/* 公寓列表 */}
      <View className='mx-2'>
        <ApartmentList
          key={activityApartment.type}
          type={activityApartment.type}
          items={activityApartment.list}
          ref={this.refApartmentList}
          defaultPayload={defaultPayload}
          imgHeight={432}

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
