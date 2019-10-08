// Taro 相关
import Taro, { Component, setStorage } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

// 自定义组件
import CityModal from '@components/city-modal'
import Carousel from '@components/carousel'
import Search from '@components/search'
import Header from '@components/header'
import Select from '@components/select'
import ApartmentList from '@components/apartment-list'
import RequirementCard from '@components/requirement-card'
import GetAuthorizationMask from '@components/get-authorization-mask'

import {
  PAGE_HOME,
  PAGE_USER_AUTH
} from '@constants/page'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as adActions from '@actions/ad'
import * as distActions from '@actions/dist'
import * as cityActions from '@actions/city'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'
import * as apartmentLookActions from '@actions/apartmentlook'
import * as homeActions from '@actions/home'

// 自定义常量
import {
  PAYLOAD_APARTMENT_LIST,//公寓列表
  PAYLOAD_CREATE_DEMAND,//{ budget:'',cbd:0,living_time:'',people:'',house_type:0 }
} from '@constants/api'


import {
  LOCALE_HOT_CBD,
  LOCALE_ACTIVITY,
  LOCALE_APARTMENT,
  LOCALE_RECOMMEND_APARTMENT,
} from '@constants/locale'
import BaseComponent from '../../components/base';

@connect(state => state, {
  ...adActions,
  ...cityActions,
  ...userActions,
  ...distActions,

  ...apartmentActions,
  ...apartmentLookActions,
  ...homeActions,
})
class CommonHome extends BaseComponent {
  config = {
    navigationBarTitleText: '公寓ABC',
    enablePullDownRefresh: true,
  }

  state = {
    payloadApartment: PAYLOAD_APARTMENT_LIST,
    // 弹窗相关
    showCard: false,//显示需求卡1
    showAuthorizationMask: false,

    roomList: [],
    floorList: [],

    latitude: 0,
    longitude: 0,


    // 搜索相关
    searchScrollTop: null,
    searchIsFixed: false,

    // 选择器相关
    selectIsFixed: false,
    selectScrollTop: null,


    scrollNow: false,
    showSearch: true,
    showSelect: true,

    // 城市相关
    selector: ['厦门市'],
    selectorChecked: '厦门市',
    cityCode: 0,

  }
  async onPullDownRefresh() {
    await this.componentWillMount()
    Taro.stopPullDownRefresh()
  }

  onLogin() {
    Taro.reLaunch({ url: PAGE_USER_AUTH })
  }

  refApartmentList = (node) => this.apartmentList = node

  async componentDidShow() {

    //A漏斗  进入首页——进入公寓详情——点击预约
     this.props.dispatchFunnel({type:1,step:1,origin_id:0})
     //B漏斗  进入首页——进入户型详情——点击预约
     this.props.dispatchFunnel({type:2,step:1,origin_id:0})

    //判断是否弹出需求卡
    this.props.dispatchGetUserMsg().then((res) => {
      if (res && res.data.data.user.is_guide === 0) {
        this.setState({ showCard: true })
      }
    })
  }

  async componentWillMount() {
    const {
      searchScrollTop,
      payloadApartment,
    } = this.state

    this.setState({ payloadApartment: { ...payloadApartment, city: Taro.getStorageSync('user_info').citycode, } })

    // 获取筛选器和搜索框距离顶部的距离
    !searchScrollTop
      && Taro.createSelectorQuery()
        .in(this.$scope)
        .select('.home-search')
        .boundingClientRect()
        .exec(res => res[0] && res[0].height > 0 && this.setState({ searchScrollTop: res[0].height }))

    // 如果是分享页面进来的进行跳转
    const { page, id } = this.$router.params

    page && id && Taro.navigateTo({ url: `${page}?id=${id}` })

    // 获取用户数据 和 刷新页面数据
    const { payload: user } = await this.props.dispatchUser()

    user && this.onSelectCity(user.citycode)
    user && this.setState({ cityCode: user.citycode })

    // 拉取城市列表
    this.props.dispatchCityList().then((res) => {
      const citys = res.data.data.list
      // 设置城市选择器
      const selector = citys.map(i => i.title)
      const selectorCity = citys.filter(i => i.id === user.citycode)[0]
      const selectorChecked = selectorCity ? selectorCity.title : '厦门市'

      this.setState({ selector, selectorChecked })
    })
  }

