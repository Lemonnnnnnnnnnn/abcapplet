// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as roomActions from '@actions/room'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import ApartmentList from '@components/apartment-list'

// 常量
import {
  PAYLOAD_FAVORITE_APARTMENT_LIST,
  PAYLOAD_FAVORITE_HOUSE_TYPE_LIST,
} from '@constants/api'

import buryPoint from '../../utils/bury-point'

@connect(state => state, {
  ...roomActions,
  ...userActions,
  ...apartmentActions,
})
class UserFavorite extends Component {
  config = {
    navigationBarTitleText: '心愿单'
  }

  state = {
    current: 0,
    tabList: [
      { title: '户型', ref: 'houseTypeList' },
      { title: '公寓', ref: 'apartmentList' },
    ]
  }


  refHouseTypeList = (node) => this.houseTypeList = node
  refApartmentList = (node) => this.apartmentList = node

  handleClick(value) {
    const { tabList } = this.state
    const { ref } = tabList[value]

    this[ref].onReset(null)
    this.setState({ current: value })
  }

  componentDidMount() {

    this.houseTypeList.onReset(null)
  }

  componentDidShow() {
    buryPoint()
    this.onReset()
  }


  /**
   * 触底加载数据
   */
  onReachBottom() {
    const { tabList, current } = this.state
    const { ref } = tabList[current]
    this[ref].onNextPage()
  }

  /**
   * 删除心愿单
   * 使用异步，防止删除请求没发出去就刷新页面数据了
   */
  onDeleteFavorite({ payload }) {
    this.props.dispatchFavoriteDelete(payload)
      .then(() => this.onReset())
  }

  /**
   * 刷新页面数据
   */
  onReset() {
    const { tabList, current } = this.state
    const { ref } = tabList[current]
    this[ref] && this[ref].onReset(null)
  }

  render() {
    const { favoriteApartment, favoriteHouseType } = this.props


    return (
      <View class='favorite'>
        <AtTabs
          animated
          current={this.state.current}
          tabList={this.state.tabList}
          onClick={this.handleClick.bind(this)}
        >
          {/* 户型 */}
          <AtTabsPane current={this.state.current} index={0} >
            <ApartmentList
              initReset={false}
              className='mx-2'
              key={favoriteHouseType.type}
              type={favoriteHouseType.type}
              items={favoriteHouseType.list}
              ref={this.refHouseTypeList}
              defaultPayload={PAYLOAD_FAVORITE_HOUSE_TYPE_LIST}
              imgHeight={432}


              onDeleteFavorite={this.onDeleteFavorite}
              dispatchList={this.props.dispatchFavoriteHouseTypeList}
              dispatchNextPageList={this.props.dispatchNextPageFavoriteHouseTypeList}
            />
          </AtTabsPane>

          {/* 公寓 */}
          <AtTabsPane current={this.state.current} index={1} >
            <ApartmentList
              className='mx-2'
              isapartment='apartmrnt'
              initReset={false}
              key={favoriteApartment.type}
              type={favoriteApartment.type}
              items={favoriteApartment.list}
              ref={this.refApartmentList}
              defaultPayload={PAYLOAD_FAVORITE_APARTMENT_LIST}
              imgHeight={432}


              onDeleteFavorite={this.onDeleteFavorite}
              dispatchList={this.props.dispatchFavoriteApartmentList}
              dispatchNextPageList={this.props.dispatchNextPageFavoriteApartmentList}
            />
          </AtTabsPane>

          {/* 房间 */}

        </AtTabs>
      </View>
    )
  }
}

export default UserFavorite
