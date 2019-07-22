// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { AtAvatar, AtIcon } from 'taro-ui'
import { View, Map, Image, Text } from '@tarojs/components'

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

// 自定义变量
import { COLOR_GREY_2, COLOR_RED } from '@constants/styles'
import { ORDER_HEADERS } from '@constants/order'
import { APARTMENT_NOTICE_DIST, ACTIVITY_TYPE_DIST, HOUSE_TYPE_DESC } from '@constants/apartment'
import { LOCALE_PRICE_START, LOCALE_PRICE_SEMICOLON, LOCALE_SEMICOLON, LOCALE_LOCK_NOTICE } from '@constants/locale'
import { PAGE_HOME, PAGE_ACTIVITY_APARTMENT, PAGE_HOUSE_TYPE_SHOW, PAGE_APARTMENT_SHOW, PAGE_ORDER_CREATE } from '@constants/page'

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
    houstType: {
      cbds: [],
      rules: [],
      swipers: [],
      special: [],
      notices: [],
      hotRules: [],
      facilitys: [],
      roomList: [],
    },
    map: {
      latitude: 0,
      longitude: 0,
      markers: [],
    },
    buttons: [],
    showRentDescription: false

  }

  async componentDidMount() {
    const { id = 83 } = this.$router.params

    const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })

    Taro.setNavigationBarTitle({ title: `${data.title}·${data.apartment_title}` })

    const buttons = !data.is_sign
      ? [{ message: '预约看房', method: 'onCreateBusiness' }]
      : [{ message: '预约看房', method: 'onCreateBusiness' }, { message: '签约下定', method: 'onCreateOrder' }]

    let facilitys = data.facility_list
    const facilitys_list = facilitys.slice(0, 5)


    this.setState({
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
        roomList: data.room_list,
        isCollect: data.is_collect,
        facilitys: facilitys_list,
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
    const roomList = houstType.roomList.map(i => i.id == payload.room_id ? { ...i, is_collect: true } : i)
    this.props.dispatchFavoriteCreate(payload)
      .then(() => this.setState({ houstType: { ...houstType, roomList } }))
  }

  onRoomDeleteFavorite({ payload }) {
    const { houstType } = this.state

    const roomList = houstType.roomList.map(i => i.id == payload.room_id ? { ...i, is_collect: false } : i)
    this.props.dispatchFavoriteDelete(payload)
      .then(() => this.setState({ houstType: { ...houstType, roomList } }))
  }

  onShareAppMessage() {
    return {
      title: "我在公寓ABC上发现了一个好\n房源",
    }
  }

  /**
   * 点击
   */
  onClick(method) {
    this[method]()
  }


  render() {
    const { apartments } = this.props

    const { houstType, map, buttons, showRentDescription } = this.state
    const { latitude, longitude, markers } = map
    const {
      title, swipers, isCollect, cost, types, priceTitle,
      descList, desc, roomList, isSign, lookTime, lookTips, cover,
      notices, cbds, intro, hotRules, rules, facilitys, apartmentTitle, position, tags, cost_info,id
    } = houstType


    const colors = ['blue', 'red', 'yellow']
    const isNaNPrice = Number.isNaN(parseInt(priceTitle))

    const BrandingStyle = {
      backgroundColor: "rgb(248,248,248)",
      borderRadius: "12px"
    }

    const PublicConfiguration = {
      backgroundColor: "rgba(248, 248, 248, 1)",
      borderRadius: "12px",
      padding: " 2px 5px"
    }


    return <ApartmentContainer
      swipers={swipers}
      isCollect={isCollect}
      onCreateFavorite={this.onCreateFavorite}
      onDeleteFavorite={this.onDeleteFavorite}
    >


      <TabBar
        show={!showRentDescription}
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


      {/* 头部 */}
      <View className='text-bold text-huge'>{title}</View>
      <View className='text-secondary text-normal'>{intro}</View>

      {/* 价格相关 */}
      <View className='at-row at-row__justify--between at-row__align--center  mt-2'>
        <View className='text-yellow'>
          <Text className='text-super text-bold'>
            {isNaNPrice ? priceTitle : `${LOCALE_PRICE_SEMICOLON}${parseFloat(priceTitle)}`}
          </Text>
          <Text className='text-large'>{LOCALE_PRICE_START}</Text>
        </View>

        <View>
          <View className='at-row at-row__align--center at-row__justify--end'>
            <View onClick={this.onOpenRentDescription} className='text-small text-secondary'>{cost}</View>
            <ABCIcon icon='chevron_right' color={COLOR_GREY_2} size='17' />
          </View>
        </View>
      </View>

      {/* 活动信息 */}
      {/* {hotRules.map((i, index) =>
        <View className='at-row at-row__align--center' key={i.id}>
          <View className='at-col at-col-2'>
            <Tag
              small active
              circle
              type={colors[index % 3]}
              onClick={this.onNavigation.bind(this, i.url)}
            >#{i.title}#</Tag>
          </View>
          <View className='text-secondary text-small ml-4 at-col at-col-6'>{i.title}</View>
        </View>
      )} */}

      <View >
        {rules.map(i =>
          <View key={i.id} className=' mt-2 mr-3'>
            <Text className={`badge badge-${i.type}`}> #{ACTIVITY_TYPE_DIST[i.type]['message']}#</Text>
            <Text className='text-secondary text-small ml-3'>{i.content}</Text>
          </View>
        )}
      </View>

      {/* 品牌宣传 */}
      <View style={BrandingStyle}>
        <Tag className='my-3' active circle>
          <View className='at-row  at-row__justify--center text-secondary'>

            <View className='at-row at-row__align--end'>
              <ABCIcon icon='lens' color='#888888' size='18' />
              <View className='ml-2'>100%免中介费</View>
            </View>

            <View className='at-row at-row__align--end'>
              <ABCIcon icon='lens' color='#888888' size='18' />
              <View className='ml-2'>严选厦门3万+房源</View>
            </View>

          </View>
        </Tag>
      </View>

      {/* 地图 */}
      <View className='at-row at-row__align--start'>
        <View className='at-col at-col-1'>
          <ABCIcon icon='map-pin' color='#888888' size='20' />
        </View>
        <View className='at-col at-col-3 text-normal text-secondary  ml-2'>{position}</View>
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
          <View className='text-normal text-secondary mt-2'>{desc}</View>
        </View>
      }

      {/* 公共配置 */}
      <View className='at-row at-row--wrap mt-4'>

        {facilitys.map(i =>
          <View style={PublicConfiguration} key={i.title} className='at-col at-col-1 text-center at-col--auto  mr-2'>
            <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} />
            <View className='text-small'>{i.title}</View>
          </View>
        )}

        <View style={PublicConfiguration} className='text-center'>
          <Image src={facilitys[0].icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} ></Image>
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
        <View className='text-bold text-huge'>可租房间</View>
        {
          isSign && <OrderHeader items={ORDER_HEADERS} ></OrderHeader>
        }
        {roomList.map((i, index) =>
          <RoomItem
            key={i.id}
            room={i}
            isSign={isSign}
            onCreateFavorite={this.onRoomCreateFavorite}
            onDeleteFavorite={this.onRoomDeleteFavorite}
            className={`${index + 1 !== roomList.length && 'border-bottom'} pt-1`}
          />)}
      </View>

      {/* <View className='at-row at-row__justify--between at-row__align--center mt-4'>
          <View className='text-bold text-huge'>可租房间</View>
        </View>
        {isSign && <View className='my-2'>
          <OrderHeader items={ORDER_HEADERS} />
        </View>}
        {roomList.map((i, index) =>
          <RoomItem
            key={i.id}
            room={i}
            roomList={roomList}
            isSign={isSign}
            onCreateFavorite={this.onRoomCreateFavorite}
            onDeleteFavorite={this.onRoomDeleteFavorite}
            className={`${index + 1 !== roomList.length && 'border-bottom'} pt-1`}
          />)} */}

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
        <View className='text-bold text-huge mt-4'>公寓信息</View>
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
        <View style='text-indent: 10px' className='text-secondary text-normal'>{desc}</View>
        <View className='at-row at-row--wrap mt-2'>
          {facilitys.map(i =>
            <View style={PublicConfiguration} key={i.title} className='at-col at-col-1 text-center at-col--auto  mr-2'>
              <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} />
              <View className='text-small'>{i.title}</View>
            </View>
          )}

          <View style={PublicConfiguration} className='text-center'>
            <Image src={facilitys[0].icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} ></Image>
            <View className='text-small'>更多</View>
          </View>
        </View>
        {types.map((i, index) =>
          <View key={i.id} className={`${index + 1 != types.length && 'border-bottom'} mt-2`}>
            <ApartmentTypeItem item={i} />
          </View>)}

      </View>

      {/* 看了又看 */}
      {city &&
        <View>
          <View className='text-bold text-huge mt-4'>附近公寓</View>
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