  // 获取经纬度
  async onGetLocation() {
    const { payloadApartment } = this.state

    await Taro.getLocation({
      success: res => {
        this.setState({
          payloadApartment: {
            ...payloadApartment,
            latitude: res.latitude,
            longitude: res.longitude,
            city: Taro.getStorageSync('user_info').citycode,
          },
        })

        Taro.setStorageSync('latitude', res.latitude)
        Taro.setStorageSync('longitude', res.longitude)
      },
      fail: () => {
        this.setState({
          payloadApartment: {
            ...payloadApartment,
            latitude: 0,
            longitude: 0,
            city: Taro.getStorageSync('user_info').citycode,
          },
        })

        Taro.setStorageSync('latitude', 0)
        Taro.setStorageSync('longitude', 0)

        Taro.getSetting().then(res => {
          const index = Taro.getStorageSync('haveLocationPower')
          Taro.setStorageSync('haveLocationPower', parseInt(index) + 1)

          if (parseInt(index) === 1) {
            const haveLocationPower = res.authSetting['scope.userLocation']
            !haveLocationPower && this.setState({ showAuthorizationMask: true })
          }

        })
      }
    }).catch(err => { console.log(err) })
  }

  // 关闭获取授权弹窗
  onCloseAuthorizationMask() {
    this.setState({ showAuthorizationMask: false })
    this.onRefreshPage()
  }

  // 刷新页面
  onRefreshPage() {
    Taro.reLaunch({ url: '/pages/common/home' })
  }

  /**
   * 选择城市
   */
  async onSelectCity(citycode, title) {

    const {
      selectScrollTop,
      // latitude,
      // longitude
    } = this.state

    const overloadData = []
    const overloadDist = []

    // 当城市 id 不存在的时候不读取数据
    if (citycode === 0 || !citycode) return;

    // 城市
    await this.props.dispatchUserCity(citycode) && overloadData.push(1)

    // 在展示list之前获取经纬度
    await this.onGetLocation()

    // 商圈,轮播图,品牌公寓,活动专区
    await this.props.dispatchHomeMsg(citycode) && overloadData.push(1)
    //  广告
    await this.props.dispatchAdList(citycode) && overloadData.push(1)
    // 字典
    await this.props.dispatchDistList(citycode) && overloadDist.push(1)

    // 当数据全部加载完成后读取筛选框的位置
    overloadData.length === 3 && !selectScrollTop && Taro.createSelectorQuery()
      .in(this.$scope)
      .select('.home-select')
      .boundingClientRect()
      .exec(res => this.setState({ selectScrollTop: res[0].top, }))

    this.setState({ selectorChecked: title })

    overloadDist.length === 1 && this.initialHouseType()
  }

  // 初始化户型的数据，供筛选项使用

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

  /**
   * 城市相关选择器数据
   * @param {*} param0
   */
  onChangeSelector({ currentTarget: { value } }) {

    const { citys } = this.props
    const { selector } = this.state
    const selectorChecked = selector[value]
    const newCity = citys.filter(i => i.title === selectorChecked)[0]

    const user_info = Taro.getStorageSync('user_info')
    Taro.setStorageSync('user_info', { ...user_info, citycode: newCity.id })

    this.setState({ selectorChecked })
    this.onSelectCity(newCity.id)

    this.onRefreshPage()


  }

