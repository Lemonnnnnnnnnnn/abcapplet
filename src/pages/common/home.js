// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtCurtain } from 'taro-ui'

// 自定义组件
import CityModal from '@components/city-modal'
import Carousel from '@components/carousel'
import Search from '@components/search'
import Header from '@components/header'
import Select from '@components/select'
import ApartmentList from '@components/apartment-list'
import RequirementCardMask from '@components/requirement-card-mask'
import RequirementCardMaskNext from '@components/requirement-card-mask-next'
import RequirementPriceMask from '@components/requirement-card-mask-price'
import RequirementHouseMask from '@components/requirement-card-mask-house'
import RequirementCbdMask from '@components/requirement-card-mask-cbd'
import classNames from 'classnames'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as adActions from '@actions/ad'
import * as cbdActions from '@actions/cbd'
import * as distActions from '@actions/dist'
import * as cityActions from '@actions/city'
import * as userActions from '@actions/user'
import * as bannerActions from '@actions/banner'
import * as activityActions from '@actions/activity'
import * as recommendActions from '@actions/recommend'
import * as apartmentActions from '@actions/apartment'
import * as apartmentLookActions from '@actions/apartmentlook'

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

@connect(state => state, {
  ...adActions,
  ...cbdActions,
  ...cityActions,
  ...distActions,
  ...userActions,
  ...bannerActions,
  ...activityActions,
  ...recommendActions,
  ...apartmentActions,
  ...apartmentLookActions,
})
class CommonHome extends Component {
  config = {
    navigationBarTitleText: '公寓ABC',
  }

  state = {
    payload: PAYLOAD_CREATE_DEMAND,
    showCard: false,//显示需求卡1
    showNextCard: false,//显示需求卡2
    showPrice: false,//需求卡2价格显示
    showHouse: false,//需求卡2户型显示
    showCbd: false,//需求卡2位置显示
    isOpen: false,
    isOpenedFinish: false,//需求卡填写完成


    currentPrice: -1,
    currentHouse: -1,
    currentCbd: -1,
    currentCbdTwo: -1,
    budget: '',
    type_room: 0,
    type_floor: 0,
    budgetDetail: '无',
    budgetDetailStore: "",
    roomDetail: '不限',
    floorDetail: "不限",
    cdbDetailDetail: '无',
    cbdListItem: [],
    placeSelected: [],//三层有数据
    cdbDetailList: [],//三层有数据
    place: '',//三层无数据

    roomList: [],
    floorList: [],


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

    timeTagList: [
      { id: 1, name: '马上', active: false },
      { id: 7, name: '7 天', active: false },
      { id: 15, name: '15天', active: false },
      { id: 32, name: '一个月后', active: false }
    ],

    peopleTagList: [
      { id: 1, name: '1 人', active: false },
      { id: 2, name: '2 人', active: false },
      { id: 3, name: '3 人', active: false },
      { id: 4, name: '3人以上', active: false }
    ],

  }

  refApartmentList = (node) => this.apartmentList = node

