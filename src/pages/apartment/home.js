import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import CityModal from '@components/city-modal'
import Carousel from '@components/carousel'
import Search from '@components/search'
import Header from '@components/header'

import * as adActions from '@actions/ad'
import * as cbdActions from '@actions/cbd'
import * as cityActions from '@actions/city'
import * as userActions from '@actions/user'
import * as bannerActions from '@actions/banner'
import * as activityActions from '@actions/activity'
import * as recommendActions from '@actions/recommend'

import { PAGE_CBD_INDEX } from '@constants/page'
import { MESSAGE_HOT_CBD, MESSAGE_RECOMMEND_APARTMENT, MESSAGE_ACTIVITY } from '@constants/message'

@connect(state => state, {
  ...adActions,
  ...cbdActions,
  ...cityActions,
  ...userActions,
  ...bannerActions,
  ...activityActions,
  ...recommendActions,
})
class ApartmentHome extends Component {
  config = {
    navigationBarTitleText: '公寓ABC',
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
    this.props.dispatchBannerList(citycode)
    this.props.dispatchActivityList(citycode)
    this.props.dispatchRecommendList(citycode)
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

  render() {
    const { user, cbds, ads, citys, banners, recommends, activities } = this.props

    // 设置城市选择器
    const selector = citys.map(i => i.title)
    const selectorCity = citys.filter(i => i.id === user.citycode)[0]
    const selectorChecked = selectorCity ? selectorCity.title : '厦门市'

    return (
      <View className='page-white m-2 mb-3'>
        {/* <View className='page-home'> */}

        {/* 搜索框 & 城市选择器 */}
        <Search
          selector={selector}
          selectorChecked={selectorChecked}
          onChangeSelector={this.onChangeSelector}
        />

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
              className='mt-2'
              type='normal'
              imageHeight='176'
              imageWidth='312'
              carousel={cbds}
              hasContent={false}
            />
          </View>
        }

        {/* 广告 */}
        <Carousel
          className='mt-2'
          type='normal'
          imageHeight='126'
          imageWidth='686'
          carousel={ads}
          hasContent={false}
        />

        {/* 推荐品牌公寓 */}
        {recommends.length > 0 &&
          <View>
            <Header
              className='my-2'
              title={MESSAGE_RECOMMEND_APARTMENT}
              url={PAGE_CBD_INDEX} hasExtra
            />
            <Carousel
              className='mt-2'
              type='normal'
              imageHeight='275'
              imageWidth='642'
              carousel={recommends}
              hasContent={false}
            />
          </View>
        }

        {/* 推荐品牌公寓 */}
        {activities.length > 0 &&
          <View>
            <Header
              className='my-2'
              title={MESSAGE_ACTIVITY}
              hasExtra={false}
            />
            <Carousel
              className='mt-2'
              type='normal'
              imageHeight='240'
              imageWidth='414'
              carousel={activities}
              hasContent={false}
            />
          </View>
        }

        {/* 城市模态框 */}
        <CityModal
          city={citys}
          citycode={user.citycode}
          onSelectCity={this.onSelectCity}
        />
        {/* </View> */}
      </View>
    )
  }
}

export default ApartmentHome