  onSearchTrue() {
    this.setState({ showSearch: true, showSelect: true })
  }
  /**
   * 利用坐标来确定什么时候 fixed 搜索栏和选择栏
   * @param {*} param0
   */
  onPageScroll({ scrollTop }) {
    const { apartments } = this.props

    const {
      selectIsFixed,
      selectScrollTop,
      searchScrollTop,
      searchIsFixed,
      apartmentScrollTop,
      scrollNow
    } = this.state

    // 搜索相关

    // 判断上滑还是下滑
    this.setState({ scrollNow: scrollTop })
    scrollTop > scrollNow && scrollTop > searchScrollTop && this.setState({ showSearch: false })
    scrollTop < scrollNow && this.setState({ showSearch: true })


    scrollTop > scrollNow && scrollTop > selectScrollTop && apartments.total !== 0 && this.setState({ showSelect: false })
    scrollTop < scrollNow && scrollTop > selectScrollTop && apartments.total !== 0 && this.setState({ showSelect: true })


    scrollTop > searchScrollTop
      && !searchIsFixed
      && this.setState({ searchIsFixed: true })

    scrollTop < searchScrollTop - 45
      && searchIsFixed
      && this.setState({ searchIsFixed: false })

    // 公寓相关

    scrollTop > selectScrollTop + 87
      && apartments.total !== 0
      && !selectIsFixed
      && this.setState({ selectIsFixed: true })


    scrollTop < selectScrollTop - 46
      && selectIsFixed
      && this.setState({ selectIsFixed: false })

    // 公寓相关
    !apartmentScrollTop
      && Taro.createSelectorQuery()
        .in(this.$scope)
        .select('.home-apartment')
        .boundingClientRect()
        .exec(res => this.setState({ apartmentScrollTop: res[0].top }))
  }

  /**
   * 到底部加载公寓下一页
   */
  onReachBottom() {
    this.apartmentList.onNextPage()
  }

  /**
   * 当选择栏变化时更新公寓数据
   */
  async onApartmentPayloadChange({ payload }) {
    this.apartmentList.onReset(payload)
  }

  /**
   * 添加心愿单
   */
  onCreateFavorite({ payload }) {
    this.props.dispatchFavoriteCreate(payload)
  }

  /**
   * 删除心愿单
   */
  onDeleteFavorite({ payload }) {
    this.props.dispatchFavoriteDelete(payload)
  }

  /**
 * 关闭需求卡1
 */
  onCloseCard() {
    this.props.dispatchRequirementCheck()
    this.setState({ showCard: false })
  }

  // 分享

