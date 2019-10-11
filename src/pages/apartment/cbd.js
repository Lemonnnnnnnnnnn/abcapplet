// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as distActions from '@actions/dist'
import * as apartmentActions from '@actions/apartment'
import * as homeActions from '@actions/home'

// 自定义组件
import Select from '@components/select'
import ApartmentList from '@components/apartment-list'
import ApartmentHeader from '@components/apartment-header'

// 自定义常量
import { PAYLOAD_CBD_APARTMENT_LIST } from '@constants/api'

import buryPoint from '../../utils/bury-point'

@connect(state => state, {
  ...userActions,
  ...distActions,
  ...apartmentActions,
  ...homeActions
})
class ApartmentCbd extends Component {
  config = {
    navigationBarTitleText: '商圈合集',
  }

  state = {
    id: 0,
    defaultPayload: {},
    // 选择器相关
    selectIsFixed: false,
    selectScrollTop: null,
    cityCode: 0,
    apartment_num: 0,
  }

  refApartmentList = (node) => this.apartmentList = node

  componentWillMount() {
    const { id } = this.$router.params
    const { payload: user } = this.props.dispatchUser()
    buryPoint()
    const {
      selectScrollTop,
    } = this.state

    const defaultPayload = { ...PAYLOAD_CBD_APARTMENT_LIST, cbd: id }

    // 获取筛选器和搜索框距离顶部的距离

    setTimeout(() => {
      !selectScrollTop
        && Taro.createSelectorQuery()
          .in(this.$scope)
          .select('.cbd-select')
          .boundingClientRect()
          .exec(res => this.setState({ selectScrollTop: res[0].top, }))
    }, 500);

    // 获取字典
    this.props.dispatchDistList(user.citycode)

    this.setState({ cityCode: user.citycode })

    // 获取活动详情
    this.props.dispatchCbdShow(defaultPayload)
      .then((res) => {
        this.setState({ apartment_num: res.data.data.cbd.apartment_num })
      })
    // .catch(() => Taro.reLaunch({ url: PAGE_HOME }))

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

  /**Î
   * 当选择栏变化时更新公寓数据
   */
  onApartmentPayloadChange({ payload }) {
    const { defaultPayload } = this.state
    this.apartmentList.onReset({ ...defaultPayload, ...payload })
  }

  // onApartmentPayloadChange({ payload }) {
  //   this.apartmentList.onReset(payload)
  // }

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
    const { dists, home, cbdApartment } = this.props
    const { id, defaultPayload, selectIsFixed, cityCode, apartment_num } = this.state

    const cbd = home.hot_cbd.find(i => i.id == id) || {
      title: '',
      cover: '',
      desc: '',
      total: 0,
    }

    cbd.title !== '' && Taro.setNavigationBarTitle({ title: cbd.title })

    return <View className='page-white'>
      {/* 头部 */}
      <View className='mx-2 py-3'>
        <ApartmentHeader
          title={cbd.title}
          cover={cbd.cover}
          desc={cbd.desc}
          total={apartment_num}
        />
      </View>

      {/* 筛选器 */}
      <View className='cbd-select'>
        <Select
          top={0}
          showCbd={false}
          isFixed={selectIsFixed}
          cbdSelect
          cbdId={id}

          cityCode={cityCode}
          autoSortDist={[]}
          cbdDist={dists.cbd_list}
          priceDist={dists.price_list}
          houseTypeDist={dists.housetype_list}
          specialSelectDist={dists.special_select}
          onApartmentPayloadChange={this.onApartmentPayloadChange}
        />
      </View>

      <View className='mx-2'>
        {/* 公寓列表 */}
        <ApartmentList
          key={cbdApartment.type}
          type={cbdApartment.type}
          items={cbdApartment.list}
          ref={this.refApartmentList}
          defaultPayload={defaultPayload}
          imgHeight={432}

          onCreateFavorite={this.onCreateFavorite}
          onDeleteFavorite={this.onDeleteFavorite}
          dispatchList={this.props.dispatchCbdApartmentList}
          dispatchNextPageList={this.props.dispatchNextPageCbdApartmentList}
        />
      </View>
    </View>
  }
}

export default ApartmentCbd
