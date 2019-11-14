// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { AtAvatar, AtIcon } from 'taro-ui'
import { View, Map, Image, Text, ScrollView, RichText } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'
import * as adActions from '@actions/ad'

// 自定义方法
import { timestampChange } from '@utils/time-judge'

// 自定义组件
import Tag from '@components/tag'
import TabBar from '@components/tab-bar'
import ABCIcon from '@components/abc-icon'
import ApartmentList from '@components/apartment-list'
import ApartmentTypeItem from '@components/apartment-type-item'
import CouponItem from '@components/coupon-item'

// import ApartmentContainer from '#components/apartment-container'

// 自定义变量
import { COLOR_GREY_2 } from '@constants/styles'
// 自定义方法
import textWrap from '@utils/text-wrap'

import { APARTMENT_NOTICE_DIST, ACTIVITY_TYPE_DIST, HOUSE_TYPE_DESC, TYPE_FAVORITE_APARTMENT } from '@constants/apartment'
import { LOCALE_PRICE_START, LOCALE_PRICE_SEMICOLON, LOCALE_SHARE_TEXT, LOCALE_SEMICOLON, LOCALE_PRICE_ACTIVITY, LOCALE_PRICE_ORIGIN } from '@constants/locale'
import { PAYLOAD_COUPON_LIST } from '@constants/api'
import { PAGE_HOME, PAGE_ACTIVITY_APARTMENT, PAGE_HOUSE_TYPE_SHOW, PAGE_APARTMENT_SHOW, PAGE_ORDER_CREATE, PAGE_APPOINTMENT_CREATE, PAGE_RISK_LANDING } from '@constants/page'
import { PATH, HOME, FREE, POING_THREE, RISK_MONEY_BANNER } from '@constants/picture'

import buryPoint from '../../utils/bury-point'
import ApartmentRentDescriptionMask from './components/apartment-rent-description-mask'
import AppartmentMatchingMask from './components/apartment-matching-mask'
import ApartmentCouponMask from './components/apartment-coupon-mask'
import ApartmentContainer from './components/apartment-container'
import ApartmentBargainCard from './components/apartment-bargain-card'

const city = userActions.dispatchUser().payload.citycode
@connect(state => state, {
  ...userActions,
  ...apartmentActions,
  ...adActions
})
class HouseTypeShow extends Component {
  config = {
    navigationBarTitleText: '户型详情',
  }

  state = {
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
    nearbyPost: [],
    couponCutList: [],
    showRentDescription: false,
    showMatch: false,
    showCouponTag: false,
    showMap: true,
    showCouponMask: false,
    cityId: 350200,
  }

  refApartmentCouponMask = node => this.apartmentCouponMask = node

  async componentWillMount() {
    buryPoint()
    const { id } = this.$router.params

    const { citycode } = Taro.getStorageSync('user_info')
    citycode && this.setState({ cityId: citycode })

    if (id) {
      const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })

      // 获取优惠券列表
      this.props.dispatchCouponListPost({ ...PAYLOAD_COUPON_LIST, apartment_id: data.apartment_id }).then(res => {
        if (res.data.data.total) {
          const couponCutList = res.data.data.list.slice(0, 3)
          this.setState({ showCouponTag: true, couponCutList })

        }
      })

      // 获取附近公寓列表
      await this.props.dispatchAppointmentNearbyPost({ id: data.apartment_id }).then(res => this.setState({ nearbyPost: res.data.data }))

      const buttons = !data.is_sign
        ? [{ message: '预约看房', method: 'onCreateBusiness' }]
        : [{ message: '签约下定', method: 'onCreateOrder' }, { message: '预约看房', method: 'onCreateBusiness' }]

      // 生成前五个房间配置/公共配置/房间
      let [facilitys, roomMatch, publicMatch, allHouseType, firstIndex] = [data.facility_list, [], [], [], 0]

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


      // 计算活动剩余时间
      let [days, hours, minutes, seconds, haveBargain] = [99, 23, 59, 59, true]
      if (data.bargain) {
        const { close_time } = data.bargain
        close_time > 0 ? { days, hours, minutes, seconds } = timestampChange(close_time) : {}
      } else haveBargain = false

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
          discount_price_title: data.discount_price_title,
          bargain: { ...data.bargain, days, hours, minutes, seconds },
          haveBargain
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

  // 打开租金介绍
  onOpenRentDescription() {
    this.setState({ showRentDescription: true })
    this.onHideMap()
  }

  // 打开所有配置弹窗
  onOpenAllMatching() {
    this.setState({ showMatch: true })
    this.onHideMap()
  }

  // 打开租房优惠券
  onOpenCoupon() {
    this.setState({ showCouponMask: true })
    this.onHideMap()
  }

  // 关闭
  onClose() {
    this.setState({
      showCouponMask: false,
      showMatch: false,
      showRentDescription: false,
      showLittleMask: false,
    })
    this.onShowMap()
  }


  // 打开弹窗时隐藏地图，关闭弹窗时打开地图
  onHideMap() {
    this.setState({ showMap: false })
  }

  onShowMap() {
    this.setState({ showMap: true })
  }


  // 路由跳转
  onNavigationApartment() {
    const { houstType } = this.state
    const { apartmentId } = houstType
    this.onNavigation(`${PAGE_APARTMENT_SHOW}?id=${apartmentId}`)
  }

