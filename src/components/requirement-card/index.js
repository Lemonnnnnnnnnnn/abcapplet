import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtCurtain } from 'taro-ui'
import RequirementCardMask from '@components/requirement-card-mask'
import RequirementCardMaskNext from '@components/requirement-card-mask-next'
import RequirementPriceMask from '@components/requirement-card-mask-price'
import RequirementHouseMask from '@components/requirement-card-mask-house'
import RequirementCbdMask from '@components/requirement-card-mask-cbd'
import classNames from 'classnames'

// Redux 相关
import * as userActions from '@actions/user'
import { connect } from '@tarojs/redux'

// 自定义常量
import {
  PAYLOAD_CREATE_DEMAND,
} from '@constants/api'

@connect(state => state, {
  ...userActions,
})
export default class requirementCard extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    payload: PAYLOAD_CREATE_DEMAND,
    // showCard: false,//显示需求卡1
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

  /**
   * 关闭需求卡1，打开需求卡2
   * @param {*} citycode
   */
  onNextCard() {
    this.props.onCloseCard()
    this.setState({ showNextCard: true, })
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
 * 填写完毕，提交需求
 */

  onCheckPayload() {
    const { payload } = this.state

    const { budget, cbd, living_time, people, type_floor, type_room } = payload
    if (people === ''
      || living_time === ''
      || budget === ''
      || cbd === ''
      || type_floor === ''
      || type_room === '') {
      Taro.showToast({
        title: '亲，请检查您填写的内容是否正确',
        icon: 'none',
        duration: 2000
      })
      return false
    } else {
      return true
    }
  }

  onFinishCard() {
    const { payload } = this.state
    this.onCheckPayload() && this.props.dispatchRequirementCreate(payload).
      then(res => {
        if (res.data.code === 1) {
          this.setState({ showNextCard: false })
          Taro.showToast({
            title: '填写完成',
            icon: 'none',
          })
        }
      })
  }

  // onCloseCurtion() {
  //     this.props.dispatchRequirementCheck()
  //     this.setState({ isOpenedFinish: false })
  // }

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
        this.setState({ payload: { ...payload, living_time: data.id } })
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
        this.setState({ payload: { ...payload, people: data.id } })
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

  //重置价格
  onResetClickP() {
    const { payload } = this.state
    this.setState({
      budget: '', currentPrice: -1, budgetDetail: '无', budgetDetailStore: "", payload: { ...payload, budget: "" }
    })
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
    if (budgetDetailStore === '') {
      this.setState({
        budgetDetail: '无'
      })
    }
  }

  //改变户型

  onhandleClickRoom(value) {
    const { dists: { housetype_list: { room } } } = this.props
    const initialRoom = [{ id: 0, title: "不限" }]
    room.forEach(i => initialRoom.push(i))

    const { id, title } = initialRoom[value]
    this.setState({ currentHouse: value, type_room: id, roomDetail: title })
  }

  onhandleClickFloor(value) {
    const { dists: { housetype_list: { floor } } } = this.props
    const initialFloor = [{ id: 0, title: "不限" }]
    floor.forEach(i => initialFloor.push(i))

    const { id, title } = initialFloor[value]
    this.setState({ currentHouse: value, type_floor: id, floorDetail: title })
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

  //重置可选区域
  onResetClickC() {
    const { payload } = this.state
    this.setState({ currentCbd: -1, currentCbdTwo: -1, cdbDetailDetail: '无', cbdListItem: [], cdbDetailList: [], placeSelected: [], payload: { ...payload, cbd: "" } })
  }

  render() {
    const rootClassName = ['select']
    const classObject = {}
    const className = {}

    const {
      showNextCard, isOpen, showPrice, showHouse, currentPrice, currentHouse, roomDetail, floorDetail,
      showCbd, currentCbd, currentCbdTwo, cbdListItem, placeSelected, cdbDetailDetail, timeTagList, peopleTagList, budgetDetail
    } = this.state

    const { dists, show, onCloseCard } = this.props

    return (
      <View>
        {show && <RequirementCardMask
          show={show}
          onNext={this.onNextCard}
          onClose={onCloseCard}
        />}
        {/**需求卡2 */}
        <RequirementCardMaskNext
          show={showNextCard}
          isOpen={isOpen}
          budgetDetail={budgetDetail}
          cdbDetailDetail={cdbDetailDetail}
          roomDetail={roomDetail}
          floorDetail={floorDetail}
          timeTagList={timeTagList}
          peopleTagList={peopleTagList}
          onCloseNext={this.onCloseCardNext}
          onFinish={this.onFinishCard}

          onTimeSelect={this.onHandleTimeSolidClick}
          onPeopleSelect={this.onHandlePeopleSolidClick}

          onShowPrice={this.onShowPrice}
          onShowHouse={this.onShowHouse}
          onShowCbd={this.onShowCbd}
        />
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

        {/* <AtCurtain
                    isOpened={this.state.isOpenedFinish}
                    onClose={this.onCloseCurtion.bind(this)}
                >
                    <View style={{ marginLeft: '20%' }}>
                        <Image
                            style='width:50vw;height:58vw'
                            src='https://images.gongyuabc.com//image/requirement-finish.png'
                        />
                    </View>
                </AtCurtain> */}

      </View>
    );
  }
}
