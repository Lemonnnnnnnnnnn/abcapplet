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

import { PAGE_CBD_INDEX } from '@constants/page'
import { MESSAGE_HOT_CBD } from '@constants/message'

@connect(state => state, {
  ...adActions,
  ...cbdActions,
  ...cityActions,
  ...userActions,
  ...bannerActions,
})
class ApartmentHome extends Component {
  config = {
    navigationBarTitleText: '公寓ABC',
  }

  componentDidShow() {
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
    this.props.dispatchBanner(citycode)
    this.props.dispatchAdList(citycode)
    this.props.dispatchCBD(citycode)
  }

  /**
   * 选择城市
   * @param {*} param0
   */
  onChangeSelector(e) {
    const { city } = this.props
    const value = e.currentTarget.value

    const selector = city.map(i => i.title)
    const selectorChecked = selector[value]

    const newCity = city.filter(i => i.title === selectorChecked)[0]
    this.onSelectCity(newCity.id)
  }

  render() {
    const { user, cbd, ad, city, banner } = this.props

    // 设置城市选择器
    const selector = city.map(i => i.title)
    const selectorCity = city.filter(i => i.id === user.citycode)[0]
    const selectorChecked = selectorCity ? selectorCity.title : '厦门市'

    return (
      <View className='page-white m-2'>
        {/* <View className='page-home'> */}

        {/* 搜索框 & 城市选择器 */}
        <Search
          selector={selector}
          selectorChecked={selectorChecked}
          onChangeSelector={this.onChangeSelector}
        />

        {/* 轮播 */}
        {banner.length > 0 &&
          <Carousel
            className='mt-2'
            type='banner'
            carousel={banner}
          />
        }

        {/* 热门租房商圈 */}
        {cbd.length > 0 &&
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
              carousel={cbd}
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
          carousel={ad}
          hasContent={false}
        />

        {/* 城市模态框 */}
        <CityModal
          city={city}
          citycode={user.citycode}
          onSelectCity={this.onSelectCity}
        />
        {/* </View> */}
      </View>
    )
  }
}

export default ApartmentHome
