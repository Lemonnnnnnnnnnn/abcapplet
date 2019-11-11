// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Map, Image, Text, ScrollView } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'

// 自定义方法
import textWrap from '@utils/text-wrap'

// 自定义组件
import Tag from '@components/tag'
import TabBar from '@components/tab-bar'
import ABCIcon from '@components/abc-icon'
import ApartmentList from '@components/apartment-list'
import ApartmentTypeItem from '@components/apartment-type-item'
import CouponItem from '@components/coupon-item'

// 自定义变量
import { COLOR_GREY_2 } from '@constants/styles'
import { PATH } from '@constants/picture'
import { PAGE_ACTIVITY_APARTMENT, PAGE_HOUSE_TYPE_SHOW, PAGE_APPOINTMENT_CREATE, PAGE_HOME, PAGE_APARTMENT_SHOW, PAGE_ORDER_CREATE } from '@constants/page'
import { APARTMENT_NOTICE_DIST, ACTIVITY_TYPE_DIST, TYPE_FAVORITE_APARTMENT } from '@constants/apartment'
import { PAYLOAD_COUPON_LIST } from '@constants/api'
import { LOCALE_SHARE_TEXT } from '@constants/locale'

import buryPoint from '../../utils/bury-point'
import ApartmentCouponMask from './components/apartment-coupon-mask'
import ApartmentContainer from './components/apartment-container'

const city = userActions.dispatchUser().payload.citycode
@connect(state => state, {
  ...userActions,
  ...apartmentActions,
})
class ApartmentShow extends Component {
  config = {
    navigationBarTitleText: '公寓详情',
  }

  state = {
    showLittleMask: false,
    showCouponMask: false,
    showCouponTag: false,
    apartment: {
      Id: 0,
      cbds: [],
      rules: [],
      swipers: [],
      special: [],
      notices: [],
      hotRules: [],
      facilitys: [],
      num: 0
    },
    map: {
      latitude: 0,
      longitude: 0,
      markers: [],
    },
    buttons: [],
    nearbyPost: [],
    couponCutList: [],

    cityId: 350200,
  }

