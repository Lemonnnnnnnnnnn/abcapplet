
// Taro 相关
import Taro, { Component, setStorage } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'


// 自定义组件
import CityModal from '@components/city-modal'
import Carousel from '@components/carousel'
import Search from '@components/search'
import Header from '@components/header'
import Select from '@components/select'
import ApartmentList from '@components/apartment-list'
import RequirementCard from '@components/requirement-card'
import Curtain from '@components/curtain'

import { PAGE_HOME, PAGE_USER_AUTH } from '@constants/page'

import { AD_DISPATCH_DIST } from '@constants/ad'

// 自定义方法
import textWrap from '@utils/text-wrap'
import getUserLocation from '@utils/location'
import Map from '@utils/qqmap-wx-jssdk'

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
  LOCALE_SHARE_TEXT,
  LOCALE_PROJECT_NAME,
  LOCALE_XIAMEN,
  LOCALE_NO_LIMIT
} from '@constants/locale'
import { RECOMMED } from '@constants/picture'
import BaseComponent from '../../components/base'

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
    navigationBarTitleText: LOCALE_PROJECT_NAME,
    enablePullDownRefresh: true,
  }

  constructor(props) {
    super(props)
    const showCurtain = Taro.getStorageSync('CurtainShow') ? true : false

    this.state = {
      payloadApartment: PAYLOAD_APARTMENT_LIST,
      // 弹窗相关
      showCard: false,//显示需求卡1
      showCurtain: showCurtain,

      roomList: [],
      floorList: [],
      adList: [],

      latitude: 0,
      longitude: 0,


      // 搜索相关
      searchScrollTop: null,
      searchIsFixed: false,

      // 选择器相关
      selectIsFixed: false,
      // 筛选框转化为浮动单位的位置已写死，如果后续需要在上面插入新的元素，请重新修改以下数值
      selectScrollTop: 990,


      scrollNow: false,
      showSearch: true,
      showSelect: true,

      // 城市相关
      selector: [LOCALE_XIAMEN],
    }
  }
  refApartmentList = (node) => this.apartmentList = node

  async onPullDownRefresh() {
    // await this.componentWillMount()
    this.apartmentList.onReset(null)
    Taro.stopPullDownRefresh()
  }

  async componentWillMount() {
    // 获取幕帘弹窗内容
    this.props.dispatchPopupAdPost().then(({ data: { data } }) => {
      this.setState({ adList: data })
      Taro.getStorageSync('user_info').token && data.length && this.setState({ showCurtain: true })
    })
    // 获取从后台获取的全平台获得退租险人数
    this.props.dispatchRiskPost()

    const {
      searchScrollTop,
      payloadApartment,
    } = this.state

    this.setState({ payloadApartment: { ...payloadApartment, city: Taro.getStorageSync('user_info').citycode } })

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

    // 拉取城市列表
    await this.props.dispatchCityList().then(({ data: { data } }) => {
      const citys = data.list
      // 设置城市选择器
      const selector = citys.map(i => i.title)
      const selectorCity = citys.filter(i => i.id === user.citycode)[0]

      const [selectorCityTitle, selectorCitySort] = selectorCity ?
        [selectorCity.title, selectorCity.sort] : [LOCALE_XIAMEN, 1]

      this.setState({
        selector,
        selectorChecked: {
          title: selectorCityTitle,
          sort: selectorCitySort
        }
      })
    })
    //判断是否弹出需求卡
    await this.props.dispatchGetUserMsg().then(res => {
      res && !res.data.data.user.is_guide && this.setState({ showCard: true })
    })
  }

  componentDidShow() {
    Taro.showTabBarRedDot({ index: 2 })
    const user_info = Taro.getStorageSync('user_info')
    console.log(user_info.citycode)
  }

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

  onLogin() {
    Taro.reLaunch({ url: PAGE_USER_AUTH })
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

        getUserLocation(res.latitude, res.longitude).then(city_id => this.props.dispatchSetCity({ city_id }))


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

      }
    }).catch(err => { console.log(err) })

  }

  // 刷新页面
  onRefreshPage() {
    Taro.reLaunch({ url: PAGE_HOME })
  }

  /**
   * 选择城市
   */
  async onSelectCity(citycode, title, sort) {
    const { selectorChecked } = this.state

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
    await this.props.dispatchAdList({ city: citycode, type: 0 }) && overloadData.push(1)
    // 字典
    await this.props.dispatchDistList(citycode) && overloadDist.push(1)

    // 当数据全部加载完成后读取筛选框的位置
    // overloadData.length === 3 && !selectScrollTop && Taro.createSelectorQuery()
    //   .in(this.$scope)
    //   .select('.home-select')
    //   .boundingClientRect()
    //   .exec(res => this.setState({ selectScrollTop: res[0].top, }))

    title && sort && this.setState({ selectorChecked: { ...selectorChecked, title, sort } })

    overloadDist.length === 1 && this.initialHouseType()
  }

  // 初始化户型的数据，供筛选项使用
  initialHouseType() {
    const initialFloor = [{ id: 0, title: LOCALE_NO_LIMIT }]
    const initialRoom = [{ id: 0, title: LOCALE_NO_LIMIT }]
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

    this.setState({ selectorChecked: { sort: newCity.sort, title: newCity.title } })
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


  // 关闭幕帘
  onCloseCurtain() {
    const { adList } = this.state
    let id = ''
    adList.forEach(i => id += i.id)
    const idStr = id.split('').toString()

    Taro.getStorageSync('user_info').token ?
      this.props.dispatchClosePopupAdPost({ id: idStr }).then(() =>
        this.setState({ showCurtain: false })
      )
      :
      this.setState({ showCurtain: false })

  }

  onShareAppMessage() {
    const text = LOCALE_SHARE_TEXT
    return {
      title: textWrap(text, 17)
    }
  }

  //前往橘子公社小程序
  openMiniProgramCreate() {
    Taro.navigateToMiniProgram({
      appId: 'wxd3537ccb429de3b4', // 要跳转的小程序的appid
    }).catch(e => console.log(e))
  }
  render() {

    const {
      showSelect, showSearch, floorList, roomList,
      searchIsFixed,
      searchScrollTop,
      selector,
      selectorChecked,
      selectIsFixed,
      payloadApartment,

      showCard,
      showCurtain,

      adList
    } = this.state

    const { ads, user, dists, citys, apartments, home } = this.props

    const { banner: banners, hot_activity: activities, hot_cbd: cbds, recommend: recommends } = home
    return (
      <View
        className='page-white'
        style={{ overflow: "hidden", minHeight: '300vh' }}
      >
        <View>
          {/* 搜索框 & 城市选择器 */}
          <View className='home-search pl-3 pr-3'>
            {
              <Search
                className='mb-2'
                isFixed={searchIsFixed}
                showSearch={showSearch}

                selector={selector}
                selectorChecked={selectorChecked}
                onChangeSelector={this.onChangeSelector}
              />
            }
            {/* 将搜索框设为flex布局的同时填充同高度的空白区域以使页面布局不会错乱 */}
            <View style={searchIsFixed ? { height: Taro.pxTransform(92) } : {}}></View>
          </View>

          {/* 轮播 */}
          <View style={{ minHeight: Taro.pxTransform(530) }}>
            {banners.length &&
              <Carousel
                className='mt-2'
                type='banner'
                carousel={banners}
              />
            }
          </View>

          {/* 热门租房商圈 */}
          <View style={{ minHeight: Taro.pxTransform(176) }}>
            {cbds.length &&
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
          </View>

          {/* 广告 */}
          <View>
            {ads.length &&
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
          </View>

          {/* 推荐品牌公寓 */}
          <View style={{ minHeight: Taro.pxTransform(275) }}>
            {recommends.length &&
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
          </View>

          {/* 活动专区 */}
          <View style={{ minHeight: Taro.pxTransform(240) }}>
            {activities.length &&
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
          </View>

          {/* 优选入口 */}
          <View className='mx-1' style={{ minHeight: Taro.pxTransform(180) }} onClick={this.openMiniProgramCreate}>
            <Image src={RECOMMED} className='user-home-image'></Image>
          </View>


          {/* 严选公寓 */}
          <View className='selectTab'>
            <Header className='mt-4 mb-2' title={LOCALE_APARTMENT} hasExtra={false} />
            <View className='home-select'>
              {/* 选择框下拉框部分 */}
              {
                // 如果dists不为空对象时渲染Select组件
                Object.keys(dists).length && <Select
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
              {banners.length && <ApartmentList
                key={apartments.type}
                type={apartments.type}
                items={apartments.list}
                imgHeight={414}
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



        {adList.length && <Curtain adList={adList} onClose={this.onCloseCurtain} isOpened={showCurtain} />}
      </View>
    )
  }
}

export default CommonHome
