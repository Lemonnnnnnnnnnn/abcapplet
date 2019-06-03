import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import CityModal from '@components/city-modal'
import Carousel from '@components/carousel'
import Search from '@components/search'
import Header from '@components/header'
import Select from '@components/select'
import Apartment from '@components/apartment'
import Placeholder from '@components/placeholder'


import * as adActions from '@actions/ad'
import * as cbdActions from '@actions/cbd'
import * as distActions from '@actions/dist'
import * as cityActions from '@actions/city'
import * as userActions from '@actions/user'
import * as bannerActions from '@actions/banner'
import * as activityActions from '@actions/activity'
import * as recommendActions from '@actions/recommend'
import * as apartmentActions from '@actions/apartment'

import { PAGE_CBD_INDEX } from '@constants/page'
import { MESSAGE_HOT_CBD, MESSAGE_RECOMMEND_APARTMENT, MESSAGE_ACTIVITY, MESSAGE_APARTMENT } from '@constants/message'

@connect(state => state, {
  ...adActions,
  ...cbdActions,
  ...cityActions,
  ...distActions,
  ...userActions,
  ...bannerActions,
  ...activityActions,
  ...recommendActions,
  ...apartmentActions,
})
class ApartmentHome extends Component {
  config = {
    navigationBarTitleText: '公寓ABC',
  }

  state = {
    // 搜索相关
    searchScrollTop: null,
    searchIsFixed: false,

    // 公寓相关
    apartmentPage: 1,
    apartmentLoading: false,
    apartmentHasMore: true,
    apartmentIsFixed: false,
    apartmentScrollTop: null,
  }

  componentWillMount() {
    // 获取用户数据 和 刷新页面数据
    const { payload: user } = this.props.dispatchUser()
    this.onSelectCity(user.citycode)

    // 拉取城市列表
    this.props.dispatchCityList()
  }

  onSelectCity(citycode) {
    // 当城市 id 不存在的时候不读取数据
    if (citycode === 0 || !citycode) return;

    this.props.dispatchUserCity(citycode)
    this.props.dispatchAdList(citycode)
    this.props.dispatchCBDList(citycode)
    this.props.dispatchDistList(citycode)
    this.props.dispatchBannerList(citycode)
    this.props.dispatchActivityList(citycode)
    this.props.dispatchRecommendList(citycode)

    // 初始化公寓相关数据
    this.setState({
      apartmentPage: 1,
      apartmentHasMore: true,
      apartmentScrollTop: null
    })
    this.loadingApartment()
  }

  /**
   * 选择城市
   * @param {*} param0
   */
  onChangeSelector(e) {
    const { citys } = this.props
    const value = e.currentTarget.value

    const selector = citys.map(i => i.title)
    const selectorChecked = selector[value]

    const newCity = citys.filter(i => i.title === selectorChecked)[0]
    this.onSelectCity(newCity.id)
  }

  onPageScroll({ scrollTop }) {
    const { apartmentIsFixed, apartmentScrollTop, searchScrollTop, searchIsFixed } = this.state

    // 搜索相关
    !searchScrollTop
      && Taro.createSelectorQuery()
        .in(this.$scope)
        .select('.home-search')
        .boundingClientRect()
        .exec(res => res[0].height > 0 && this.setState({ searchScrollTop: res[0].height }))

    scrollTop > searchScrollTop
      && !searchIsFixed
      && this.setState({ searchIsFixed: true })

    scrollTop < searchScrollTop
      && searchIsFixed
      && this.setState({ searchIsFixed: false })

    // 公寓相关
    !apartmentScrollTop
      && Taro.createSelectorQuery()
        .in(this.$scope)
        .select('.home-select')
        .boundingClientRect()
        .exec(res => this.setState({ apartmentScrollTop: res[0].top }))

    scrollTop > apartmentScrollTop
      && !apartmentIsFixed
      && this.setState({ apartmentIsFixed: true })

    scrollTop < apartmentScrollTop
      && apartmentIsFixed
      && this.setState({ apartmentIsFixed: false })
  }