  onNavigation(url) {
    Taro.navigateTo({ url })
  }
  //前往退租险页面
  onNavigateToRisk() {
    Taro.navigateTo({ url: PAGE_RISK_LANDING })
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

  // 点击爱心/取消爱心
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


  onShareAppMessage(target) {
    const text = LOCALE_SHARE_TEXT
    if (target.target && target.target.dataset.url) {
      let { url, id, share_title, share_img } = target.target.dataset
      url = url.replace(/\s*/g, "")

      this.props.dispatchCouponReceive({ id: id }).then(res => {
        res.data.code === 1 && (
          this.apartmentCouponMask.onListRefresh(),
          setTimeout(() => { Taro.showToast({ title: res.data.msg, icon: 'none' }) }, 2000)
        )
      })
      return {
        title: textWrap(share_title, 17),
        path: url,
        imageUrl: share_img
      }
    } else {
      const { cityId } = this.state
      this.props.dispatchApartmentHouseDataPost({ type: 2, city_id: cityId })
      return {
        title: textWrap(text, 17)
      }
    }
  }

  /**
   * 点击 预约看房,查看订单
   */
  onClick(method) {
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

  render() {
    const { apartments, ads: { riskAd } } = this.props

    const { houstType, map, buttons, showRentDescription, showCouponTag, houseType_id, showMatch, roomMatch_list,
      publicMatch_list, nearbyPost, showLittleMask, showMap, showCouponMask, couponCutList, cityId } = this.state

    const { latitude, longitude, markers } = map

    const {
      title, swipers, isCollect, cost, types, qsfPicture,
      descList, desc, roomList, isSign, cover,
      notices, cbds, intro, rules, facilitys, apartmentTitle,
      position, tags, cost_info, id, type_desc, has_room, num,
      discount_price_title, apartmentId, bargain, haveBargain
    } = houstType

    let { priceTitle } = houstType
    let showPrice = 0
    if (priceTitle) { showPrice = priceTitle }


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
                onClose={this.onClose}
                typeId={id}
              />

              <AppartmentMatchingMask
                facilitys={facilitys}
                show={showMatch}
                onClose={this.onClose}
              />

              <ApartmentCouponMask
                show={showCouponMask}
                ref={this.refApartmentCouponMask}
                onClose={this.onClose}
                houseType_id={id}
                apartment_id={apartmentId}
                cityId={cityId}
                params={this.$router.params}
              />

              {/* 头部 */}
              <View style={{ fontSize: Taro.pxTransform(40), minHeight: Taro.pxTransform(32), width: Taro.pxTransform(560) }}>{title}</View>

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
                <View className='page-middile text-normal text-secondary'>已有{riskAd.people_num || 51}人获得退租险</View>
              </View>

              <View style={{ borderBottom: "1Px solid rgba(248, 248, 248, 1)" }}></View>


              {/* 活动信息 */}
              <View className='mt-3 '>
                {/* 优惠券 */}
                {showCouponTag && <View onClick={this.onOpenCoupon} className='text-normal text-secondary my-1'>
                  <View className='at-row at-row__justify--between'>
                    <View className='at-row'>
                      <Text>领优惠券</Text>
                      {
                        couponCutList.map(i =>
                          <CouponItem
                            key={i.id}
                            block='mini'
                            coupon={i}
                            className='ml-2'
                          />)
                      }
                    </View>

                    <ABCIcon icon='chevron_right' size='22' color='#888888' />
                  </View>
                </View>}

                {/* 活动 */}
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
              <View className='apartment-house-type-branding'>
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
              {/* 砍价 */}
              {haveBargain && <ApartmentBargainCard bargain={bargain} />}


              {/* 户型简介 */}
              <View>
                <View className='at-row at-row__align--end mt-4'>
                  <View className='text-bold text-huge at-col at-col-3'>户型简介</View>
                  {
                    has_room ? <Text className=' text-mini badge-hasRoom mb-1 apartment-house-type-has-room-block' >有余房</Text>
                      : <Text className=' text-mini badge-hasNoRoom mb-1 apartment-house-type-has-room-block' >满房</Text>
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
                    <View className='apartment-house-type-public-configuration' ></View>
                    <View style={{ position: "absolute", top: Taro.pxTransform(10), left: Taro.pxTransform(13) }}>
                      <Image src={i.icon} mode='aspectFit' style={{ height: Taro.pxTransform(60), width: Taro.pxTransform(60) }} />
                      <View className='text-small text-center' >{i.title}</View>
                    </View>
                  </View>
                  :
                  <View onClick={this.onOpenAllMatching} key={i.title} className='at-col ' style={{ position: "relative" }}>
                    <View className='apartment-house-type-public-configuration' style={{ left: Taro.pxTransform(13), position: 'absolute' }}></View>
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
                      <View className='apartment-house-type-public-configuration' ></View>
                      <View style={{ position: "absolute", top: "5px", left: "5px" }}>
                        <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px', }} />
                        <View className='text-small text-center' >{i.title}</View>
                      </View>
                    </View>
                    :
                    <View onClick={this.onOpenAllMatching} key={i.title} className='at-col at-col-1 ' style={{ position: "relative" }}>
                      <View className='apartment-house-type-public-configuration' ></View>
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
                <View className='mt-4 scroll-X' >

                  <ScrollView scrollX>
                    {types.map((i, index) =>

                      <View key={i.id} className='at-col at-col-5 mt-1 apartment-house-type-image display-inline-block' >
                        <View className='apartment-type-item-wrap' >
                          <ApartmentTypeItem
                            item={i}
                            houseType
                            type='HouseType'
                            index={index}
                          />
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
