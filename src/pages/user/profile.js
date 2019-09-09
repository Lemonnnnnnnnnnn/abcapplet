// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtIcon, AtFloatLayout } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as distActions from '@actions/dist'

// 自定义组件
import Decorate from '@components/decorate'
import UserHeader from '@components/user-header'
import UserOptions from '@components/user-options'
import UserOrderOptions from '@components/user-order-options'
import Board from '@components/board'
import RequirementCard from '@components/requirement-card'
import CustomerServiceMask from '@components/customer-service-mask'

// 常量
import {
  USER_OPTIONS_LISTS,
  USER_ORDER_OPTIONS_LISTS,
} from '@constants/user'

import { COLOR_YELLOW, COLOR_GREY_0, COLOR_GREY_2 } from '@constants/styles'

import {
  PAGE_USER_AUTH
} from '@constants/page'

@connect(state => state, {
  ...distActions,
  ...userActions,
})

class UserProfile extends Component {
  config = {
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FFC919',
  }

  state = {
    optionLists: USER_OPTIONS_LISTS,
    orderOptionLists: USER_ORDER_OPTIONS_LISTS,
    showCard: false,
    showMask: false,
    floorList: [],
    roomList: [],
  }

  refRequirementCard = (node) => this.requirementCard = node

  componentWillMount() {
    this.initialHouseType()
  }

  async componentDidShow() {
    const { payload: user } = await this.props.dispatchUser()
    this.props.dispatchDistList(user.citycode)
    this.setState({ showMask: false })
  }

  onLogin() {
    Taro.reLaunch({ url: PAGE_USER_AUTH })
  }

  // 打开/关闭需求卡

  onOpenCard() {
    // this.setState({ showCard: true })
    this.requirementCard.onNextCard()
  }

  onCloseCard() {
    this.setState({ showCard: false })
  }

  // 打开/关闭联系客服弹窗

  onshowCustomerMask() {
    this.setState({ showMask: true })
  }

  onCloseCustomerMask() {
    this.setState({ showMask: false })
  }


  // 初始化户型列表

  initialHouseType() {
    const initialFloor = [{ id: 0, title: "不限" }]
    const initialRoom = [{ id: 0, title: "不限" }]
    const { dists } = this.props

    const room = dists.housetype_list.room
    const floor = dists.housetype_list.floor

    floor.map(i => {
      initialFloor.push(i)
    })
    room.map(i => {
      initialRoom.push(i)
    })

    this.setState({
      floorList: [...initialFloor],
      roomList: [...initialRoom],
    })
  }


  render() {
    const { optionLists, orderOptionLists, showCard, floorList, roomList, showMask } = this.state
    const { user: { username, mobile }, dists } = this.props

    const maskStyle = {
      position: 'absolute',
      height: '80vh',
      width : '100%',
      top: '20vh',
      zIndex : 99,
    }


    return (
      <View className='page-grey'>
        <View className='page mx-3' >
          {/* 背景底色 */}
          <Decorate height='300' />

          {/* 用户头像信息 */}
          <UserHeader
            className='mt-3'
            mobile={mobile}
            username={username}
            onLogin={this.onLogin}
          />

          {/* 用户可选信息 */}
          <UserOptions
            className='mt-3'
            onOpenCard={this.onOpenCard}
            lists={optionLists}
          />

          {/* 我的订单 */}
          <UserOrderOptions
            className='mt-2'
            lists={orderOptionLists}
          />


          {/* 联系客服 */}
          <Board className='mt-2'>
            {/* <Button style={buttonStyle} open-type='contact' size='mini' plain bindcontact='handleContact' > */}
            <View className=' p-3 mt-2' onClick={this.onshowCustomerMask} style={{ marginTop: Taro.pxTransform(8) }}>
              <View className='at-row at-row__justify--between'>
                {/* 左侧内容 */}
                <View className='at-row at-row__align--center ml-2'>
                  {/* 左侧图标 */}
                  <Image style={{ width: Taro.pxTransform(32), height: Taro.pxTransform(32), marginTop: Taro.pxTransform(4) }} src='https://images.gongyuabc.com/image/call.png'></Image>
                  {/* 文本内容 */}
                  <View className='ml-2 text-normal' style={{ color: '#000' }}>联系客服</View>
                </View>

                {/* 右侧图片 */}
                <View className='at-col at-col-3 '>
                  <View className='at-row at-row__align--center'>
                    <View className='text-small text-secondary mr-2'>9:30-21:30</View>
                    <View style={{ marginBottom: Taro.pxTransform(4) }}>
                      <AtIcon value='chevron-right' color={COLOR_GREY_2} size={17} />
                    </View>
                  </View>
                </View>

              </View>
            </View>
            {/* </Button> */}
          </Board>

        </View >

        <CustomerServiceMask
          show={showMask}
          onClose={this.onCloseCustomerMask}
        />

        <RequirementCard
          show={showCard}
          ref={this.refRequirementCard}
          onCloseCard={this.onCloseCard}
          dists={dists}

          initialFloor={floorList}
          initialRoom={roomList}
        />

        {
          !Taro.getStorageSync('user_info').token && <View style={maskStyle}></View>
        }


      </View>
    )
  }
}

export default UserProfile