  onReachBottom() {
    this.loadingApartment()
  }

  loadingApartment() {
    let { apartmentPage, apartmentHasMore } = this.state
    const { user: { citycode } } = this.props

    if (!apartmentHasMore) return;
    this.setState({ apartmentLoading: true })

    this.props
      .dispatchApartmentList({
        city: citycode,
        current_page: apartmentPage
      }).then(res => this.setState({
        apartmentPage: ++apartmentPage,
        apartmentLoading: false,
        apartmentHasMore: res.data.data.list.length > 0
      }))
  }

  render() {
    const { apartmentLoading, apartmentIsFixed, apartmentHasMore, searchIsFixed, searchScrollTop } = this.state
    const { user, cbds, ads, citys, banners, recommends, activities, dists, apartments } = this.props

    // 设置城市选择器
    const selector = citys.map(i => i.title)
    const selectorCity = citys.filter(i => i.id === user.citycode)[0]
    const selectorChecked = selectorCity ? selectorCity.title : '厦门市'

    return (
      <View className='page-white m-2 mb-3'>
        {/* 搜索框 & 城市选择器 */}
        <View className='home-search'>
          <Search
            className='mb-2'
            isFixed={searchIsFixed}
            selector={selector}
            selectorChecked={selectorChecked}
            onChangeSelector={this.onChangeSelector}
          />
        </View>

        {/* 轮播 */}
        {banners.length > 0 &&
          <Carousel
            className='mt-2'
            type='banner'
            carousel={banners}
          />
        }

        {/* 热门租房商圈 */}
        {cbds.length > 0 &&
          <View>
            <Header
              className='my-2'
              title={MESSAGE_HOT_CBD} url={PAGE_CBD_INDEX} hasExtra
            />
            <Carousel
              type='normal'
              imageHeight='176'
              imageWidth='312'
              carousel={cbds}
              hasContent={false}
            />
          </View>
        }

        {/* 广告 */}
        {ads.length > 0 &&
          <Carousel
            className='mt-2'
            type='normal'
            imageHeight='126'
            imageWidth='686'
            carousel={ads}
            hasContent={false}
          />
        }

        {/* 推荐品牌公寓 */}
        {recommends.length > 0 &&
          <View>
            <Header
              className='my-2'
              title={MESSAGE_RECOMMEND_APARTMENT}
              url={PAGE_CBD_INDEX} hasExtra
            />
            <Carousel
              type='normal'
              imageHeight='275'
              imageWidth='642'
              carousel={recommends}
              hasContent={false}
            />
          </View>
        }

        {/* 活动专区 */}
        {activities.length > 0 &&
          <View>
            <Header
              className='my-2'
              title={MESSAGE_ACTIVITY}
              hasExtra={false}
            />
            <Carousel
              type='normal'
              imageHeight='240'
              imageWidth='414'
              carousel={activities}
              hasContent={false}
            />
          </View>
        }

        {/* 严选公寓 */}
        <View>
          <Header
            className='my-2'
            title={MESSAGE_APARTMENT}
            hasExtra={false}
          />
          <View className='home-select'>
            <Select
              top={searchScrollTop}
              isFixed={apartmentIsFixed}

              autoSortDist={[]}
              cbdDist={dists.cbd_list}
              priceDist={dists.price_list}
              houseTypeDist={dists.housetype_list}
              specialSelectDist={dists.special_select}
            />
          </View>

          {apartments.length > 0 && apartments.map(i =>
            <Apartment key={i.id} apartment={i} className='mt-3' />
          )}
          <Placeholder className='mt-2' show={apartmentLoading} quantity={5} />

          {
            !apartmentLoading && !apartmentHasMore &&
            <View className='text-center text-small mt-3'>
              <Text className='text-muted'>我可是有底线的哦</Text>
            </View>
          }
        </View>

        {/* 城市模态框 */}
        <CityModal
          city={citys}
          citycode={user.citycode}
          onSelectCity={this.onSelectCity}
        />
      </View>
    )
  }
}

export default ApartmentHome
