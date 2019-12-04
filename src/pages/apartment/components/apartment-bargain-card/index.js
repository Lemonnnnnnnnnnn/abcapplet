import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtCountdown, AtButton, AtIcon } from 'taro-ui'

// redux相关
import { connect } from '@tarojs/redux'
import * as bargainActions from '@actions/bargain'
import * as userActions from '@actions/user'

// 自定义方法
import { timestampChange } from '@utils/time-judge'

// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'
import GetAuthorizationMask from '@components/get-authorization-mask'

// 自定义常量
import { PAGE_BARGAIN_DETAIL, PAGE_BARGAIN_LIST, PAGE_USER_AUTH } from '@constants/page'

// import '../../../../styles/_apartment.scss'

@connect(state => state, {
  ...bargainActions,
  ...userActions
})
export default class ApartmentBargainCard extends BaseComponent {
  static defaultProps = {
    bargainCardList: []
  }

  state = {
    days: 99,
    hours: 23,
    minutes: 59,
    seconds: 59,
    bargainList: [
      { id: 1, days: 99, hours: 23, minutes: 59, seconds: 59, price: '', activityBegain: true },
    ],
    AuthorizationMask: { show: false, type: 'getPhoneNumber', customText: '为方便您接收秒杀开启提醒通知，需同意授权手机号' },
  }
  componentWillMount() {
    let { bargainCardList } = this.props
    let bargainList = []

    for (let i = 0; i < bargainCardList.length; i++) {
      if (i > 1) break

      let [days, hours, minutes, seconds, activityBegain] = [99, 23, 59, 59, true]
      // 如果count_down大于0，活动未开始，转化count_down
      if (bargainCardList[i].count_down > 0) {
        ({ days, hours, minutes, seconds } = timestampChange(bargainCardList[i].count_down))

        activityBegain = false
      } else {
        // 如果count_down小于等于0，判断close_time,close_time大于0或等于-1,活动未结束，转化close_time
        if (bargainCardList[i].close_time > 0 || bargainCardList[i].close_time === -1) {
          // 如果close_time等于-1，不转换close_time,默认读取最大值
          if (bargainCardList[i].close_time > 0) {
            ({ days, hours, minutes, seconds } = timestampChange(bargainCardList[i].close_time))

          }
        }
      }

      bargainList.push({ ...bargainCardList[i], days, hours, minutes, seconds, activityBegain })
    }

    this.setState({ bargainList })
  }

  async componentDidMount() {
    const { code } = await Taro.login()
    Taro.setStorageSync('code', code)
  }

  // 由于父组件更新props不走componentWillMount,不改变这里的state,所以要再componentWillReceiveProps里重新处理数据
  componentWillReceiveProps(nextProps) {
    const { bargainCardList } = nextProps
    let bargainList = []

    for (let i = 0; i < bargainCardList.length; i++) {
      if (i > 1) break

      let [days, hours, minutes, seconds, activityBegain] = [99, 23, 59, 59, true]
      // 如果count_down大于0，活动未开始，转化count_down
      if (bargainCardList[i].count_down > 0) {
        ({ days, hours, minutes, seconds } = timestampChange(bargainCardList[i].count_down))

        activityBegain = false
      } else {
        // 如果count_down小于等于0，判断close_time,close_time大于0或等于-1,活动未结束，转化close_time
        if (bargainCardList[i].close_time > 0 || bargainCardList[i].close_time === -1) {
          // 如果close_time等于-1，不转换close_time,默认读取最大值
          if (bargainCardList[i].close_time > 0) {
            ({ days, hours, minutes, seconds } = timestampChange(bargainCardList[i].close_time))

          }
        }
      }

      bargainList.push({ ...bargainCardList[i], days, hours, minutes, seconds, activityBegain })
    }

    this.setState({ bargainList })
  }