  onShareAppMessage() {
    return {
      title: "我在公寓ABC上发现了一个好\n房源",
    }
  }
  //前往橘子公社小程序
  openMiniProgramCreate() {
    Taro.navigateToMiniProgram({
      appId: 'wxd3537ccb429de3b4', // 要跳转的小程序的appid

      success(res) {
        // 打开成功
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }

    })
  }
  render() {

    const {
      showSelect, showSearch, floorList, roomList,
      searchIsFixed,
      searchScrollTop,
      selector,
      selectorChecked,
      selectIsFixed,
      cityCode,
      payloadApartment,

      showCard,
      showAuthorizationMask
    } = this.state


    const {
      ads, user, dists,
      citys, apartments, home
    } = this.props

    const { banner: banners, hot_activity: activities, hot_cbd: cbds, recommend: recommends } = home

    const citycode = Taro.getStorageSync('user_info').citycode
    let current = 0
    if (citycode === 350200) { current = 0 } else { current = 1 }

    return (
      <View
        className='page-white'
        style={{ overflow: "hidden",minHeight : '300vh' }} >
        <View>
          {/* 搜索框 & 城市选择器 */}
          <View className='home-search pl-3 pr-3'>
            {
              <Search
                className='mb-2'
                isFixed={searchIsFixed}
                showSearch={showSearch}
                current={current}


                selector={selector}
                selectorChecked={selectorChecked}
                onChangeSelector={this.onChangeSelector}
              />
            }
            <View style={searchIsFixed ? { height: Taro.pxTransform(92) } : {}}></View>
          </View>
          {/* 轮播 */}
          {banners.length > 0 &&
            <Carousel
              className='mt-2'
              type='banner'
              carousel={banners}
            />
          }

          {/* 热门租房商圈 */}
          {cbds.length > 0 &&
            <View >
              <Header
                className='mb-2'
                title={LOCALE_HOT_CBD}
              />
              <Carousel
                type='cbd'
                imageHeight='176'
                imageWidth='312'
                carousel={cbds}
                hasContent={false}
                haveText={false}
              />
            </View>
          }

          {/* 广告 */}
          {ads.length > 0 &&
            <Carousel
              className='mt-2'
              type='normal'
              imageHeight='126'
              imageWidth='686'
              carousel={ads}
              hasContent={false}
              haveText={false}
            />
          }

          {/* 推荐品牌公寓 */}
          {recommends.length > 0 &&
            <View>
              <Header
                className='mt-4 mb-2'
                title={LOCALE_RECOMMEND_APARTMENT}
              />
              <Carousel
                type='normal'
                imageHeight='275'
                imageWidth='642'
                carousel={recommends}
                hasContent={false}
              />
            </View>
          }

          {/* 活动专区 */}
          {activities.length > 0 &&
            <View>
              <Header
                className='mt-4 mb-2'
                title={LOCALE_ACTIVITY}
                hasExtra={false}
              />
              <Carousel
                type='normal'
                imageHeight='240'
                imageWidth='414'
                carousel={activities}
                hasContent={false}
                haveText={false}
              />
            </View>
          }

          {/* 优选入口 */}
          <View className='mx-1' onClick={this.openMiniProgramCreate}>
            <Image src='https://images.gongyuabc.com/image/recommed.png ' className='user-home-image'></Image>
          </View>


          {/* 严选公寓 */}
          <View className='selectTab'>
            <Header className='mt-4 mb-2' title={LOCALE_APARTMENT} hasExtra={false} />
            <View className='home-select'>
              {/* 选择框下拉框部分 */}
              {
                !(JSON.stringify(dists) === '{}') && <Select
                  onSearchTrue={this.onSearchTrue}
                  isFixed={selectIsFixed}
                  showSelect={showSelect}
                  top={searchScrollTop}

                  cityCode={Taro.getStorageSync('user_info').citycode}
                  autoSortDist={[]}
                  cbdDist={dists.cbd_list}
                  priceDist={dists.price_list}
                  houseTypeDist={dists.housetype_list}
                  specialSelectDist={dists.special_select}
                  onApartmentPayloadChange={this.onApartmentPayloadChange}
                />
              }
            </View>

            <View className='home-apartment ml-3 mr-3'>
              {banners.length > 0 && <ApartmentList
                key={apartments.type}
                type={apartments.type}
                items={apartments.list}
                ref={this.refApartmentList}
                defaultPayload={payloadApartment}
                onCreateFavorite={this.onCreateFavorite}
                onDeleteFavorite={this.onDeleteFavorite}
                dispatchList={this.props.dispatchApartmentList}
                dispatchNextPageList={this.props.dispatchNextPageApartmentList}
              />
              }

            </View>
          </View>

          {/* 城市模态框 */}
          <CityModal
            city={citys}
            citycode={user.citycode}
            onSelectCity={this.onSelectCity}
          />
        </View>

        {/* 需求卡 */}

        <RequirementCard
          show={showCard}
          onCloseCard={this.onCloseCard}
          dists={dists}

          initialFloor={floorList}
          initialRoom={roomList}
        />

        <GetAuthorizationMask
          type='getLocation'
          onClose={this.onCloseAuthorizationMask}
          show={showAuthorizationMask}
        />
      </View>
    )
  }
}

export default CommonHome
