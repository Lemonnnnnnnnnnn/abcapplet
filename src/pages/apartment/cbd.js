// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as cbdActions from '@actions/cbd'
import * as userActions from '@actions/user'
import * as distActions from '@actions/dist'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import Select from '@components/select'
import ApartmentList from '@components/apartment-list'
import ApartmentHeader from '@components/apartment-header'

// 自定义常量
import { PAGE_HOME } from '@constants/page'
import { PAYLOAD_CBD_APARTMENT_LIST } from '@constants/api'

@connect(state => state, {
  ...cbdActions,
  ...userActions,
  ...distActions,
  ...apartmentActions
})
class ApartmentCbd extends Component {
  config = {
    navigationBarTitleText: '商圈合集',
  }

  state = {
    id: 0,
    defaultPayload: {},
  }

  refApartmentList = (node) => this.apartmentList = node

  componentWillMount() {
    const { id } = this.$router.params
    const { payload: user } = this.props.dispatchUser()

    const defaultPayload = { ...PAYLOAD_CBD_APARTMENT_LIST, cbd: id }

    // 获取字典
    this.props.dispatchDistList(user.citycode)

    // 获取活动详情
    this.props.dispatchCbdShow(defaultPayload)
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

  /**Î
   * 当选择栏变化时更新公寓数据
   */
  onApartmentPayloadChange({ payload }) {
    const { defaultPayload } = this.state
    this.apartmentList.onReset({ ...defaultPayload, ...payload })
  }

  render() {
    const { apartments, dists, cbds } = this.props
    const { id, defaultPayload } = this.state

    const cbd = cbds.find(i => i.id == id) || {
      title: '',
      cover: '',
      desc: '',
      total: 0,
    }

    Taro.setNavigationBarTitle({ title: cbd.title })

    return <View className='page-white'>
      {/* 头部 */}
      <View className='mx-2 py-3'>
        <ApartmentHeader
          title={cbd.title}
          cover={cbd.cover}
          desc={cbd.desc}
          total={cbd.apartment_num}
        />
      </View>

      {/* 赛选器 */}
      <Select
        top={0}
        showCbd={false}
        isFixed={false}
        autoSortDist={[]}
        cbdDist={dists.cbd_list}
        priceDist={dists.price_list}
        houseTypeDist={dists.housetype_list}
        specialSelectDist={dists.special_select}
        onApartmentPayloadChange={this.onApartmentPayloadChange}
      />

      <View className='mx-2'>
        {/* 公寓列表 */}
        <ApartmentList
          key={apartments.type}
          type={apartments.type}
          items={apartments.list}
          ref={this.refApartmentList}
          defaultPayload={defaultPayload}

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