  async componentWillMount() {

    const {
      searchScrollTop,
    } = this.state

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
    this.props.dispatchCityList().then((res) => {
      const citys = res.data.data.list
      // 设置城市选择器
      const selector = citys.map(i => i.title)
      const selectorCity = citys.filter(i => i.id === user.citycode)[0]
      const selectorChecked = selectorCity ? selectorCity.title : '厦门市'

      this.setState({ selector, selectorChecked })
    })
  }
  //分享收藏小程序
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  }

  componentDidShow() {
    //判断是否弹出需求卡
    this.props.dispatchGetUserMsg().then((res)=>{
      if(res.data.data.user.is_guide===0){
        this.setState({ showCard: true })
     }})

  }

  /**
   * 选择城市
   */
  async onSelectCity(citycode) {

    const {
      selectScrollTop,
    } = this.state

    const overloadData = []
    const overloadDist = []

    // 当城市 id 不存在的时候不读取数据
    if (citycode === 0 || !citycode) return;


    // 城市
    await this.props.dispatchUserCity(citycode) && overloadData.push(1)
    // 轮播图
    await this.props.dispatchBannerList(citycode) && overloadData.push(1)
    // 商圈
    await this.props.dispatchCbdList(citycode) && overloadData.push(1)
    // 广告
    await this.props.dispatchAdList(citycode) && overloadData.push(1)
    // 品牌公寓
    await this.props.dispatchRecommendList(citycode) && overloadData.push(1)
    // 活动专区
    await this.props.dispatchActivityList(citycode) && overloadData.push(1)
    // 字典
    await this.props.dispatchDistList(citycode) && overloadDist.push(1)


    // 当数据全部加载完成后读取筛选框的位置
    overloadData.length === 6 && !selectScrollTop && Taro.createSelectorQuery()
      .in(this.$scope)
      .select('.home-select')
      .boundingClientRect()
      .exec(res => this.setState({ selectScrollTop: res[0].top, }))


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

    this.setState({ selectorChecked })
    this.onSelectCity(newCity.id)
  }

  /**
   * 利用坐标来确定什么时候 fixed 搜索栏和选择栏
   * @param {*} param0
   */
  onPageScroll({ scrollTop }) {
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
    scrollTop > scrollNow && this.setState({ showSearch: false })
    scrollTop < scrollNow && this.setState({ showSearch: true })
    if (scrollTop === 0) { this.setState({ showSearch: true }) }


    scrollTop > scrollNow && scrollTop > selectScrollTop && this.setState({ showSelect: false })
    scrollTop < scrollNow && scrollTop > selectScrollTop && this.setState({ showSelect: true })

    scrollTop > searchScrollTop
      && !searchIsFixed
      && this.setState({ searchIsFixed: true })

    scrollTop < searchScrollTop
      && searchIsFixed
      && this.setState({ searchIsFixed: false })

    // 公寓相关


    scrollTop > selectScrollTop
      && !selectIsFixed
      && this.setState({ selectIsFixed: true })


    scrollTop < selectScrollTop
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
  onApartmentPayloadChange({ payload }) {
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
  /**
   * 关闭需求卡1，打开需求卡2
   * @param {*} citycode
   */
  onNextCard() {
    this.setState({ showCard: false, showNextCard: true, })
  }
  /**
   * 需求卡2，打开价格选择
   */
  onShowPrice() {
    this.setState({ showPrice: true })
  }
  /**
   * 需求卡2，关闭价格选择
   */
  onClosePrice() {
    this.setState({
      showPrice: false
    })
  }
  /**
  * 需求卡2，打开户型选择
  */
  onShowHouse() {
    this.setState({ showHouse: true, })
  }
  /**
  * 需求卡2，关闭户型选择
  */
  onCloseHouse() {

    this.setState({ showNextCard: true, showHouse: false })
  }
  /**
* 需求卡2，打开位置选择
*/
  onShowCbd() {
    this.setState({ showCbd: true, })
  }
  /**
  * 需求卡2，关闭位置选择
  */
  onCloseCbd() {
    this.setState({ showNextCard: true, showCbd: false })
  }
  /**
  * 关闭需求卡2
  * @param {*} citycode
  */
  onCloseCardNext() {
    this.props.dispatchRequirementCheck()
    this.setState({ showNextCard: false, })
  }
  /**
   * 入住时间单选
   */
  onHandleTimeSolidClick(data) {
    const { timeTagList } = this.state
    const { payload } = this.state
    const timeTagListLength = timeTagList.length
    for (var nowTimeClick = 0; nowTimeClick < timeTagListLength; nowTimeClick++) {
      if (timeTagList[nowTimeClick].name == data.name) {
        timeTagList[nowTimeClick].active = true
        this.setState({  payload: { ...payload, living_time: data.id } })
      } else {
        timeTagList[nowTimeClick].active = false
      }
    }
    this.setState({ timeTagList })
  }
  /**
   * 入住人数单选
   */
  onHandlePeopleSolidClick(data) {
    const { peopleTagList } = this.state
    const { payload } = this.state
    const peopleTagListLength = peopleTagList.length
    for (var nowPeopleClick = 0; nowPeopleClick < peopleTagListLength; nowPeopleClick++) {
      if (peopleTagList[nowPeopleClick].name == data.name) {
        peopleTagList[nowPeopleClick].active = true
        this.setState({  payload: { ...payload, people: data.id } })
      } else {
        peopleTagList[nowPeopleClick].active = false
      }
    }
    this.setState({ peopleTagList })
  }
  //改变租房预算
  handleClickPrice(value) {
    const { id, title } = this.props.dists.price_list[value]
    this.setState({ currentPrice: value, budget: id, budgetDetailStore: title, })
  }
  //改变户型

  onhandleClickRoom(value) {
    const { roomList } = this.state
    const { id, title } = roomList[value]
    this.setState({ currentHouse: value, type_room: id, roomDetail: title })
  }

  onhandleClickFloor(value) {
    const { floorList } = this.state
    const { id, title } = floorList[value]
    this.setState({ currentHouse: value, type_floor: id, floorDetail: title })
  }

  //改变位置 第一层
  handleClickCbd(value) {
    this.setState({ currentCbd: value, currentCbdTwo: -1, placeSelected: [], })
  }
  //改变位置 第二层
  onChangeCbdTwo(value) {
    const { currentCbd } = this.state
    const { list } = this.props.dists.cbd_list[currentCbd]//第二层数据
    this.setState({ cdbDetailList: [] })
    if (list[value].list.length === 0) {
      this.setState({ currentCbdTwo: value, cbdList: list[value].title, place: list[value].id, cbdListItem: [], placeSelected: [] })
    } else {
      this.setState({ currentCbdTwo: value, cbdListItem: list[value].list, place: '', placeSelected: [] })
    }
  }
  //改变位置 第三层
  onChangeCbdThree(value) {
    let { placeSelected, cdbDetailList } = this.state

    cdbDetailList = cdbDetailList.includes(value.title)
      ? cdbDetailList.filter(i => i != value.title)
      : [...cdbDetailList, value.title],

      placeSelected = placeSelected.includes(value.id)
        ? placeSelected.filter(i => i != value.id)
        : [...placeSelected, value.id],

      this.setState({ cdbDetailList, placeSelected })
  }
  //确定价格
  onComfirePrice() {
    const { payload, budget, budgetDetailStore } = this.state

    this.setState({
      showNextCard: true,
      showPrice: false,
      budgetDetail: budgetDetailStore,
      payload: { ...payload, budget: budget }
    })
    if(budgetDetailStore===''){
      this.setState({
        budgetDetail:'无'
      })
    }
  }
  //确定户型
  onComfireHouse() {
    const { payload, type_floor, type_room } = this.state
    this.setState({
      showNextCard: true,
      showHouse: false,
      payload: { ...payload, type_floor: type_floor, type_room: type_room }
    })
  }
  //确定目标区域
  onComfireCbd() {
    const { placeSelected, payload, cdbDetailList, cbdList, place, cbdListItem } = this.state

    if (cbdListItem.length !== 0 && placeSelected.length === 0) {
      Taro.showToast({
        title: '请选择',
        icon: 'none',
        duration: 2000
      })
    } else if (placeSelected.length !== 0) {
      const cbd = placeSelected.join(',')
      const showCdbDetailDetail = cdbDetailList.join(',')
      this.setState({
        cdbDetailDetail: showCdbDetailDetail,
        showNextCard: true,
        showCbd: false,
        payload: { ...payload, cbd: cbd }
      })
    } else if (cbdListItem.length === 0) {
      this.setState({
        cdbDetailDetail: cbdList,
        showNextCard: true,
        showCbd: false,
        payload: { ...payload, cbd: place }
      })
    }

  }
  //重置价格
  onResetClickP() {
    const { payload } = this.state
    this.setState({
      budget: '', currentPrice: -1, budgetDetail: '无', budgetDetailStore : "" , payload: { ...payload, budget: "" }
    })
  }
  //重置可选区域
  onResetClickC() {
    const { payload } = this.state
    this.setState({ currentCbd: -1, currentCbdTwo: -1, cdbDetailDetail: '无', cbdListItem: [], cdbDetailList: [], placeSelected: [],  payload: { ...payload, cbd: "" } })
  }

  onCheckPayload() {
    const { payload } = this.state

    const { budget,cbd,living_time,people,type_floor,type_room } = payload
    if (people === ''
      || living_time === ''
      || budget === ''
      || cbd === ''
      || type_floor===''
      || type_room==='') {
      Taro.showToast({
        title: '请检查数据是否正确',
        icon: 'none',
        duration: 2000
      })
      return false
    } else {
      return true
    }
  }
  /**
   * 填写完毕，提交需求
   */
  onFinishCard() {
    const { payload } = this.state
    this.onCheckPayload() && this.props.dispatchRequirementCreate(payload).
      then(res => {
        if (res.data.code === 1) {
          this.setState({ isOpenedFinish: true, showNextCard: false })
        }
      })
  }
  onCloseCurtion() {
    this.props.dispatchRequirementCheck()
    this.setState({ isOpenedFinish: false })
  }
  render() {

    const rootClassName = ['select']
    const classObject = {}
    const className = {}

    const {
      showCard, showNextCard, isOpen, showPrice, showHouse, currentPrice, budgetDetail, currentHouse, houseTypeDetail, roomDetail, floorDetail,
      showCbd, currentCbd, currentCbdTwo, cbdListItem, placeSelected, cdbDetailDetail, showSelect, showSearch,
      searchIsFixed,
      searchScrollTop,
      selector,
      selectorChecked,
      selectIsFixed
    } = this.state

    const {
      ads, user, cbds, dists,
      citys, banners, recommends,
      activities, apartments
    } = this.props

    return (
      <View className='page-white' style={{ overflow: "hidden" }} >
        <View>
          {/* 搜索框 & 城市选择器 */}
          <View className='home-search pl-3 pr-3'>
            {
              showSearch && <Search
                className='mb-2'
                isFixed={searchIsFixed}
                selector={selector}
                selectorChecked={selectorChecked}
                onChangeSelector={this.onChangeSelector}
              />
            }
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
                className='mb-3'
                title={LOCALE_HOT_CBD}
              />
              <Carousel
                type='normal'
                imageHeight='176'
                imageWidth='312'
                carousel={cbds}
                hasContent={false}
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
            />
          }

          {/* 推荐品牌公寓 */}
          {recommends.length > 0 &&
            <View>
              <Header
                className='my-3'
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
                className='my-3'
                title={LOCALE_ACTIVITY}
                hasExtra={false}
              />
              <Carousel
                type='normal'
                imageHeight='240'
                imageWidth='414'
                carousel={activities}
                hasContent={false}
              />
            </View>
          }

          {/* 严选公寓 */}
          <View>
            <Header className='my-2' title={LOCALE_APARTMENT} hasExtra={false} />
            <View className='home-select'>
              {/* 选择框下拉框部分*/}
              {
                !(JSON.stringify(dists) === '{}') && showSelect && <Select
                  top={searchScrollTop}
                  isFixed={selectIsFixed}
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
              <ApartmentList
                home
                key={apartments.type}
                type={apartments.type}
                items={apartments.list}
                ref={this.refApartmentList}
                defaultPayload={PAYLOAD_APARTMENT_LIST}
                onCreateFavorite={this.onCreateFavorite}
                onDeleteFavorite={this.onDeleteFavorite}
                dispatchList={this.props.dispatchApartmentList}
                dispatchNextPageList={this.props.dispatchNextPageApartmentList}
              />
            </View>
          </View>

          {/* 城市模态框 */}
          <CityModal
            city={citys}
            citycode={user.citycode}
            onSelectCity={this.onSelectCity}
          />
        </View>
        {/**需求卡1 */}
        <View>
          <RequirementCardMask
            show={showCard}
            onNext={this.onNextCard}
            onClose={this.onCloseCard}
          />
        </View>
        {/**需求卡2 */}
        <View>
          <RequirementCardMaskNext
            show={showNextCard}
            isOpen={isOpen}
            budgetDetail={budgetDetail}
            houseTypeDetail={houseTypeDetail}
            cdbDetailDetail={cdbDetailDetail}
            roomDetail={roomDetail}
            floorDetail={floorDetail}
            timeTagList={this.timeTagList}
            peopleTagList={this.peopleTagList}
            onCloseNext={this.onCloseCardNext}
            onFinish={this.onFinishCard}
            onTimeSelect={this.onHandleTimeSolidClick}
            onPeopleSelect={this.onHandlePeopleSolidClick}
            onShowPrice={this.onShowPrice}
            onShowHouse={this.onShowHouse}
            onShowCbd={this.onShowCbd}
          />
        </View>
        {/* 需求卡2 价格 */}
        <View className={classNames(rootClassName, classObject, className)}>
          <RequirementPriceMask
            show={showPrice}
            priceDist={dists.price_list}
            onClose={this.onClosePrice}
            onChangePrice={this.handleClickPrice}
            current={currentPrice}
            onComfirePrice={this.onComfirePrice}
            onResetClick={this.onResetClickP}
          />
        </View>
        {/* 需求卡2 户型 */}
        <View className={classNames(rootClassName, classObject, className)}>
          {
            !(JSON.stringify(dists) === '{}') && <RequirementHouseMask
              show={showHouse}
              houseDist={dists.housetype_list}
              onClose={this.onCloseHouse}
              onhandleClickRoom={this.onhandleClickRoom}
              onhandleClickFloor={this.onhandleClickFloor}
              current={currentHouse}
              onComfireHouse={this.onComfireHouse}
            />
          }

        </View>
        {/* 需求卡2 位置 */}
        <View className={classNames(rootClassName, classObject, className)}>
          <RequirementCbdMask
            show={showCbd}
            cbdDist={dists.cbd_list}
            onClose={this.onCloseCbd}
            onChangeCbd={this.handleClickCbd}
            current={currentCbd}
            onComfireHouse={this.onComfireCbd}
            onResetClick={this.onResetClickC}
            currentCbdTwo={currentCbdTwo}
            onChangeCbdTwo={this.onChangeCbdTwo}
            cbdListItem={cbdListItem}
            onChangeCbdThree={this.onChangeCbdThree}
            placeSelected={placeSelected}
            onComfireCbd={this.onComfireCbd}
            onResetClickC={this.onResetClickC}
          />
        </View>
        {/* 提交需求卡 幕帘 */}

        <AtCurtain
          isOpened={this.state.isOpenedFinish}
          onClose={this.onCloseCurtion.bind(this)}
        >
          <View className='at-row at-row__justify--center'>
            <Image
              style='width:50vw;height:58vw'
              src='https://images.gongyuabc.com//image/requirement-finish.png'
            />
          </View>
        </AtCurtain>

      </View>
    )
  }
}

export default CommonHome