  onTimeUp(id, count_down) {
    // 获取初始数组bargainCardLis用于处理 活动已开始=>结束 的状态
    const { bargainCardList } = this.props
    // 获取先前处理的数组bargainListt用于处理 活动未开始=>已开始 的状态
    const { bargainList } = this.state
    // 不改变原始数组，赋值给两个新值进行处理
    let newBargainCardList = bargainCardList
    let newBargainList = bargainList

    // 设置一个数组来放处理后的数组
    let finalbargainList = []

    // 如果count_down===0 ，说明当前砍价活动已开始，倒计时结束，从原数组中去掉结束的数组，重新拿取前两个砍价活动出来渲染
    if (!count_down) {
      const index = newBargainCardList.findIndex(i => i.id === id)
      newBargainCardList.splice(index, 1)

      for (let i = 0; i < newBargainCardList.length; i++) {
        if (i > 1) break

        let [days, hours, minutes, seconds, activityBegain] = [99, 23, 59, 59, true]
        if (newBargainCardList[i].close_time > 0 || newBargainCardList[i].close_time === -1) {
          // 如果close_time等于-1，不转换close_time,默认读取最大值
          if (newBargainCardList[i].close_time > 0) {
            ({ days, hours, minutes, seconds } = timestampChange(newBargainCardList[i].close_time))
          }
        }

        finalbargainList.push({ ...newBargainCardList[i], days, hours, minutes, seconds, activityBegain })
      }
    } else {
      // 如果count_down存在，说明砍价活动未开始，倒计时结束，将其activityBegain设为true，并读取close_time字段渲染
      let targetItem = newBargainList.find(i => i.id === id)
      targetItem.activityBegain = true
      targetItem.days = timestampChange(targetItem.close_time).days
      targetItem.hours = timestampChange(targetItem.close_time).hours
      targetItem.minutes = timestampChange(targetItem.close_time).minutes
      targetItem.seconds = timestampChange(targetItem.close_time).seconds

      finalbargainList = newBargainList
    }

    this.setState({ bargainList: finalbargainList })
  }

