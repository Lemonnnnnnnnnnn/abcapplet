import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import CityModal from '@components/city-modal'
import * as homeActions from '@actions/home'
import * as userActions from '@actions/user'

@connect(state => state, { ...homeActions, ...userActions })
class ApartmentHome extends Component {
  config = {
    navigationBarTitleText: '公寓ABC',
    enablePullDownRefresh: true,
  }

  componentDidShow() {
    this.props.dispatchCityList()
  }

  onSelectCity(city) {
    const citycode = city.id;
    this.props.dispatchUserCity(citycode)
  }

  render() {
    const { user: { userInfo }, home: { cityList } } = this.props

    return (
      <View className='page-demo'>

        {/* 城市模态框 */}
        <CityModal
          citycode={userInfo.citycode}
          cityList={cityList}
          onSelectCity={this.onSelectCity}
        />
      </View>
    )
  }
}

export default ApartmentHome
