// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'

// 自定义组件
import Decorate from '@components/decorate'
import ApartmentCouponItem from '@components/apartment-coupon-item'

import '../../styles/_page.scss'


class UserFavorite extends Component {
  config = {
    navigationBarTitleText: '我的优惠券',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FFC919',
  }
  state = {
    code: '',
    navList: [
      { id: 1, title: '可使用', active: true , status : 1 },
      { id: 2, title: '已使用', active: false ,status : 2},
      { id: 3, title: '已过期', active: false ,status : 4},
    ],
  }

  onInputValue(e) {
    this.setState({ code: e.detail.value })
  }
  onChangeBlock(value) {
    const { navList } = this.state
    let navListClone = JSON.parse(JSON.stringify(navList))
    navListClone.map(i => {
      if (i.id === value) { i.active = true } else { i.active = false }
    })
    this.setState({ navList: navListClone })
  }


  render() {
    const { code, navList } = this.state
    const AnalogArr = [
      { voucher: '￥100', orderAmount: '￥1500', validityPeriod: '2019/09/09-2019/12/12', status: 1 },
      { voucher: '￥100', orderAmount: '￥1500', validityPeriod: '2019/09/09-2019/12/12', status: 1 },
      { voucher: '￥100', orderAmount: '￥1500', validityPeriod: '2019/09/09-2019/12/12', status: 2 },
      { voucher: '￥100', orderAmount: '￥1500', validityPeriod: '2019/09/09-2019/12/12', status: 4 },
    ]
    return (
      <View >
        {/* 背景底色 */}
        <Decorate height='300' />

        <View className='user-coupon'>
          {/* 输入券码领取新券 */}
          <View className='pt-3 at-row at-row__justify--around at-row__align--center' >
            <View className='at-col at-col-8 at-col__align--center search-box'>
              <View className='at-row at-row__align--center' style={{ height: '100%' }}>
                <Input className='text-normal  user-coupon-input' placeholder='输入券码领取新券' value={code} onInput={this.onInputValue}></Input>
              </View>
            </View>
            <View className='at-col at-col-3' >
              <AtButton className='btn-yellow active' circle>领取</AtButton>
            </View>
          </View>

          {/* 券库（三种状态） */}
          <View className='mt-4'>
            {/* 导航栏 */}
            <View className='at-row at-row__justify--around'>
              {navList.map(i => <View onClick={this.onChangeBlock.bind(this, i.id)} className={i.active ? 'text-large text-bold user-coupon-nav-active' : 'text-normal text-secondary'} key={i}>{i.title}</View>)}
            </View>
            {/* 内容 */}
            <View>
              {
                navList.map(i => i.active && <View>
                  {AnalogArr.map(j =>j.status ===i.status &&
                    <ApartmentCouponItem
                      key={j.voucher}
                      voucher={j.voucher}
                      orderAmount={j.orderAmount}
                      validityPeriod={j.validityPeriod}
                      status={j.status}
                    />
                  )
                  }
                </View>)
              }
            </View>
          </View>

        </View>
      </View>
    )
  }
}

export default UserFavorite