  // 马上砍
  onNavigation(id) {
    if (!Taro.getStorageSync('user_info').token) {
      Taro.navigateTo({ url: PAGE_USER_AUTH })
      return
    }

    Taro.navigateTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id })
  }

  // 预约砍价
  async onBargainAppointment(cardId) {
    // 缓存点击的卡片id，在获取完手机号，直接调用这个id进行请求预约砍价，减少一次用户点击
    this.setState({ cardId })

    if (!Taro.getStorageSync('user_info').token) {
      Taro.navigateTo({ url: PAGE_USER_AUTH })
      return
    }

    const { AuthorizationMask } = this.state
    // 判断用户是否已有手机号缓存,没有手机号缓存请求授权
    await this.props.dispatchGetUserMsg().then(res => {
      if (res) {
        const mobile = res.data.data.user.mobile
        if (mobile) {
          this.props.dispatchBargainAppointment({ bargain_id: cardId }).then(response => {
            if (response.data.code === 1) {
              setTimeout(() => Taro.showToast({ title: '已帮您预约，砍价活动开始我们将提醒您', icon: 'none' }), 700)

              this.props.onReSetBargainCard()
            }
          })
        } else {
          this.setState({
            AuthorizationMask: {
              ...AuthorizationMask,
              show: true,
            }
          })
        }

      }
    })
  }

  // 获取手机号授权
  async getPhoneNumber(e) {
    const { cardId } = this.state

    let code = Taro.getStorageSync('code')

    const { encryptedData: encrypt_data, iv } = e.currentTarget
    const urlCode = encodeURIComponent(code)
    const urlEncrypt_data = encodeURIComponent(encrypt_data)
    const urlIv = encodeURIComponent(iv)

    iv && encrypt_data && await this.props.dispatchUserPhone({ code: urlCode, encrypt_data: urlEncrypt_data, iv: urlIv }).then(() => {
      this.onClosePhoneMask()
      this.props.dispatchBargainAppointment({ bargain_id: cardId }).then(response => {
        if (response.data.code === 1) {
          setTimeout(() => Taro.showToast({ title: '已帮您预约，砍价活动开始我们将提醒您', icon: 'none' }), 700)

          this.props.onReSetBargainCard()
        }
      }).catch(err => console.log(err))
    })

  }
  // 关闭手机号授权弹窗
  onClosePhoneMask() {
    const { AuthorizationMask } = this.state
    this.setState({ AuthorizationMask: { ...AuthorizationMask, show: false } })
  }


  render() {
    const { bargainCardList } = this.props
    const { bargainList, AuthorizationMask } = this.state
    let bargainID = []
    bargainCardList.map(i => bargainID.push(i.id))

    return (
      <View>
        {/* 权限管理授权 */}
        <GetAuthorizationMask
          type={AuthorizationMask.type}
          customText={AuthorizationMask.customText}
          show={AuthorizationMask.show}

          onClose={this.onClosePhoneMask}
          onGetPhoneNumber={this.getPhoneNumber}
        />
        {
          bargainList.length && bargainList.map(i =>
            <Board key={i.id} className='mb-4 apartment-house-type-bargain-card' shadow='black-shadow'>
              {/* 内边距 */}
              <View className='p-3'>
                {/* 绝对定位 户型房间 和砍价时间 */}
                <View className='position-relative' style={{ minHeight: Taro.pxTransform(20) }}>
                  <View className='position-absolute at-row at-row__justify--around at-row__align--end float-unit' >
                    {i.type === 1 && <Text className='text-small tag tag--black'>本公寓</Text>}
                    {i.type === 2 && <Text className='text-small tag tag--black'>本户型</Text>}
                    {i.type === 3 && <Text className='text-small tag tag--black'>房号: {i.room_no}</Text>}
                    <View className='at-col at-col-8'>
                      <AtCountdown
                        isCard
                        isShowDay
                        isShowHour
                        format={{ day: '天', hours: '时', minutes: '分', seconds: i.activityBegain ? '秒结束' : '秒开始' }}
                        day={i.days}
                        hours={i.hours}
                        minutes={i.minutes}
                        seconds={i.seconds}
                        onTimeUp={this.onTimeUp.bind(this, i.id, i.count_down)}
                      />
                    </View>
                  </View>
                </View>
                {/* 下半部分 */}
                <View className='at-row at-row__justify--between at-row__align--end mt-2'>
                  {/* 价格 */}
                  <View className='at-row at-row__align--end text-orange'>
                    <Text className='text-mini text-bold'>￥ </Text>
                    <Text className='text-super text-bold huge-text' >{parseInt(i.price)}</Text>
                    <Text className='text-small'> /月（砍后价）</Text>
                  </View>

                  {/* 活动未开始：预约砍价/已预约砍价提醒（灰）  活动已开始：马上砍 */}
                  {
                    i.activityBegain
                      ? <AtButton
                        circle
                        className='btn-bargain text-normal'
                        onClick={this.onNavigation.bind(this, i.id)}
                      >马上砍</AtButton>

                      : <AtButton
                        circle
                        className={`${i.appointment_bargain ? 'btn-light-grey' : 'btn-bargain'} text-normal'`}
                        disabled={i.appointment_bargain ? true : false}
                        onClick={this.onBargainAppointment.bind(this, i.id)}
                      >{i.appointment_bargain ? '已预约砍价提醒' : '预约砍价'}</AtButton>
                  }
                </View>
              </View>
            </Board>)
        }

        {bargainCardList.length > 2 &&
          <View
            onClick={() => Taro.navigateTo({ url: PAGE_BARGAIN_LIST + '?id=' + bargainID })}
            className='mt-2 text-normal text-secondary at-row at-row__justify--center at-row__align--center'
          >
            展示更多<AtIcon value='chevron-right' color='#888888' size='16' />
          </View>}

      </View>
    );
  }
}
