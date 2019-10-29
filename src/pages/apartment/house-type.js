// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { AtAvatar, AtIcon } from 'taro-ui'
import { View, Map, Image, Text, ScrollView, RichText } from '@tarojs/components'

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
import HouseTypeAvatar from '@components/house-type-avatar'
import CustomNav from '@components/custom-nav'


// 自定义变量
import { COLOR_GREY_2 } from '@constants/styles'
import { ORDER_HEADERS } from '@constants/order'
// 自定义方法
import textWrap from '@utils/text-wrap'

import { APARTMENT_NOTICE_DIST, ACTIVITY_TYPE_DIST, HOUSE_TYPE_DESC, TYPE_FAVORITE_APARTMENT, APARTMENT_AVATAR_DIST } from '@constants/apartment'
import { LOCALE_PRICE_START, LOCALE_PRICE_SEMICOLON, LOCALE_SHARE_TEXT, LOCALE_SEMICOLON, LOCALE_PRICE_ACTIVITY, LOCALE_PRICE_ORIGIN } from '@constants/locale'
import { PAYLOAD_COUPON_LIST } from '@constants/api'
import { PAGE_HOME, PAGE_ACTIVITY_APARTMENT, PAGE_HOUSE_TYPE_SHOW, PAGE_APARTMENT_SHOW, PAGE_ORDER_CREATE, PAGE_APPOINTMENT_CREATE, PAGE_RISK_LANDING } from '@constants/page'
import { PATH, HOME, FREE, POING_THREE, RISK_MONEY_BANNER } from '@constants/picture'

import buryPoint from '../../utils/bury-point'
import ApartmentRentDescriptionMask from './components/apartment-rent-description-mask'
import AppartmentMatchingMask from './components/apartment-matching-mask'
import ApartmentCouponMask from './components/apartment-coupon-mask'
import ApartmentContainer from './components/apartment-container'

const city = userActions.dispatchUser().payload.citycode
@connect(state => state, {
  ...userActions,
  ...apartmentActions,
})
class HouseTypeShow extends Component {
  config = {
    navigationBarTitleText: '户型详情',
    // navigationStyle: 'custom',
  }

  state = {
    Id: 0,
    navHeight: 0,
    showLittleMask: false,
    houseType_id: 83,
    houstType: {
      cbds: [],
      rules: [],
      swipers: [],
      qsfPicture: [],
      special: [],
      notices: [],
      hotRules: [],
      facilitys: [],
      roomList: [],
      appointment_show_num: 0,
      num: 0,
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
    showCouponTag: false,
    nearbyPost: [],
    showMap: true,
    showCouponMask: false,
    cityId: 350200,
  }

  async componentWillMount() {
    buryPoint()
    const { id } = this.$router.params

    const { citycode } = Taro.getStorageSync('user_info')
    citycode && this.setState({ cityId: citycode })
    this.setState({ Id: id })
    if (id) {
      const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })
      const apartmentID = data.apartment_id

      // 获取优惠券列表
      this.props.dispatchCouponListPost({ ...PAYLOAD_COUPON_LIST, apartment_id: apartmentID }).then(res => {
        res.data.data.total && this.setState({ showCouponTag: true })
      })

      // 获取附近公寓列表
      await this.props.dispatchAppointmentNearbyPost({ id: apartmentID }).then(res => this.setState({ nearbyPost: res.data.data }))

      const buttons = !data.is_sign
        ? [{ message: '预约看房', method: 'onCreateBusiness' }]
        : [{ message: '签约下定', method: 'onCreateOrder' }, { message: '预约看房', method: 'onCreateBusiness' }]

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
        icon: POING_THREE,
        title: '更多',
      }

      roomMatch_list.length >= 5 && roomMatch_list.push(loadMore)
      publicMatch_list.length >= 5 && publicMatch_list.push(loadMore)

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