  async componentDidMount() {
    const { id } = this.$router.params
    buryPoint()
    this.props.dispatchCouponListPost({ ...PAYLOAD_COUPON_LIST, apartment_id: id }).then(({ data: { data } }) => {
      if (data.total) {
        const couponCutList = data.list.slice(0, 3)
        this.setState({ showCouponTag: true, couponCutList })
      }
    })


    const { citycode } = Taro.getStorageSync('user_info')
    citycode && this.setState({ cityId: citycode })

    this.setState({ Id: id })

    const { data: { data } } = await this.props.dispatchApartmentShow({ id })

    await this.props.dispatchAppointmentNearbyPost({ id }).then(res => this.setState({ nearbyPost: res.data.data }))


    let facilitys = data.facility_list
    let publicMatch = []
    facilitys && facilitys.map(i => {
      publicMatch.push(i)
    })

    const publicMatch_list = publicMatch.slice(0, 5)


    const buttons = !data.is_sign
      ? [{ message: '预约看房', method: 'onCreateBusiness' }]
      : [{ message: '签约下定', method: 'onCreateOrder' }, { message: '预约看房', method: 'onCreateBusiness' }]

    this.setState({
      publicMatch_list: publicMatch_list,
      buttons: buttons,
      apartment: {
        id: data.id,
        title: data.title,
        intro: data.one_word,
        cover: data.extend_info.pictures[0].url,
        tags: data.tags,
        desc: data.desc,
        apartmentTitle: data.apartment_title,

        // address: data.address,
        cbds: data.cbd_list,
        types: data.house_types.map(i => ({ ...i, url: `${PAGE_HOUSE_TYPE_SHOW}?id=${i.id}` })),
        isCollect: data.is_collect,
        rules: data.extend_info.rules,
        position: data.position,
        is_sign: data.is_sign,
        facilitys: data.facility_list,
        special: data.extend_info.special,
        notices: data.extend_info.notices,
        swipers: data.extend_info.pictures,
        appointment_show_num: data.appointment_show_num,
        hotRules: data.hot_rules.map(i => ({ ...i, url: `${PAGE_ACTIVITY_APARTMENT}?id=${i.id}` })),
        num: data.num
      },
      map: {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        markers: [{
          id: data.id,
          latitude: data.latitude,
          longitude: data.longitude,
          callout: {
            content: data.title,
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


  // 电话客服/在线客服

  onOpenLittleMask() {
    const { cityId } = this.state
    this.props.dispatchApartmentDataPost({ type: 1, city_id: cityId })
    const { showLittleMask } = this.state
    this.setState({ showLittleMask: !showLittleMask })
  }

  onCloseLittleMask() {
    this.setState({ showLittleMask: false })
  }

  onNavigation(url) {
    Taro.navigateTo({ url })
  }

  onOpenCoupon() {
    this.setState({ showCouponMask: true })
  }

  // 关闭租房优惠券
  onCloseCoupon() {
    this.setState({ showCouponMask: false })
    this.onShowMap()
  }

  onOpenMap() {
    const { cityId } = this.state
    this.props.dispatchApartmentDataPost({ type: 5, city_id: cityId })
    const { apartment, map } = this.state
    const { latitude, longitude } = map
    const { address } = apartment

    Taro.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18,
      address: address,
    })
  }

  onCreateFavorite() {
    const { apartment } = this.state
    const { id } = apartment

    this.props.dispatchFavoriteCreate({ id })
      .then(() => this.setState({ apartment: { ...apartment, isCollect: true } }))
  }

  onDeleteFavorite() {
    const { apartment } = this.state
    const { id } = apartment

    this.props.dispatchFavoriteDelete({ id })
      .then(() => this.setState({ apartment: { ...apartment, isCollect: false } }))
  }


  onShareAppMessage() {
    const { cityId } = this.state
    this.props.dispatchApartmentHouseDataPost({ type: 2, city_id: cityId })
    const text = LOCALE_SHARE_TEXT
    return {
      title: textWrap(text, 17)
    }
  }

  onClick(method) {
    const { Id, cityId } = this.state
    if (method === 'onCreateBusiness') {
      this.props.dispatchApartmentDataPost({ type: 3, city_id: cityId })

      const { apartment } = this.state
      const { id, types } = apartment

      Taro.navigateTo({
        url: `${PAGE_APPOINTMENT_CREATE}?id=${types[0].id}&apartmentId=${id}`
      })
    }
    if (method === 'onCreateOrder') {

      this.props.dispatchApartmentDataPost({ type: 4, city_id: cityId })

      Taro.navigateTo({
        url: `${PAGE_ORDER_CREATE}?apartment_id=${Id}`
      })
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
    const { apartment, map, publicMatch_list, buttons, showLittleMask, nearbyPost, showCouponMask, showCouponTag, couponCutList ,cityId } = this.state
    const { latitude, longitude, markers } = map
    const {
      title, swipers, isCollect, special, types, tags, desc,
      notices, cbds, intro, rules, position, cover, num, id } = apartment

    const imageStyle = {
      width: Taro.pxTransform(600),
      height: Taro.pxTransform(350),
    }

    return (
      <View className='page-white wrap-Style' >

        {types.length && <TabBar
          showLittleMask={showLittleMask}
          onOpenLittleMask={this.onOpenLittleMask}
          onCloseLittleMask={this.onCloseLittleMask}
          hasShare
          hasContact
          buttons={buttons}
          onClick={this.onClick}
          title={title}
          Id={apartment.id}
          type='apart'
        />}

        <View onClick={this.onCloseLittleMask} style={{ paddingBottom: Taro.pxTransform(120) }}>

          <ApartmentContainer
            swipers={swipers}
            isCollect={isCollect}
            num={num}
            onCreateFavorite={this.onCreateFavorite}
            onDeleteFavorite={this.onDeleteFavorite}
          >

            <ApartmentCouponMask
              show={showCouponMask}
              onClose={this.onCloseCoupon}
              apartment_id={id}
              cityId={cityId}
              params={this.$router.params}
              onTest={this.onTest}
            />

            {/* 加上边距 */}
            <View className='ml-3 mr-3'>

              {/* 头部 */}
              <View style={{ fontSize: Taro.pxTransform(40), minHeight: Taro.pxTransform(32) }}>{title}</View>
              <View className='text-secondary text-large mt-1' style={{ minHeight: Taro.pxTransform(24) }}>{intro}</View>

              {/* 活动信息 */}
              <View className='mt-2'>

                {/* 领优惠券 */}
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

                {rules.length ? rules.map(i =>
                  <View key={i.id} className=' mr-3'>
                    <Text className={`text-smail badge badge-${i.type}`} > {ACTIVITY_TYPE_DIST[i.type]['message']}</Text>
                    <Text className='text-secondary text-small ml-2'>{i.content}</Text>
                  </View>
                ) : <View className='text-secondary text-small'>暂无相关活动信息</View>
                }
              </View>


              <View className='apartment-show-brand' >
                <Tag className='my-3' active circle>
                  <View className='at-row  at-row__align--center text-secondary'>

                    <View className='at-row  at-row__align--center at-row__justify--center '>
                      <Image className='mr-1' src='https://images.gongyuabc.com//image/free_new.png' style='width:18px;height:18px'></Image>
                      <View className='ml-1 '>100%免中介费</View>
                    </View>

                    <View className='at-row  at-row__align--center at-row__justify--center '>
                      <Image className='mr-1' src='https://images.gongyuabc.com//image/home.png' style='width:18px;height:18px'></Image>
                      <View className='ml-1'>100%真实房源</View>
                    </View>

                  </View>
                </Tag>
              </View>


              {/* 地图 */}
              <View className='at-row  at-row__align--center  mb-2'>
                <View className=''>
                  <Image src={PATH} style='width:12px;height:16px'></Image>
                </View>
                {
                  position ? <View className='text-normal text-secondary  ml-2'>{position}</View> : <View className='text-secondary text-normal ml-2'>暂无相关位置信息</View>
                }

              </View>

            </View>


            {/* 户型列表 */}

            {
              types &&
              <View className='mt-4 ml-3 scroll-X' >

                <ScrollView scrollX>
                  {types.map(i =>

                    <View style={imageStyle} key={i.id} className='at-col at-col-5 mt-1 display-inline-block' >
                      <View className='apartment-type-item-wrap' >
                        <ApartmentTypeItem item={i} />
                      </View>
                    </View>)}
                </ScrollView>
              </View>
            }

            {/* 公寓信息 */}

            <View className='ml-3 mr-3 mt-1'>

              <View>
                <View className='text-bold text-huge mt-2 mb-3'>公寓信息</View>
                <View className='at-row at-row__align--center  at-row__justify--between my-2'>
                  <View>
                    <View className='at-row at-row__align--center'>
                      <View className='at-col'>
                        <AtAvatar circle image={cover} />
                      </View>
                      <View>
                        <View className='text-normal ml-2'>{title}</View>
                        <View className='text-normal text-secondary ml-2'>{tags}</View>
                      </View>
                    </View>

                  </View>
                </View>
                {
                  desc ? <View className='text-secondary text-normal text-indent apartment-show-text' >{desc}</View> : <View className='text-secondary'>暂无相关描述</View>
                }

                {/* 公共配置 */}

                <View className='at-row at-row--wrap mt-3 mb-3'>
                  {publicMatch_list && publicMatch_list.map(i =>
                    <View key={i.title} className='at-col at-col-1 text-center at-col--auto  mr-4'>
                      <Image src={i.icon} mode='aspectFit' style={{ height: '35px', width: '35px' }} />
                      <View className='text-small'>{i.title}</View>
                    </View>
                  )}

                  {publicMatch_list && publicMatch_list.length > 5 && <View className='text-center apartment-show-public-configuration'>
                    <View onClick={this.onOpenAllMatching} style={{ height: '35px', width: '35px' }}>...</View>
                    <View className='text-small'>更多</View>
                  </View>}
                </View>

              </View>


              {/* 公寓详情 */}



              {/* 特色服务 */}
              <View className='text-normal mt-2'>
                {special.length && <View className='text-secondary at-col-3 mr-2'>特色服务：</View>}
                <View className='at-row at-row--wrap'>
                  {special.map(i => <View key={i} className='mr-2'>{i}</View>)}
                </View>
              </View>

              {/* 位置信息 */}
              <View className='text-bold text-huge mt-4'>位置信息</View>
              <Map
                className='mt-2'
                showLocation
                markers={markers}
                latitude={latitude}
                longitude={longitude}
                style={{ width: '100%' }}
                onClick={this.onOpenMap}
              />

              {/* 周边生活 & 附近交通 */}
              <View className='at-row mt-2'>
                <View className='at-col text-secondary text-normal mr-2'>附近商圈</View>
                <View>
                  <View className='text-normal'>{cbds.join('、')}</View>
                </View>
              </View>

              {/* 用户须知 */}
              {/* 左分3栏，右分9栏 */}
              {/* 右边里面各自分为两栏并居中*/}
              {notices.length > 0 && <View className='text-bold text-huge mt-4'>用户须知</View>}
              {notices.map((i, index) =>
                <View key={i.id} className={`at-row at-row__align--center ${index + 1 !== notices.length && 'border-bottom'} py-2`}>
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

            {/* 附近公寓 */}
            {city && nearbyPost.length &&
              <View className='ml-3'>
                <View className='text-bold text-huge mt-4 mb-3'>附近公寓</View>
                <ApartmentList
                  nearbyPost={nearbyPost}
                  mini
                  type={TYPE_FAVORITE_APARTMENT}
                // items={apartments.list}
                // defaultPayload={{ city }}
                // dispatchList={this.props.dispatchRecommendHouseType}
                />
              </View>
            }
          </ApartmentContainer>
        </View>
      </View>

    )
  }
}

export default ApartmentShow
