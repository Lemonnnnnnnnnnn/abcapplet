// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { AtAvatar , AtIcon } from 'taro-ui'
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
import { COLOR_GREY_2 , COLOR_GREY_0 } from '@constants/styles'
import { ORDER_HEADERS } from '@constants/order'
import { APARTMENT_NOTICE_DIST, ACTIVITY_TYPE_DIST, HOUSE_TYPE_DESC } from '@constants/apartment'
import { LOCALE_PRICE_START, LOCALE_PRICE_SEMICOLON, LOCALE_SEMICOLON, LOCALE_LOCK_NOTICE } from '@constants/locale'
import { PAGE_HOME, PAGE_ACTIVITY_APARTMENT, PAGE_HOUSE_TYPE_SHOW, PAGE_APARTMENT_SHOW, PAGE_ORDER_CREATE, PAGE_APPOINTMENT_CREATE } from '@constants/page'

const city = userActions.dispatchUser().payload.citycode
@connect(state => state, {
  ...userActions,
  ...apartmentActions,
})
class HouseTypeShow extends Component {
  config = {
    navigationBarTitleText: '',
  }

  state = {
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
      nearbyPost : [],
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
  }

  async componentDidMount() {
    const { id } = this.$router.params

    const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })
    
    await this.props.dispatchAppointmentNearbyPost({id}).then(res=>console.log(res))

    

    Taro.setNavigationBarTitle({ title: `${data.title}·${data.apartment_title}` })

    const buttons = !data.is_sign
      ? [{ message: '预约看房', method: 'onCreateBusiness' }]
      : [{ message: '预约看房', method: 'onCreateBusiness' }, { message: '签约下定', method: 'onCreateOrder' }]

    let facilitys = data.facility_list
    let roomMatch = []
    let publicMatch = []
    facilitys && facilitys.map(i => {
      i.type === 2 && roomMatch.push(i)
      i.type === 1 && publicMatch.push(i)
    })

    const roomMatch_list = roomMatch.slice(0, 5)
    const publicMatch_list = publicMatch.slice(0, 5)
    const roomList = (data.room_list).slice(0, 5)


    data && this.setState({
      roomMatch_list: roomMatch_list,
      publicMatch_list: publicMatch_list,
      houseType_id: id,
      buttons,
      houstType: {
        id: data.id,
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
        title: `${data.title}·${data.apartment_title}`,
        priceTitle: data.price_title,
        hotRules: data.hot_rules.map(i => ({ ...i, url: `${PAGE_ACTIVITY_APARTMENT}?id=${i.id}` })),
        types: data.other_house_type.map(i => ({ ...i, url: `${PAGE_HOUSE_TYPE_SHOW}?id=${i.id}` })),
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

  onSearchRoom(){
    const { id } = this.$router.params
    Taro.navigateTo({url : `/pages/apartment/search-room?id=${id}`})
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
      Taro.navigateTo({
        url: `${PAGE_APPOINTMENT_CREATE}?id=${houstType.id}`
      })
    }
    if (method === 'onCreateOrder') {
      this[method]()
    }
  }



  render() {
    const { apartments } = this.props

    const { houstType, map, buttons, showRentDescription, houseType_id, showMatch, roomMatch_list, publicMatch_list, showApartRoom } = this.state
    const { latitude, longitude, markers } = map
    const {
      title, swipers, isCollect, cost, types, priceTitle,
      descList, desc, roomList, isSign, cover,
      notices, cbds, intro, rules, facilitys, apartmentTitle, position, tags, cost_info, id
    } = houstType


    const isNaNPrice = Number.isNaN(parseInt(priceTitle))

    const BrandingStyle = {
      backgroundColor: "rgb(248,248,248)",
      borderRadius: "12px",
    }

    const PublicConfiguration = {
      backgroundColor: "rgba(248, 248, 248, 1)",
      borderRadius: "12px",
      padding: " 2px 6px"
    }

    const deposit = {
      borderRadius: "12px",
      backgroundColor: "rgba(255, 201, 25, 1)",
      color: "#fff",
      fontSize: "11px",
      textAlign: "center",
    }

    const ScrollWrapStyle = {
      height: '210px',
      whiteSpace: "nowrap"
    }

    const imageStyle = {
      width: '300px',
      height: Taro.pxTransform(346),
      display: "inline-block",

    }

    const textDeal = {
      wordBreak: "break-all",
      textIndent: "10px"
    }

    return <ApartmentContainer
      houseType_id={houseType_id}
      swipers={swipers}
      show={false}
      isCollect={isCollect}
      onCreateFavorite={this.onCreateFavorite}
      onDeleteFavorite={this.onDeleteFavorite}
    >


      <TabBar
        show={!showRentDescription && !showMatch}
        hasShare
        hasContact
        buttons={buttons}
        onClick={this.onClick}
      />

      <ApartmentRentDescriptionMask
        cost={cost}
        cost_info={cost_info}
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
      <View className='at-row at-row__justify--between at-row__align--end  mt-2'>
        <View className='text-yellow at-col'>
          <Text className='text-super ' style={{ fontSize: '23px' }}>
            {isNaNPrice ? priceTitle : `${LOCALE_PRICE_SEMICOLON}${parseFloat(priceTitle)}`}
          </Text>
          <Text className='text-large'>{LOCALE_PRICE_START}</Text>
        </View>

        <View className='at-col '>
          <View className='at-row at-row__align--center at-row__justify--end mb-2'>
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
            <Text className={`text-normal badge badge-${i.type}`}> #{ACTIVITY_TYPE_DIST[i.type]['message']}#</Text>
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
      <View className='at-row at-row__align--center'>
        <View className='at-col at-col-1 mt-1'>
          <Image src='https://images.gongyuabc.com//image/path.png' style='width:12px;height:16px'></Image>
        </View>
        <View className='at-col at-col-3 text-large text-secondary  ml-1'>{position}</View>
      </View>

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

      {/* 公共配置 */}
      <View className='at-row at-row--wrap mt-4'>

        {roomMatch_list && roomMatch_list.map(i =>
          <View style={PublicConfiguration} key={i.title} className='at-col at-col-1 text-center at-col--auto mr-2'>
            <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} />
            <View className='text-small'>{i.title}</View>
          </View>
        )}

        <View style={PublicConfiguration} className='text-center'>
          <View onClick={this.onOpenAllMatching} style={{ height: '35px', width: '30px' }}>...</View>
          <View className='text-small'>更多</View>
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

      {/* 可租房间 */}
      <View >
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
          showApartRoom && <View
            onClick={this.onshowMorePic}
            className='text-secondary text-normal mt-2'
            style={{ textAlign: "center" }} >显示更多<AtIcon value='chevron-down' size='20' color='#888888'></AtIcon></View>
        }
        <View onClick={this.onSearchRoom} className='text-secondary at-row at-row__align--center at-row__justify--end'>
          <AtIcon className='ml-2' value='search' size='13' color={COLOR_GREY_0} />
          <Text className='ml-2 text-normal text-muted'>搜索房间</Text>
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

      {/* 看房指南 */}
      {/* <View>
        <View className='text-bold text-huge mt-4'>看房指南</View>
        <View className='text-secondary text-normal mt-2'>{lookTime}</View>
        {lookTips !== '' && <View className='text-secondary text-normal mt-2'>{lookTips}</View>}
      </View> */}

      {/* 公寓信息 */}
      <View>
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
        <View className='text-secondary text-normal' style={textDeal}>{desc}</View>
        <View className='at-row at-row--wrap mt-3 mb-3'>
          {publicMatch_list && publicMatch_list.map(i =>
            <View style={PublicConfiguration} key={i.title} className='at-col at-col-1 text-center at-col--auto  mr-2'>
              <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} />
              <View className='text-small'>{i.title}</View>
            </View>
          )}

          <View style={PublicConfiguration} className='text-center'>
            <View onClick={this.onOpenAllMatching} style={{ height: '30px', width: '30px' }}>...</View>
            <View className='text-small'>更多</View>
          </View>
        </View>

        <View style={ScrollWrapStyle} className='at-col'>
          <ScrollView scrollX>
            {types && types.map((i, index) =>
              <View style={imageStyle} key={i.id} className={`${index + 1 != types.length && 'border-bottom'} at-col at-col-5 pr-2  mt-2 `}>
                <ApartmentTypeItem item={i} />
              </View>)}
          </ScrollView>
        </View>


        {/* {types.map((i, index) =>
          <View key={i.id} className={`${index + 1 != types.length && 'border-bottom'} mt-2`}>
            <ApartmentTypeItem item={i} />
          </View>)} */}

      </View>

      {/* 看了又看 */}
      {city &&
        <View>
          <View className='text-bold text-huge mt-2 mb-2'>附近公寓</View>
          <ApartmentList
            canScroll
            mini
            key={apartments.type}
            type={apartments.type}
            items={apartments.list}
            defaultPayload={{ city }}
            dispatchList={this.props.dispatchRecommendHouseType}
          />
        </View>
      }


    </ApartmentContainer>
  }
}

export default HouseTypeShow