          isCollect: data.is_collect,
          facilitys: data.facility_list,
          tags: data.tags,
          apartmentId: data.apartment_id,
          lookTime: data.look_guide.open_time,
          apartmentTitle: data.apartment_title,
          lookTips: data.look_guide.tips || '',
          swipers: data.pictures.map(i => ({ url: i })),
          qsfPicture: data.qsf_picture.map(i => ({ url: i })),
          title: `${data.title} · ${data.apartment_title}`,
          partTitle: data.title,
          priceTitle: data.price_title,
          hotRules: data.hot_rules.map(i => ({ ...i, url: `${PAGE_ACTIVITY_APARTMENT}?id=${i.id}` })),
          types: all_houseType,
          appointment_show_num: data.appointment_show_num,
          one_word: data.one_word,
          type_desc: data.type_desc,
          has_room: data.has_room,
          num: data.num,
          discount_price_title: data.discount_price_title
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
    const { cityId } = this.state
    this.props.dispatchApartmentHouseDataPost({ type: 1, city_id: cityId })
    const { showLittleMask } = this.state
    this.setState({ showLittleMask: !showLittleMask })
  }

  onCloseLittleMask() {
    this.setState({ showLittleMask: false })
  }

  onNavigation(url) {
    Taro.navigateTo({ url })
  }
  //前往退租险页面
  onNavigateToRisk() {
    Taro.navigateTo({ url: PAGE_RISK_LANDING })
  }

  // 打开租金介绍

  onOpenRentDescription() {
    this.setState({ showRentDescription: true })
    this.onHideMap()
  }

  // 关闭租金介绍

  onCloseRentDescription() {
    this.setState({ showRentDescription: false })
    this.onShowMap()
  }

  // 打开所有配置弹窗
  onOpenAllMatching() {
    this.setState({ showMatch: true })
    this.onHideMap()
  }

  // 关闭所有配置弹窗

  onCloseAllMatching() {
    this.setState({ showMatch: false })
    this.onShowMap()
  }

  // 打开租房优惠券
  onOpenCoupon() {
    this.setState({ showCouponMask: true })
    this.onHideMap()
  }
  // 关闭租房优惠券
  onCloseCoupon() {
    this.setState({ showCouponMask: false })
    this.onShowMap()
  }

  onNavigationApartment() {
    const { houstType } = this.state
    const { apartmentId } = houstType
    this.onNavigation(`${PAGE_APARTMENT_SHOW}?id=${apartmentId}`)
  }

  // 打开弹窗时隐藏地图，关闭弹窗时打开地图

  onHideMap() {
    this.setState({ showMap: false })
  }

  onShowMap() {
    this.setState({ showMap: true })
  }

  onOpenMap() {
    const { cityId } = this.state
    this.props.dispatchApartmentHouseDataPost({ type: 5, city_id: cityId })
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

  // insertStr(soure, start, newStr) {
  //   return soure.slice(0, start) + newStr + soure.slice(start)
  // }

  // onShareAppMessage() {
  //   const { cityId } = this.state
  //   this.props.dispatchApartmentHouseDataPost({ type: 2, city_id: cityId })
  //   const { houstType } = this.state
  //   let { swipers, title } = houstType
  //   if (title.length > 17) {
  //     title = this.insertStr(title, 17, '\n')
  //   }
  //   return {
  //     title: title,
  //     imageUrl: swipers[0].url
  //   }
  // }

  onShareAppMessage() {
    const { cityId } = this.state
    this.props.dispatchApartmentHouseDataPost({ type: 2, city_id: cityId })
    const text = LOCALE_SHARE_TEXT
    return {
      title: textWrap(text, 17)
    }
  }

  onSearchRoom() {
    const { id } = this.$router.params
    Taro.navigateTo({ url: `/pages/apartment/search-room?id=${id}` })
  }


  /**
   * 点击 预约看房,查看订单
   */
  onClick(method) {
    const { Id } = this.state
    const { cityId } = this.state
    if (method === 'onCreateBusiness') {

      this.props.dispatchApartmentHouseDataPost({ type: 3, city_id: cityId })
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

    const { houstType, map, buttons, showRentDescription, showCouponTag,
      houseType_id, showMatch, roomMatch_list, publicMatch_list,
      showApartRoom, nearbyPost, showLittleMask, navHeight, showMap, showCouponMask, } = this.state

    const { latitude, longitude, markers } = map

    const {
      title, swipers, isCollect, cost, types, qsfPicture,
      descList, desc, roomList, isSign, cover,
      notices, cbds, intro, rules, facilitys, apartmentTitle,
      position, tags, cost_info, id, type_desc, has_room, num,
      discount_price_title, apartmentId
    } = houstType

    let { priceTitle } = houstType
    let showPrice = 0
    if (priceTitle) { showPrice = priceTitle }

    // const isNaNPrice = Number.isNaN(parseInt(priceTitle))

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

        {/* <CustomNav title='户型详情' /> */}

        <View
          onClick={this.onCloseLittleMask}
          style={{ paddingBottom: Taro.pxTransform(120) }}
        >

          <ApartmentContainer
            type
            qsf_picture={qsfPicture}
            houseType_id={houseType_id}
            swipers={swipers}
            show={false}
            isCollect={isCollect}
            num={num}
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

              <ApartmentCouponMask
                show={showCouponMask}
                onClose={this.onCloseCoupon}
                apartment_id={apartmentId}
                params={this.$router.params}
                onTest={this.onTest}
              />

              {/* 头部 */}
              <View style={{ fontSize: Taro.pxTransform(40), minHeight: Taro.pxTransform(32) }}>{title}</View>

              <View className='text-secondary text-large mt-1' style={{ minHeight: Taro.pxTransform(24) }}>{intro}</View>


              {/* 价格相关 */}
              {
                discount_price_title ?
                  <View>
                    <View className='text-yellow at-col' >
                      {/* 折扣价独立出来显示 */}
                      <Text style={{ fontSize: Taro.pxTransform(36) }}>
                        {LOCALE_PRICE_SEMICOLON + discount_price_title}
                      </Text>
                      <Text className='text-normal'>{LOCALE_PRICE_START + LOCALE_PRICE_ACTIVITY}</Text>
                    </View>
                    {/* 原价和{押一付一，半年期，免中介费}换行显示 */}
                    <View className='at-row at-row__justify--between at-row__align--center mt-2' >

                      <View className='at-col text-normal text-secondary' >
                        {LOCALE_PRICE_SEMICOLON + showPrice + LOCALE_PRICE_START + LOCALE_PRICE_ORIGIN}
                      </View>

                      <View className='at-col '>
                        <View className='at-row at-row__align--center at-row__justify--end '>
                          <View onClick={this.onOpenRentDescription} className='text-small text-secondary'>{cost}</View>
                          <ABCIcon icon='chevron_right' color={COLOR_GREY_2} size='17' />
                        </View>
                      </View>

                    </View>
                  </View>
                  :
                  <View className='at-row at-row__justify--between at-row__align--center mt-2' >
                    <View className='text-yellow at-col' >
                      <Text style={{ fontSize: Taro.pxTransform(36) }}>
                        {LOCALE_PRICE_SEMICOLON + showPrice}
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
              }


              {/* 广告位 */}
              <View className='page-middile mt-2'>
                <Image onClick={this.onNavigateToRisk} src={RISK_MONEY_BANNER} mode='widthFix' className='appointment-detail-ad'></Image>
              </View>

              {/* 已有多少人获得转租金 */}
              <View style={{ height: Taro.pxTransform(60) }} className='my-1'>
                <View className='page-middile text-normal text-secondary'>已有{apartments.people_num || 51}人获得退租险</View>
              </View>

              <View style={{ borderBottom: "1Px solid rgba(248, 248, 248, 1)" }}></View>


              {/* 活动信息 */}
              <View className='mt-3 '>
                {/* 领优惠券小Tag */}
                {showCouponTag && <View onClick={this.onOpenCoupon} className='apartment-coupon text-normal mt-1' style={{ float: 'right' }}>
                  <View className='at-row at-row-1 at-col--auto at-row__justify--end'>
                    <Text>领优惠券</Text>
                    <ABCIcon icon='chevron_right' size='22' />
                  </View>
                </View>}

                <View>
                  {rules && rules.map(i =>
                    <View key={i.id} className=' mr-1'>
                      <Text className={`text-mini badge badge-${i.type}`}> {ACTIVITY_TYPE_DIST[i.type]['message']}</Text>
                      <Text className='text-secondary text-small ml-2'>{i.content}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* 品牌宣传 */}
              <View className='house-type-branding'>
                <Tag className='my-3' active circle>
                  <View className='at-row  at-row__align--center at-row__justify--center text-secondary'>

                    <View className='at-row  at-row__align--center at-row__justify--center '>
                      <Image className='mr-1' src={FREE} style='width:18px;height:18px'></Image>
                      <View className='ml-1 '>100%免中介费</View>
                    </View>

                    <View className='at-row  at-row__align--center at-row__justify--center '>
                      <Image className='mr-1' src={HOME} style='width:18px;height:18px'></Image>
                      <View className='ml-1'>100%真实房源</View>
                    </View>

                  </View>
                </Tag>
              </View>

              {/* 地图 */}
              {
                position && <View className='at-row  at-row__align--center'>
                  <View className='at-col at-col-1 '>
                    <Image src={PATH} style='width:12px;height:16px'></Image>
                  </View>
                  <View className=' text-normal text-secondary ' >{position}</View>
                </View>
              }


              {/* 文章相关 */}


              {/* 户型简介 */}
              <View>
                <View className='at-row at-row__align--end mt-4'>
                  <View className='text-bold text-huge at-col at-col-3'>户型简介</View>
                  {
                    has_room ? <Text className=' text-mini badge-hasRoom mb-1 house-type-has-room-block' >有余房</Text>
                      : <Text className=' text-mini badge-hasNoRoom mb-1 house-type-has-room-block' >满房</Text>
                  }
                </View>

                {descList &&
                  <View className='at-row at-row--wrap'>
                    {descList.map((i, index) =>
                      <View key={index} className='at-col-6'>
                        <Text className='text-normal text-secondary'>{HOUSE_TYPE_DESC[index]}{LOCALE_SEMICOLON}</Text>
                        <Text className='text-normal'>{i}</Text>
                      </View>
                    )}
                  </View>
                }

              </View>
              {/* 一句话描述 */}
              <View className='text-secondary text-small mt-2' style={{ textIndent: Taro.pxTransform(20), minHeight: Taro.pxTransform(36) }}>{type_desc}</View>

              {/* 公共配置 */}
              <View className='at-row at-row__justify--center mt-4 ' style={{ minHeight: Taro.pxTransform(120) }}>

                {roomMatch_list && roomMatch_list.map((i, key) => key !== 5 ?
                  <View key={i.title} className='at-col' style={{ position: "relative", left: Taro.pxTransform(13) }}>
                    <View className='house-type-public-configuration' ></View>
                    <View style={{ position: "absolute", top: Taro.pxTransform(10), left: Taro.pxTransform(13) }}>
                      <Image src={i.icon} mode='aspectFit' style={{ height: Taro.pxTransform(60), width: Taro.pxTransform(60) }} />
                      <View className='text-small text-center' >{i.title}</View>
                    </View>
                  </View>
                  :
                  <View onClick={this.onOpenAllMatching} key={i.title} className='at-col ' style={{ position: "relative" }}>
                    <View className='house-type-public-configuration' style={{ left: Taro.pxTransform(13), position: 'absolute' }}></View>
                    <View style={{ position: "absolute", top: Taro.pxTransform(10), left: Taro.pxTransform(23) }}>
                      <Image src={i.icon} mode='aspectFit' style={{ height: Taro.pxTransform(60), width: Taro.pxTransform(60) }} />
                      <View className='text-small text-center'>{i.title}</View>
                    </View>
                  </View>
                )}

              </View>

              {/* 位置信息 */}
              <View className='text-bold text-huge mt-2'>位置信息</View>
              {
                showMap && <Map
                  className='mt-2'
                  showLocation
                  markers={markers}
                  latitude={latitude}
                  longitude={longitude}
                  style={{ width: '100%' }}
                  onClick={this.onOpenMap}
                >
                </Map>

              }

              {/* 周边生活 & 附近交通 */}
              <View className='at-row mt-2'>
                <View className='at-col at-col-2 text-secondary text-normal mr-3'>附近商圈：</View>
                <View>
                  <View className='text-normal'>{cbds.join('、')}</View>
                </View>
              </View>




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

            </View>
            <View className='ml-3'>

              {/* 公寓信息 */}
              <View >
                <View className='text-bold text-huge mt-4 mb-3'>公寓信息</View>
                <View className='at-row at-row__align--center  at-row__justify--between my-2'>
                  <View>
                    <View className='at-row at-row__align--center'>
                      <View className='at-col' onClick={this.onNavigationApartment}>
                        <AtAvatar circle image={cover} />
                      </View>
                      <View>
                        <View className='text-normal ml-2'>{apartmentTitle}</View>
                        <View className='text-normal text-secondary ml-2 mr-2'>{tags}</View>
                      </View>
                    </View>

                  </View>
                </View>
                <View className='mr-3'>
                  <RichText nodes={desc} ></RichText>
                </View>

                <View className='at-row at-row--wrap mt-3 mb-3'>

                  {publicMatch_list && publicMatch_list.map((i, key) => key !== 5 ?
                    <View key={i.title} className='at-col at-col-1 ' style={{ position: "relative" }}>
                      <View className='house-type-public-configuration' ></View>
                      <View style={{ position: "absolute", top: "5px", left: "5px" }}>
                        <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px', }} />
                        <View className='text-small text-center' >{i.title}</View>
                      </View>
                    </View>
                    :
                    <View onClick={this.onOpenAllMatching} key={i.title} className='at-col at-col-1 ' style={{ position: "relative" }}>
                      <View className='house-type-public-configuration' ></View>
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

                <View style={{ whiteSpace: "nowrap" }} className='mt-4' >

                  <ScrollView scrollX>
                    {types.map((i, index) =>

                      <View key={i.id} className='at-col at-col-5 mt-1 house-type-image' >
                        <View className='house-type-apartment-type-border' >
                          <ApartmentTypeItem
                            item={i}
                            houseType
                            type='HouseType'
                            index={index} />
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
                  // defaultPayload={{ city }}
                  // dispatchList={this.props.dispatchRecommendHouseType}
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
