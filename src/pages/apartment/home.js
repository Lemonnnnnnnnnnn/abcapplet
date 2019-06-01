import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import CityModal from '@components/city-modal'
import Carousel from '@components/carousel'
import Search from '@components/search'
import Header from '@components/header'
import * as homeActions from '@actions/home'
import * as userActions from '@actions/user'
import * as adActions from '@actions/ad'
import { PAGE_CBD_INDEX } from '@constants/page'
import { MESSAGE_HOT_CBD } from '@constants/message'

@connect(state => state, { ...homeActions, ...userActions, ...adActions })
class ApartmentHome extends Component {
  config = {
    navigationBarTitleText: '公寓ABC',
  }

  state = {
    selector: [],
    selectorChecked: '厦门市',
  }

  componentDidShow() {
    const { user: { userInfo } } = this.props

    this.props.dispatchUser()
    this.props.dispatchCityList()
    this.onSelectCity(userInfo.citycode)
    this.setState({ selector: this.props.home.city.map(i => i.title) })
  }

  onSelectCity(citycode) {
    // 当城市 id 不存在的时候不读取数据
    if (citycode === 0) return;

    this.props.dispatchUserCity(citycode)
    this.props.dispatchCarousel(citycode)
    this.props.dispatchAdList(citycode)
    this.props.dispatchCBD(citycode)
  }

  /**
   * 选择城市
   * @param {*} param0
   */
  onChangeSelector(e) {
    const { home: { city } } = this.props
    const value = e.currentTarget.value
    const selectorChecked = this.state.selector[value]

    this.setState({ selectorChecked })

    const newCity = city.filter(i => i.title === selectorChecked)[0]
    this.onSelectCity(newCity.id)
  }

  render() {
    const { selector, selectorChecked } = this.state
    const { user, home, ad } = this.props
    const { userInfo = {} } = user
    const { city = [], carousel = [], cbd = [] } = home

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
        {carousel.length > 0 &&
          <Carousel
            className='mt-2'
            type='banner'
            carousel={carousel}
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
          citycode={userInfo.citycode}
          onSelectCity={this.onSelectCity}
        />
        {/* </View> */}
      </View>
    )
  }
}

export default ApartmentHome
