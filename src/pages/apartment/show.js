// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Map, Image, Text, ScrollView } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import Tag from '@components/tag'
import TabBar from '@components/tab-bar'
import ABCIcon from '@components/abc-icon'
import ApartmentList from '@components/apartment-list'
import ApartmentTypeItem from '@components/apartment-type-item'
import ApartmentContainer from '@components/apartment-container'
import CustomNav from '@components/custom-nav'
// 自定义变量
import { COLOR_GREY_2 } from '@constants/styles'
import { PAGE_ACTIVITY_APARTMENT, PAGE_HOUSE_TYPE_SHOW, PAGE_APPOINTMENT_CREATE, PAGE_HOME } from '@constants/page'
import { APARTMENT_NOTICE_DIST, ACTIVITY_TYPE_DIST, TYPE_FAVORITE_APARTMENT } from '@constants/apartment'

const city = userActions.dispatchUser().payload.citycode
@connect(state => state, {
  ...userActions,
  ...apartmentActions,
})
class ApartmentShow extends Component {
  config = {
    navigationBarTitleText: '公寓详情',
    navigationStyle: 'custom',
  }

  state = {
    showLittleMask: false,
    apartment: {
      cbds: [],
      rules: [],
      swipers: [],
      special: [],
      notices: [],
      hotRules: [],
      facilitys: [],
    },
    map: {
      latitude: 0,
      longitude: 0,
      markers: [],
    },
    buttons: [],
    nearbyPost: [],
    statusBarHeight: 0,
    navHeight: 0,
  }

  async componentDidMount() {
    const { id } = this.$router.params

    const { data: { data } } = await this.props.dispatchApartmentShow({ id })

    await this.props.dispatchAppointmentNearbyPost({ id }).then(res => this.setState({ nearbyPost: res.data.data }))

    await Taro.getSystemInfo().then(res => {
      this.setState({ navHeight: 72, statusBarHeight: res.statusBarHeight })
      if (res.model.indexOf('iPhone X') !== -1) {
        this.setState({ navHeight: 88, statusBarHeight: res.statusBarHeight })
      } else if (res.model.indexOf('iPhone') !== -1) {
        this.setState({ navHeight: 64, statusBarHeight: res.statusBarHeight })
      }
    })


    let facilitys = data.facility_list
    let publicMatch = []
    facilitys && facilitys.map(i => {
      publicMatch.push(i)
    })

    const publicMatch_list = publicMatch.slice(0, 5)


    const buttons = !data.is_sign
      ? [{ message: '预约看房', method: 'onCreateBusiness' }]
      : [{ message: '预约看房', method: 'onCreateBusiness' }, { message: '签约下定', method: 'onCreateOrder' }]

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
    this.props.dispatchApartmentDataPost({type:1})
    const { showLittleMask } = this.state
    this.setState({ showLittleMask: !showLittleMask })
  }

  onCloseLittleMask() {
    this.setState({ showLittleMask: false })
  }

  onNavigation(url) {
    Taro.navigateTo({ url })
  }

  onOpenMap() {
    this.props.dispatchApartmentDataPost({type:5})
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
    this.props.dispatchApartmentDataPost({type:2})
    return {
      title: "我在公寓ABC上发现了一个好\n房源",
    }
  }

  onClick(method) {
    if (method === 'onCreateBusiness') {
      this.props.dispatchApartmentDataPost({type:3})
      const { apartment } = this.state
      const { id, types } = apartment
      // const { apartmentId, id } = houstType
      Taro.navigateTo({
        url: `${PAGE_APPOINTMENT_CREATE}?id=${types[0].id}&apartmentId=${id}`
      })
    }
    if (method === 'onCreateOrder') {
      this.props.dispatchApartmentDataPost({type:4})
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

  insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start)
  }


  onShareAppMessage() {
    this.props.dispatchApartmentDataPost({type:2})
    const { apartment } = this.state
    let { swipers, title } = apartment
    if (title.length > 17) {
      title = this.insertStr(title, 17, '\n')
    }
    return {
      title: title,
      imageUrl: swipers[0].url
    }
  }

