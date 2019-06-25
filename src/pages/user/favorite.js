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
import RoomList from '@components/room-list'
import ApartmentList from '@components/apartment-list'

// 常量
import {
  PAYLOAD_FAVORITE_APARTMENT_LIST,
  PAYLOAD_FAVORITE_HOUSE_TYPE_LIST,
  PAYLOAD_FAVORITE_ROOM_LIST,
} from '@constants/api'

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
    current: 2,
    tabList: [
      { title: '户型', ref: 'houseTypeList' },
      { title: '公寓', ref: 'apartmentList' },
      { title: '房间', ref: 'roomList' },
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

  onReachBottom() {
    const { tabList, current } = this.state
    const { ref } = tabList[current]
    this[ref].onNextPage()
  }

  /**
   * 删除心愿单
   */
  async onDeleteFavorite({ payload }) {
    await this.props.dispatchFavoriteDelete(payload)

    // 使用异步，防止删除请求没发出去就刷新页面数据了
    this.onReset()
  }

  /**
   * 刷新页面数据
   */
  onReset() {
    const { tabList, current } = this.state
    const { ref } = tabList[current]
    this[ref].onReset(null)
  }

  render() {
    const { apartments, rooms } = this.props

    return (
      <View>
        <AtTabs
          animated
          current={this.state.current}
          tabList={this.state.tabList}
          onClick={this.handleClick.bind(this)}
        >
          {/* 户型 */}
          <AtTabsPane current={this.state.current} index={0} >
            <ApartmentList className='mx-2'
              type={apartments.type}
              items={apartments.list}
              ref={this.refHouseTypeList}
              defaultPayload={PAYLOAD_FAVORITE_HOUSE_TYPE_LIST}

              onDeleteFavorite={this.onDeleteFavorite}
              dispatchList={this.props.dispatchFavoriteHouseTypeList}
              dispatchNextPageList={this.props.dispatchNextPageFavoriteHouseTypeList}
            />
          </AtTabsPane>

          {/* 公寓 */}
          <AtTabsPane current={this.state.current} index={1} >
            <ApartmentList className='mx-2'
              type={apartments.type}
              items={apartments.list}
              ref={this.refApartmentList}
              defaultPayload={PAYLOAD_FAVORITE_APARTMENT_LIST}

              onDeleteFavorite={this.onDeleteFavorite}
              dispatchList={this.props.dispatchFavoriteApartmentList}
              dispatchNextPageList={this.props.dispatchNextPageFavoriteApartmentList}
            />
          </AtTabsPane>

          {/* 房间 */}
          <AtTabsPane current={this.state.current} index={2} >
            <RoomList className='mx-2'
              type={rooms.type}
              items={rooms.list}
              ref={this.refRoomList}
              defaultPayload={PAYLOAD_FAVORITE_ROOM_LIST}

              onDeleteFavorite={this.onDeleteFavorite}
              dispatchList={this.props.dispatchFavoriteRoomList}
              dispatchNextPageList={this.props.dispatchNextPageFavoriteRoomList}
            />
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default UserFavorite
