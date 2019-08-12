// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { AtAvatar, AtIcon } from 'taro-ui'
import { View, Map, Image, Text, ScrollView } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import Tag from '@components/tag'
import TabBar from '@components/tab-bar'
import ABCIcon from '@components/abc-icon'
import OrderHeader from '@components/order-header'
import RoomItem from '@components/room-item'
import ApartmentList from '@components/apartment-list'
import ApartmentTypeItem from '@components/apartment-type-item'
import ApartmentContainer from '@components/apartment-container'
import ApartmentRentDescriptionMask from '@components/apartment-rent-description-mask'
import AppartmentMatchingMask from '@components/apartment-matching-mask'

// 自定义变量
import { COLOR_GREY_2, COLOR_GREY_0 } from '@constants/styles'
import { ORDER_HEADERS } from '@constants/order'
import { APARTMENT_NOTICE_DIST, ACTIVITY_TYPE_DIST, HOUSE_TYPE_DESC, TYPE_FAVORITE_APARTMENT } from '@constants/apartment'
import { LOCALE_PRICE_START, LOCALE_PRICE_SEMICOLON, LOCALE_SEMICOLON } from '@constants/locale'
import { PAGE_HOME, PAGE_ACTIVITY_APARTMENT, PAGE_HOUSE_TYPE_SHOW, PAGE_APARTMENT_SHOW, PAGE_ORDER_CREATE, PAGE_APPOINTMENT_CREATE } from '@constants/page'




const city = userActions.dispatchUser().payload.citycode
@connect(state => state, {
  ...userActions,
  ...apartmentActions,
})
class HouseTypeShow extends Component {
  config = {
    navigationBarTitleText: '户型详情',
    navigationStyle: 'custom',
  }

  state = {
    statusBarHeight: 0,
    navHeight: 0,
    showLittleMask: false,
    houseType_id: 83,
    houstType: {
      cbds: [],
      rules: [],
      swipers: [],
      special: [],
      notices: [],
      hotRules: [],
      facilitys: [],
      roomList: [],
      appointment_show_num: 0,
    },
    map: {
      latitude: 0,
      longitude: 0,
      markers: [],
    },
    buttons: [],
    showRentDescription: false,
    showMatch: false,
    showApartRoom: true,
    nearbyPost: [],
  }

  async componentDidMount() {


    const { id } = this.$router.params

    if (id) {
      const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })

      await Taro.getSystemInfo().then(res => {
        this.setState({ navHeight: 72, statusBarHeight: res.statusBarHeight })
        if (res.model.indexOf('iPhone X') !== -1) {
          this.setState({ navHeight: 88, statusBarHeight: res.statusBarHeight })
        } else if (res.model.indexOf('iPhone') !== -1) {
          this.setState({ navHeight: 64, statusBarHeight: res.statusBarHeight })
        }
      })

      const apartmentID = data.apartment_id


      await this.props.dispatchAppointmentNearbyPost({ id: apartmentID }).then(res => this.setState({ nearbyPost: res.data.data }))


      const buttons = !data.is_sign
        ? [{ message: '预约看房', method: 'onCreateBusiness' }]
        : [{ message: '预约看房', method: 'onCreateBusiness' }, { message: '签约下定', method: 'onCreateOrder' }]

      // 生成前五个房间配置/公共配置/房间

      let facilitys = data.facility_list
      let roomMatch = []
      let publicMatch = []
      let allHouseType = []
      let firstIndex = 0

      facilitys && facilitys.map(i => {
        i.type === 2 && roomMatch.push(i)
        i.type === 1 && publicMatch.push(i)
      })

      let roomMatch_list = roomMatch.slice(0, 5)
      let publicMatch_list = publicMatch.slice(0, 5)
      const loadMore = {
        icon: 'https://images.gongyuabc.com//image/pointThree.png',
        title: '更多',
      }

      roomMatch_list.length >= 5 && roomMatch_list.push(loadMore)
      publicMatch_list.length >= 5 && publicMatch_list.push(loadMore)

      let roomList = (data.room_list).slice(0, 5)

      // 生成当前户型位于other_houseType数组第一位的新数组