  render() {
    const { apartment, map, publicMatch_list, buttons, showLittleMask, nearbyPost, navHeight } = this.state
    const { latitude, longitude, markers } = map
    const {
      title, swipers, isCollect, special, types, tags, desc,
      notices, cbds, intro, rules, position, cover,num } = apartment

    const BrandingStyle = {
      backgroundColor: "rgb(248,248,248)",
      borderRadius: Taro.pxTransform(32),
    }

    const textDeal = {
      wordBreak: "break-all",
      textIndent: Taro.pxTransform(20),
    }

    const PublicConfiguration = {
      backgroundColor: "rgba(248, 248, 248, 1)",
      borderRadius: Taro.pxTransform(24),
      padding: " 2px 6px"
    }

    const ScrollWrapStyle = {
      whiteSpace: "nowrap",
    }


    const imageStyle = {
      width: '300px',
      height: Taro.pxTransform(350),
      display: "inline-block",
    }

    const borderStyle = {
      borderRadius: Taro.pxTransform(12),
      boxShadow: "0 1px 6px rgb(220,220,220)",
      overflow: 'hidden',
      marginRight: Taro.pxTransform(28),
    }


    return (
      <View style={{ overflow: "hidden" }}>

        <CustomNav title='公寓详情' />


        <TabBar
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
        />

        <View onClick={this.onCloseLittleMask} style={{ paddingBottom: Taro.pxTransform(120), paddingTop: navHeight + "px" }}>

          <ApartmentContainer
            swipers={swipers}
            isCollect={isCollect}
            num={num}
            onCreateFavorite={this.onCreateFavorite}
            onDeleteFavorite={this.onDeleteFavorite}
          >

            {/* 加上边距 */}
            <View className='ml-3 mr-3'>

              {/* 头部 */}
              <View className='text-bold text-huge'>{title}</View>
              <View className='text-secondary text-normal'>{intro}</View>

              {/* 活动信息 */}
              <View className='mt-2'>
                {rules.length ? rules.map(i =>
                  <View key={i.id} className=' mr-3'>
                    <Text className={`text-smail badge badge-${i.type}`} > {ACTIVITY_TYPE_DIST[i.type]['message']}</Text>
                    <Text className='text-secondary text-small ml-2'>{i.content}</Text>
                  </View>
                ) : <View className='text-secondary'>暂无相关活动信息</View>
                }
              </View>


              <View style={BrandingStyle}>
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
                  <Image src='https://images.gongyuabc.com//image/path_new.png' style='width:12px;height:16px'></Image>
                </View>
                {
                  position ? <View className='text-normal text-secondary  ml-2'>{position}</View> : <View className='text-secondary text-normal ml-2'>暂无相关位置信息</View>
                }

              </View>

            </View>


            {/* 户型列表 */}

            {
              types &&
              <View style={ScrollWrapStyle} className='mt-4 ml-3' >

                <ScrollView scrollX>
                  {types.map((i, index) =>

                    <View style={imageStyle} key={i.id} className='at-col at-col-5 mt-1' >
                      <View style={borderStyle} className='' >
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
                  desc ? <View className='text-secondary text-normal' style={textDeal}>{desc}</View> : <View className='text-secondary'>暂无相关描述</View>
                }

                {/* 公共配置 */}

                <View className='at-row at-row--wrap mt-3 mb-3'>
                  {publicMatch_list && publicMatch_list.map(i =>
                    <View key={i.title} className='at-col at-col-1 text-center at-col--auto  mr-4'>
                      <Image src={i.icon} mode='aspectFit' style={{ height: '35px', width: '35px' }} />
                      <View className='text-small'>{i.title}</View>
                    </View>
                  )}

                  {publicMatch_list && publicMatch_list.length > 5 && <View style={PublicConfiguration} className='text-center'>
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
                  defaultPayload={{ city }}
                  dispatchList={this.props.dispatchRecommendHouseType}
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
