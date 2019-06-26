// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import ApartmentList from '@components/apartment-list'

// 自定义常量
import { PAYLOAD_CBD_APARTMENT_LIST } from '@constants/api'

@connect(state => state, {
  ...apartmentActions
})
class ApartmentCbd extends Component {
  config = {
    navigationBarTitleText: '商圈合集',
  }

  state = {
    defaultPayload: {},
  }

  refApartmentList = (node) => this.apartmentList = node

  componentWillMount() {
    const { id = 49 } = this.$router.params

    Taro.getLocation().then(res => {
      const defaultPayload = {
        ...PAYLOAD_CBD_APARTMENT_LIST,
        cbd: id,
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
        dispatchList={this.props.dispatchCbdApartmentList}
        dispatchNextPageList={this.props.dispatchNextPageCbdApartmentList}
      />
    </View>
  }
}

export default ApartmentCbd
