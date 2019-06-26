// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import ApartmentList from '@components/apartment-list'

// 自定义常量
import { PAYLOAD_ACTIVITY_APARTMENT_LIST } from '@constants/api'

@connect(state => state, {
  ...userActions,
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

    Taro.getLocation().then(res => {
      const defaultPayload = {
        ...PAYLOAD_ACTIVITY_APARTMENT_LIST,
        id,
        city: user.citycode,
        latitude: res.latitude,
        longitude: res.longitude,
      }
      this.setState({ defaultPayload })
      this.apartmentList.onReset(defaultPayload)
    })

  }

  render() {

    const { apartments } = this.props
    const { defaultPayload } = this.state
    return <View>
      <ApartmentList
        initReset={false}
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
  }
}

export default ApartmentCbd
