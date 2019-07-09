// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

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

// 自定义常量
import {
  PAYLOAD_APARTMENT_LIST,//公寓列表
  PAYLOAD_CREATE_DEMAND ,//{ budget:'',cbd:0,living_time:'',people:'',house_type:0 }
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
})
class CommonHome extends Component {
  config = {
    navigationBarTitleText: '公寓ABC',
  }

  state = {
    payload:PAYLOAD_CREATE_DEMAND,
    showCard: false,//改为true就可以显示需求卡1
    showNextCard:false,
    showPrice:false,//需求卡2价格显示
    isOpen:false,
    // 搜索相关
    searchScrollTop: null,
    searchIsFixed: false,

    // 选择器相关
    selectIsFixed: false,
    selectScrollTop: null,

    // 城市相关
    selector: ['厦门市'],
    selectorChecked: '厦门市',

    timeTagList: [
      { name: '马上', active: false },
      { name: '7 天', active: false },
      { name: '15天', active: false },
      { name: '一个月后', active: false }
    ],

    peopleTagList:[
      { name: '1 人', active: false },
      { name: '2 人', active: false },
      { name: '3 人', active: false },
      { name: '3人以上', active: false }
    ],


  }

  refApartmentList = (node) => this.apartmentList = node

  componentWillMount() {
    console.log('打印props')
    console.log(this.props)
    console.log('打印props')
    // 如果是分享页面进来的进行跳转
    const { page, id } = this.$router.params

    page && id && Taro.navigateTo({ url: `${page}?id=${id}` })

    // 获取用户数据 和 刷新页面数据
    const { payload: user } = this.props.dispatchUser()
    this.onSelectCity(user.citycode)

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



  /**
   * 选择城市
   */
  onSelectCity(citycode) {
    // 当城市 id 不存在的时候不读取数据
    if (citycode === 0 || !citycode) return;

    this.props.dispatchUserCity(citycode)
    this.props.dispatchAdList(citycode)
    this.props.dispatchCbdList(citycode)
    this.props.dispatchDistList(citycode)
    this.props.dispatchBannerList(citycode)
    this.props.dispatchActivityList(citycode)
    this.props.dispatchRecommendList(citycode)
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
    } = this.state

    // 搜索相关
    !searchScrollTop
      && Taro.createSelectorQuery()
        .in(this.$scope)
        .select('.home-search')
        .boundingClientRect()
        .exec(res => res[0].height > 0 && this.setState({ searchScrollTop: res[0].height }))

    scrollTop > searchScrollTop
      && !searchIsFixed
      && this.setState({ searchIsFixed: true })

    scrollTop < searchScrollTop
      && searchIsFixed
      && this.setState({ searchIsFixed: false })

    // 公寓相关
    !selectScrollTop
      && Taro.createSelectorQuery()
        .in(this.$scope)
        .select('.home-select')
        .boundingClientRect()
        .exec(res => this.setState({ selectScrollTop: res[0].top, }))

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
    const { showCard} = this.state
    this.setState({ showCard: false })
  }
  /**
   * 关闭需求卡1，打开需求卡2
   * @param {*} citycode
   */
  onNextCard(){
    console.log('进入2')
    const { showCard , showNextCard} = this.state
    this.setState({
      showCard: false ,
      showNextCard:true,
    })
  }
  /**
   * 需求卡2，打开价格选择
   */
  onShowPrice(){
    console.log('打开价格选择')
    const { showNextCard , showPrice} = this.state
    this.setState({
      showNextCard:false,
      showPrice:true
    })
  }
  /**
   * 需求卡2，关闭价格选择
   */
  onClosePrice(){
    console.log('关闭价格选择')
    this.setState({
      showNextCard:true,
      showPrice:false
    })
  }
   /**
   * 关闭需求卡2
   * @param {*} citycode
   */
  onCloseCardNext(){
    console.log('关闭2')

    this.setState({
      showNextCard:false,
    })
  }

  /**
   * 入住时间单选
   */
  onHandleTimeSolidClick ( data ) {
      const { timeTagList } = this.state
      const { payload } = this.state
      const timeTagListLength = timeTagList.length
      for(var nowTimeClick =0; nowTimeClick < timeTagListLength; nowTimeClick++){
        if(timeTagList[nowTimeClick].name == data.name){
          timeTagList[nowTimeClick].active = true
          this.setState({ payload: { ...payload, living_time:data.name} })
        }else{
          timeTagList[nowTimeClick].active = false
        }
      }
      this.setState({ timeTagList })
    }
  /**
   * 入住人数单选
   */
  onHandlePeopleSolidClick ( data ) {
    console.log(data)
    const { peopleTagList } = this.state
    const { payload } = this.state
    const peopleTagListLength = peopleTagList.length
    for(var nowPeopleClick =0; nowPeopleClick < peopleTagListLength; nowPeopleClick++){
      if(peopleTagList[nowPeopleClick].name == data.name){
        peopleTagList[nowPeopleClick].active = true
        this.setState({ payload: { ...payload, people:data.name} })
      }else{
        peopleTagList[nowPeopleClick].active = false
      }
    }
    this.setState({ peopleTagList })
  }

  /**
   * 填写完毕，提交需求
   */
  onFinishCard(){
    console.log(this.state.payload)
  }

  render() {
    const {
      selectIsFixed,
      searchIsFixed,
      searchScrollTop,
      selector,
      selectorChecked,
    } = this.state

    const {
      ads, user, cbds, dists,
      citys, banners, recommends,
      activities, apartments
    } = this.props


    return (
      <View className='page-white p-2'>
        <View>
          {/* 搜索框 & 城市选择器 */}
          <View className='home-search'>
            <Search
              className='mb-2'
              isFixed={searchIsFixed}
              selector={selector}
              selectorChecked={selectorChecked}
              onChangeSelector={this.onChangeSelector}
            />
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
            <View>
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
              <Select
                top={searchScrollTop}
                isFixed={selectIsFixed}
                autoSortDist={[]}
                cbdDist={dists.cbd_list}
                priceDist={dists.price_list}
                houseTypeDist={dists.housetype_list}
                specialSelectDist={dists.special_select}
                onApartmentPayloadChange={this.onApartmentPayloadChange}
              />
            </View>

            <View className='home-apartment'>
              <ApartmentList
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
            timeTagList={this.timeTagList}
            peopleTagList={this.peopleTagList}
            onCloseNext={this.onCloseCardNext}
            onFinish={this.onFinishCard}
            onTimeSelect={this.onHandleTimeSolidClick}
            onPeopleSelect={this.onHandlePeopleSolidClick}
            onShowPrice={this.onShowPrice}
          />
        </View>
        {/* 需求卡2 价格 */}
        <View>
          <RequirementPriceMask
            show={showPrice}
            priceDist={dists.price_list}
            onClose={this.onClosePrice}
          />
        </View>
      </View>
    )
  }
}

export default CommonHome