      allHouseType = data.other_house_type.map(i => ({ ...i, url: `${PAGE_HOUSE_TYPE_SHOW}?id=${i.id}` }))
      allHouseType.forEach((i, key) => {
        if (i.id === data.id) {
          firstIndex = key
        }
      })
      const currentHouseType = allHouseType.splice(firstIndex, 1)
      const all_houseType = currentHouseType.concat(allHouseType)


      data && this.setState({
        roomMatch_list: roomMatch_list,
        publicMatch_list: publicMatch_list,
        houseType_id: id,
        buttons,
        houstType: {
          id: data.id,
          roomMatch: roomMatch,
          publicMatch: publicMatch,
          desc: data.desc,
          cost: data.cost,
          cost_info: data.cost_info,
          cover: data.cover,
          rules: data.rules,
          position: data.position,
          cbds: data.cbd_list,
          intro: data.one_word,
          isSign: data.is_sign,
          notices: data.notices,
          descList: data.desc_list,
          roomList: roomList,
          isCollect: data.is_collect,
          facilitys: data.facility_list,
          tags: data.tags,
          apartmentId: data.apartment_id,
          lookTime: data.look_guide.open_time,
          apartmentTitle: data.apartment_title,
          lookTips: data.look_guide.tips || '',
          swipers: data.pictures.map(i => ({ url: i })),
          title: `${data.title} · ${data.apartment_title}`,
          priceTitle: data.price_title,
          hotRules: data.hot_rules.map(i => ({ ...i, url: `${PAGE_ACTIVITY_APARTMENT}?id=${i.id}` })),
          types: all_houseType,
          appointment_show_num: data.appointment_show_num,
          one_word: data.one_word,
          type_desc: data.type_desc,
        },
        map: {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          markers: [{
            id: data.id,
            latitude: data.latitude,
            longitude: data.longitude,
            callout: {
              content: data.apartment_title,
              display: 'ALWAYS',
              bgColor: "#3a3a3a",
              color: "#fff",
              borderRadius: 50,
              padding: 10,
            },
          }],
        }
      })
    }

  }
  // 电话客服/在线客服

  onOpenLittleMask() {
    const { showLittleMask } = this.state
    this.setState({ showLittleMask: !showLittleMask })
  }

  onCloseLittleMask() {
    this.setState({ showLittleMask: false })
  }

  onNavigation(url) {
    Taro.navigateTo({ url })
  }

  // 打开租金介绍

  onOpenRentDescription() {
    this.setState({ showRentDescription: true })
  }

  // 关闭租金介绍

  onCloseRentDescription() {
    this.setState({ showRentDescription: false })
  }

  // 打开所有配置弹窗
  onOpenAllMatching() {
    this.setState({ showMatch: true })
  }

  // 关闭所有配置弹窗

  onCloseAllMatching() {
    this.setState({ showMatch: false })
  }

  onNavigationApartment() {
    const { houstType } = this.state
    const { apartmentId } = houstType
    this.onNavigation(`${PAGE_APARTMENT_SHOW}?id=${apartmentId}`)
  }

  onOpenMap() {
    const { houstType, map } = this.state
    const { latitude, longitude } = map
    const { address } = houstType

    Taro.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18,
      address: address,
    })
  }

  onCreateOrder() {
    const { houstType } = this.state
    const { id } = houstType
    Taro.navigateTo({ url: `${PAGE_ORDER_CREATE}?type_id=${id}` })
  }
  // onCreateBusiness

  onCreateFavorite() {
    const { houstType } = this.state
    const { id } = houstType

    this.props.dispatchFavoriteCreate({ type_id: id })
      .then(() => this.setState({ houstType: { ...houstType, isCollect: true } }))
  }

  onDeleteFavorite() {
    const { houstType } = this.state
    const { id } = houstType

    this.props.dispatchFavoriteDelete({ type_id: id })
      .then(() => this.setState({ houstType: { ...houstType, isCollect: false } }))
  }

  onRoomCreateFavorite({ payload }) {
    const { houstType } = this.state
    let roomList = []
    if (houstType) {
      roomList = houstType.roomList.map(i => i.id == payload.room_id ? { ...i, is_collect: true } : i)
    }
    this.props.dispatchFavoriteCreate(payload)
      .then(() => this.setState({ houstType: { ...houstType, roomList } }))
  }

  onRoomDeleteFavorite({ payload }) {
    const { houstType } = this.state
    let roomList = []
    if (houstType) {
      roomList = houstType.roomList.map(i => i.id == payload.room_id ? { ...i, is_collect: false } : i)
    }
    this.props.dispatchFavoriteDelete(payload)
      .then(() => this.setState({ houstType: { ...houstType, roomList } }))
  }

  onShareAppMessage() {
    return {
      title: "我在公寓ABC上发现了一个好\n房源",
    }
  }

  onSearchRoom() {
    const { id } = this.$router.params
    Taro.navigateTo({ url: `/pages/apartment/search-room?id=${id}` })
  }

  async onshowMorePic() {
    this.setState({ showApartRoom: false })
    const { id } = this.$router.params
    const { houstType } = this.state

    const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })

    const roomList = data.room_list

    this.setState({ houstType: { ...houstType, roomList: roomList } })

  }

  /**
   * 点击 预约看房,查看订单
   */
  onClick(method) {
    if (method === 'onCreateBusiness') {
      const { houstType } = this.state
      const { apartmentId, id } = houstType
      Taro.navigateTo({
        url: `${PAGE_APPOINTMENT_CREATE}?id=${id}&apartmentId=${apartmentId}`
      })
    }
    if (method === 'onCreateOrder') {
      this[method]()
    }
  }


  onReturn() {
    Taro.navigateBack()
  }

  onBackHome() {
    Taro.switchTab({
      url: PAGE_HOME
    })
  }



  render() {
    const { apartments } = this.props

    const { houstType, map, buttons, showRentDescription,
      houseType_id, showMatch, roomMatch_list, publicMatch_list,
      showApartRoom, nearbyPost, showLittleMask, navHeight, statusBarHeight } = this.state

    const { latitude, longitude, markers } = map

    const {
      title, swipers, isCollect, cost, types, priceTitle,
      descList, desc, roomList, isSign, cover,
      notices, cbds, intro, rules, facilitys, apartmentTitle,
      position, tags, cost_info, id, roomMatch, publicMatch,
      appointment_show_num, type_desc
    } = houstType

    const isNaNPrice = Number.isNaN(parseInt(priceTitle))

    const BrandingStyle = {
      backgroundColor: "rgb(248,248,248)",
      borderRadius: "12px",
    }

    const PublicConfiguration = {
      backgroundColor: "rgba(248, 248, 248, 1)",
      borderRadius: "12px",
      width: "40px",
      height: "40px"
      // padding: " 2px 6px"
    }

    const deposit = {
      borderRadius: "12px",
      backgroundColor: "rgba(255, 201, 25, 1)",
      color: "#fff",
      fontSize: "11px",
      textAlign: "center",
    }

    const ScrollWrapStyle = {

      whiteSpace: "nowrap",

    }

    const imageStyle = {
      width: '300px',
      height: Taro.pxTransform(350),
      display: "inline-block",

    }

    const textDeal = {
      wordBreak: "break-all",
      textIndent: "10px"
    }

    const borderStyle = {
      // backgroundColor: "rgba(248, 248, 248, 1)",
      borderRadius: "6px",
      boxShadow: "0 1px 5px rgb(200,200,200)",
      overflow: 'hidden',
    }

    const navStyle = {
      height: navHeight ? Taro.pxTransform(navHeight * 2) : Taro.pxTransform(128),
    }

    const statusBarStyle = {
      height: statusBarHeight ? Taro.pxTransform(statusBarHeight * 2) : Taro.pxTransform(40)
    }



    const titleStyle = {
      height: navHeight && statusBarHeight ? Taro.pxTransform((navHeight - statusBarHeight) * 2) : Taro.pxTransform(88),
    }


    return (
      <View >

        <TabBar

          showLittleMask={showLittleMask}
          onOpenLittleMask={this.onOpenLittleMask}
          onCloseLittleMask={this.onCloseLittleMask}
          show={!showRentDescription && !showMatch}
          hasShare
          hasContact
          buttons={buttons}
          onClick={this.onClick}
          title={title}
          Id={houseType_id}
          type='house'
        />

        {/* 自定义导航栏 */}
        <View className='navStyle' style={navStyle}>
          {/* 状态栏 */}
          <View style={statusBarStyle}></View>
          {/* 标题栏 */}
          <View style={{ position: "relative" }}>
            <View className='at-row at-row__align--center ml-2 navStyle-titleStyle' style={titleStyle} >
              <View className='at-row at-row-3 at-row__align--center at-row__justify--between navStyle-menuButtonStyle' >
                <View className='at-col-6 at-col__justify--center at-col__align--center ml-2'>
                  <AtIcon onClick={this.onReturn} value='chevron-left' size='22' ></AtIcon>
                </View>
                <View className='grayLineStyle' ></View>
                <Image onClick={this.onBackHome} src='https://images.gongyuabc.com//image/backHome.png' className='mr-2' style={{ height: "17px", width: "17px" }}></Image>
              </View>
            </View>
            {/* title */}
            <View className='text-large navStyle-titleFontStyle text-bold'>户型详情</View>
          </View>
        </View>


        <View onClick={this.onCloseLittleMask} style={{ paddingBottom: Taro.pxTransform(120), paddingTop: navHeight + "px" }}>

          <ApartmentContainer
            houseType_id={houseType_id}
            swipers={swipers}
            show={false}
            isCollect={isCollect}
            appointment_show_num={appointment_show_num}
            onCreateFavorite={this.onCreateFavorite}
            onDeleteFavorite={this.onDeleteFavorite}
          >

            <View className='ml-3 mr-3'>


              <ApartmentRentDescriptionMask
                cost={cost}
                cost_info={cost_info}
                isSign={isSign}

                show={showRentDescription}
                onClose={this.onCloseRentDescription}
                typeId={id}
              />

              <AppartmentMatchingMask
                facilitys={facilitys}
                show={showMatch}
                onClose={this.onCloseAllMatching}
              />



              {/* 头部 */}
              <View style={{ fontSize: '20px' }}>{title}</View>
              <View className='text-secondary text-large mt-1'>{intro}</View>

              {/* 价格相关 */}
              <View className='at-row at-row__justify--between at-row__align--center  mt-2'>
                <View className='text-yellow at-col'>
                  <Text className='text-super ' style={{ fontSize: '18px' }}>
                    {isNaNPrice ? priceTitle : `${LOCALE_PRICE_SEMICOLON}${priceTitle}`}
                  </Text>
                  <Text className='text-normal'>{LOCALE_PRICE_START}</Text>
                </View>

                <View className='at-col '>
                  <View className='at-row at-row__align--center at-row__justify--end '>
                    <View onClick={this.onOpenRentDescription} className='text-small text-secondary'>{cost}</View>
                    <ABCIcon icon='chevron_right' color={COLOR_GREY_2} size='17' />
                  </View>
                </View>
              </View>

              {/* 押金保障 */}

              {
                isSign && <View className='at-row at-row__align--center  '>
                  <View className='at-col at-col-2 text-normal at-row at-row__align--center' style={deposit}>押金保障</View>
                  <View className='at-col at-col-6 text-normal ml-3 text-secondary '>该房源支持退租押金最高50%无忧赔付</View>
                </View>
              }


              <View className='mt-2' style={{ borderBottom: "1Px solid rgba(248, 248, 248, 1)" }}></View>


              {/* 活动信息 */}

              <View className='mt-3'>
                {rules && rules.map(i =>
                  <View key={i.id} className=' mt-2 mr-3 mb-3'>
                    <Text className={`text-smail badge badge-${i.type}`}> #{ACTIVITY_TYPE_DIST[i.type]['message']}#</Text>
                    <Text className='text-secondary text-small ml-2'>{i.content}</Text>
                  </View>
                )}
              </View>

              {/* 品牌宣传 */}
              <View style={BrandingStyle}>
                <Tag className='my-3' active circle>
                  <View className='at-row  at-row__align--center text-secondary'>

                    <Image className='ml-4' src='https://images.gongyuabc.com//image/free.png' style='width:18px;height:18px'></Image>
                    <View className='ml-2'>100%免中介费</View>
                    <Image className='ml-4' src='https://images.gongyuabc.com//image/home.png' style='width:18px;height:18px'></Image>
                    <View className='ml-2'>严选厦门3万+房源</View>

                  </View>
                </Tag>
              </View>

              {/* 地图 */}
              {
                position && <View className='at-row '>
                  <View className='at-col at-col-1 '>
                    <Image src='https://images.gongyuabc.com//image/path.png' style='width:12px;height:16px'></Image>
                  </View>
                  <View className=' text-large text-secondary  ml-1' >{position}</View>
                </View>
              }


              {/* 文章相关 */}


              {/* 户型简介 */}
              {descList &&
                <View>
                  <View className='text-bold text-huge mt-4'>户型简介</View>
                  <View className='at-row at-row--wrap'>
                    {descList.map((i, index) =>
                      <View key={index} className='at-col-6'>
                        <Text className='text-normal text-secondary'>{HOUSE_TYPE_DESC[index]}{LOCALE_SEMICOLON}</Text>
                        <Text className='text-normal'>{i}</Text>
                      </View>
                    )}
                  </View>
                </View>
              }
              {/* 一句话描述 */}
              <View className='text-secondary text-small mt-2' style={{ textIndent: "10px" }}>{type_desc}</View>


              {/* 公共配置 */}
              <View className='at-row at-row__justify--around mt-4 '>

                {roomMatch_list && roomMatch_list.map((i, key) => key !== 5 ?
                  <View key={i.title} className='at-col' style={{ position: "relative" }}>
                    <View style={PublicConfiguration}></View>
                    <View style={{ position: "absolute", top: "5px", left: "5px" }}>
                      <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} />
                      <View className='text-small text-center' >{i.title}</View>
                    </View>
                  </View>
                  :
                  <View onClick={this.onOpenAllMatching} key={i.title} className='at-col ' style={{ position: "relative" }}>
                    <View style={PublicConfiguration}></View>
                    <View style={{ position: "absolute", top: "5px", left: "5px" }}>
                      <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} />
                      <View className='text-small text-center'>{i.title}</View>
                    </View>
                  </View>
                )}

              </View>

              {/* 位置信息 */}
              <View className='text-bold text-huge mt-5'>位置信息</View>
              <Map
                className='mt-2'
                showLocation
                markers={markers}
                latitude={latitude}
                longitude={longitude}
                style={{ width: '100%' }}
                onClick={this.onOpenMap}
              >

              </Map>

              {/* 周边生活 & 附近交通 */}
              <View className='at-row mt-2'>
                <View className='at-col text-secondary text-normal mr-2'>附近商圈</View>
                <View>
                  <View className='text-normal'>{cbds.join('、')}</View>
                </View>
              </View>

              {/* 可租房间 */}
              {roomList.length !== 0 && <View >
                <View className='text-bold text-huge mt-4 mb-2'>可租房间</View>
                {
                  isSign && <OrderHeader items={ORDER_HEADERS} ></OrderHeader>
                }
                {roomList && roomList.map((i, index) =>
                  <RoomItem
                    key={i.id}
                    room={i}
                    roomList={roomList}
                    isSign={isSign}
                    onCreateFavorite={this.onRoomCreateFavorite}
                    onDeleteFavorite={this.onRoomDeleteFavorite}
                    className={`${index + 1 !== roomList.length && 'border-bottom'} pt-1`}
                  />)}
                {
                  showApartRoom && roomList.length > 5 && <View
                    onClick={this.onshowMorePic}
                    className='text-secondary text-normal mt-2'
                    style={{ textAlign: "center" }} >显示更多<AtIcon value='chevron-down' size='20' color='#888888'></AtIcon></View>
                }
                <View onClick={this.onSearchRoom} className='text-secondary at-row at-row__align--center at-row__justify--end'>
                  <AtIcon className='ml-2' value='search' size='13' color={COLOR_GREY_0} />
                  <Text className='ml-2 text-normal text-muted'>搜索房间</Text>
                </View>

              </View>}


              {/* 用户须知 */}
              {/* 左分3栏，右分9栏 */}
              {/* 右边里面各自分为两栏并居中*/}
              {notices.length > 0 && <View className='text-bold text-huge mt-4 '>用户须知</View>}
              {notices.map((i, index) =>
                <View key={i.id} className={`at-row at-row__align--center ${index + 1 !== notices.length && 'border-bottom'} py-2 `}>
                  <View className='text-secondary at-col-3'>
                    <View className='at-row at-row__justify--center '>
                      <ABCIcon icon={APARTMENT_NOTICE_DIST[i.id].icon} color={COLOR_GREY_2} size='30' />
                    </View>
                    <View className='at-row at-row__justify--center '>
                      <View className='text-small'>{APARTMENT_NOTICE_DIST[i.id].message}</View>
                    </View>
                  </View>
                  <View className='at-col-9 at-row at-row--wrap'>
                    {i.word.map(w => <View key={w} className='text-normal at-col-6 text-center'>{w}</View>)}
                  </View>
                </View>
              )}

              {/* 看房指南 */}
              {/* <View>
        <View className='text-bold text-huge mt-4'>看房指南</View>
        <View className='text-secondary text-normal mt-2'>{lookTime}</View>
        {lookTips !== '' && <View className='text-secondary text-normal mt-2'>{lookTips}</View>}
      </View> */}

            </View>
            <View className='ml-3'>

              {/* 公寓信息 */}
              <View onClick={this.onNavigationApartment}>
                <View className='text-bold text-huge mt-4 mb-3'>公寓信息</View>
                <View className='at-row at-row__align--center  at-row__justify--between my-2'>
                  <View>
                    <View className='at-row at-row__align--center'>
                      <View className='at-col'>
                        <AtAvatar circle image={cover} />
                      </View>
                      <View>
                        <View className='text-normal ml-2'>{apartmentTitle}</View>
                        <View className='text-normal text-secondary ml-2'>{tags}</View>
                      </View>
                    </View>

                  </View>
                </View>
                <View className='text-secondary text-normal' style={textDeal}>




                </View>
                <View className='at-row at-row--wrap mt-3 mb-3'>

                  {publicMatch_list && publicMatch_list.map((i, key) => key !== 5 ?
                    <View key={i.title} className='at-col at-col-1 ' style={{ position: "relative" }}>
                      <View style={PublicConfiguration}></View>
                      <View style={{ position: "absolute", top: "5px", left: "5px" }}>
                        <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px', }} />
                        <View className='text-small text-center' >{i.title}</View>
                      </View>
                    </View>
                    :
                    <View onClick={this.onOpenAllMatching} key={i.title} className='at-col at-col-1 ' style={{ position: "relative" }}>
                      <View style={PublicConfiguration}></View>
                      <View style={{ position: "absolute", top: "5px", left: "5px" }}>
                        <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} />
                        <View className='text-small text-center'>{i.title}</View>
                      </View>
                    </View>
                  )}
                </View>

              </View>

              {
                types &&

                <View style={ScrollWrapStyle}  >

                  <ScrollView scrollX>
                    {types.map((i, index) =>

                      <View style={imageStyle} key={i.id} className={`${index + 1 != types.length} at-col at-col-5 mt-1 `}>
                        <View style={borderStyle} className='ml-1 mr-1' >
                          <ApartmentTypeItem item={i} houseType index={index} />
                        </View>
                      </View>)}
                  </ScrollView>
                </View>
              }

              {/* 附近公寓 */}
              {city && nearbyPost.length &&
                <View className='mt-4'>
                  <View className='text-bold text-huge mb-3'>附近公寓</View>
                  <ApartmentList
                    nearbyPost={nearbyPost}
                    mini
                    key={apartments.type}
                    type={TYPE_FAVORITE_APARTMENT}
                    items={apartments.list}
                    defaultPayload={{ city }}
                    dispatchList={this.props.dispatchRecommendHouseType}
                  />
                </View>
              }
            </View>

          </ApartmentContainer>
        </View>
      </View>
    )
  }
}

export default HouseTypeShow
