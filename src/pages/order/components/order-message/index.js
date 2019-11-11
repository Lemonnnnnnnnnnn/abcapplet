import Taro, { Component } from '@tarojs/taro';
import { View, Text, Input, Image } from '@tarojs/components';
import { AtButton, AtTag, AtIcon, AtDivider } from 'taro-ui'
// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'
// 自定义常量
import {
  LOCALE_SCHEDULED_MESSAGE,
  LOCALE_SIGN_USER,
  LOCALE_MONTH,
  LOCALE_SEMICOLON,
  LOCALE_RENT,
  LOCALE_PRICE_UNIT,
  LOCALE_SIGN_APARTMENT,
  LOCALE_PRICE_SEMICOLON,
  LOCALE_CHANGE,
  LOCALE_ROOM_CHOISE,
  LOCALE_COUPON,
  LOCALE_NAME,
  LOCALE_TEL,
  LOCALE_IDCARD,
  LOCALE_RENT_DATE,
  LOCALE_ORDER_RISK,
  LOCALE_CHOISE,
  LOCALE_INPUT_NAME,
  LOCALE_INPUT_TEL,
  LOCALE_INPUT_IDCARD,
  LOCALE_DOWN_PAYMENT_REAL,
  LOCALE_DOWN_PAYMENT_RATIO,
} from '@constants/locale'
import { PAYLOAD_ORDER_CREATE } from '@constants/api'
import { ORDER_LEASE_INSURANCE } from '@constants/picture'
import { CREATE_ORDER_DIST } from '@constants/dist'

export default class OrderMessage extends BaseComponent {

  static defaultProps = {
    room: {
      id: 0,
      apartment_title: "",
      no: '',
      price: '',
      risk_money: '',
      discount_price: '',
      old_discount_price: 0,
      coupon_price: 0
    },
    payload: PAYLOAD_ORDER_CREATE
  }

  render() {
    const { rooms, timeList, couponPrice, couponTotal, cost_deposit, room, payload } = this.props
    const { no: roomNo, price, apartment_title: apartmentTitle, risk_money, coupon_money, old_discount_price, discount_price, coupon_price } = room
    const { name, mobile, id_code: idCode, room_id } = payload

    // 生成供渲染的价格列表，计算减去优惠券后的租金，如果没有租金减免不渲染这一条
    let [priceList, renderPriceCutOff, rentPrice, deposit] = [[], false, 0, 0]

    for (let i in coupon_money) {
      priceList.push({ ...CREATE_ORDER_DIST[i], num: coupon_money[i] })
    }

    priceList.forEach(i => {
      i.type === 1 ? renderPriceCutOff = true : renderPriceCutOff = false
    })
    // 直接在渲染里用old_discount_price || discount_price 会读取old_discount_price的前一个值？？
    rentPrice = old_discount_price || discount_price
    deposit = coupon_price || price

    return (
      <View>
        <View className='mb-2'>
          <Text className='text-bold text-huge'>{LOCALE_SCHEDULED_MESSAGE}</Text>
        </View>

        {/* 预订公寓 */}
        <Board className='px-3 py-2 mb-3'>
          {/* 内容头部 */}
          <View className='pb-2 border-bottom at-row at-row__justify--between'>
            <View>
              <View className='at-row at-row__align--center'>
                <View className='border-decorate border-decorate-yellow' style={{ height: Taro.pxTransform(36) }}></View>
                <View className='ml-2 text-normal text-secondary'>{LOCALE_SIGN_APARTMENT}</View>
              </View>
            </View>

            {
              room_id && <View onClick={this.props.onShowRoomList} className='at-col at-col-3' style={{ height: '100%' }}>
                <View className='at-row at-row__align--center at-row__justify--end'>
                  <View className='text-secondary text-small'>{LOCALE_CHANGE}</View>
                  <AtIcon value='chevron-right' size='14' color='#888888'></AtIcon>
                </View>
              </View>
            }


          </View>

          {/* 具体内容 */}

          {
            room_id
              ? <View className='at-row at-row__align--center at-row__justify--between'>
                <View>
                  <View className='at-row at-row__align--center'>
                    <View className='pt-3 ml-3 pb-1'>
                      <View className=' text-normal'>{apartmentTitle}{roomNo}</View>
                      {rooms.length !== 0 && <View className='text-normal  mt-1'>
                        {LOCALE_RENT}{LOCALE_SEMICOLON}
                        <Text className='text-normal'>{LOCALE_PRICE_SEMICOLON}</Text>
                        <Text className='text-huge'>{discount_price || old_discount_price}</Text>
                        {LOCALE_PRICE_UNIT}/{LOCALE_MONTH}
                      </View>}
                    </View>
                  </View>
                </View>
              </View>

              : <View className='order-room'>
                <View className='text-center text-large mt-2'>{LOCALE_ROOM_CHOISE}</View>
                <View className='mt-3 at-row at-row__justify--center mb-2' style={{ width: '100%' }}>
                  <AtButton
                    circle
                    className='btn-yellow active'
                    onClick={this.props.onShowRoomList}
                  >{LOCALE_CHOISE}</AtButton>
                </View>
              </View>
          }

        </Board>

        {/* 租期*/}
        <Board className='px-3 py-2  mb-3'>
          {/* 内容头部 */}
          <View className='py-1'>
            <View className='at-row at-row__justify--between at-row at-row__align--center'>
              <View >
                <View className='at-row'>
                  <View className='border-decorate border-decorate-yellow' style={{ height: '18px' }}></View>
                  <View className='ml-2 text-normal text-secondary'>{LOCALE_RENT_DATE}</View>
                </View>
              </View>

              <View className='at-col-4 at-row'>
                {timeList.map((item, index) => (
                  <View className='at-row at-row__justify--around ml-2 ' key={index}>
                    <AtTag
                      type='primary'
                      size='small'
                      name={item.name}
                      active={item.active}
                      circle
                      onClick={this.props.onTimeChange.bind(this, item.id)}
                    >{item.name}</AtTag>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Board>

        {/* 预订人 */}
        <Board className='px-3 py-2 mb-3'>
          {/* 内容头部 */}
          <View className='pb-2 border-bottom'>
            <View className='at-row at-row at-row__align--center'>
              <View className='border-decorate border-decorate-yellow' style={{ height: '18px' }}></View>
              <View className='ml-2 text-normal text-secondary'>{LOCALE_SIGN_USER}</View>
            </View>
          </View>

          {/* 具体内容 */}
          <View>
            <View className='at-row at-row__align--center pt-2'>
              <View class='at-col-3 text-normal text-secondary'>
                {LOCALE_NAME}
              </View>
              <View class='at-col-9'>
                <Input className='pl-2 text-normal' value={name} placeholder={LOCALE_INPUT_NAME} onInput={this.props.onNameInput} />
              </View>
            </View>
            <View className='at-row at-row__align--center pt-2'>
              <View class='at-col-3 text-normal text-secondary'>
                {LOCALE_TEL}
              </View>
              <View class='at-col-9'>
                <Input className='pl-2 text-normal' value={mobile} placeholder={LOCALE_INPUT_TEL} onInput={this.props.onMobileInput} />
              </View>
            </View>
            <View className='at-row at-row__align--center pt-2'>
              <View class='at-col-3 text-normal text-secondary'>
                {LOCALE_IDCARD}
              </View>
              <View class='at-col-9'>
                <Input className='pl-2 text-normal' value={idCode} placeholder={LOCALE_INPUT_IDCARD} onInput={this.props.onIdCodeInput} />
              </View>
            </View>
          </View>
        </Board>

        {/* 优惠券 */}
        <Board className='px-3 py-2 mb-3'>
          <View className='py-1' onClick={this.props.onShowCouponList}>
            <View className='at-row at-row__justify--between at-row at-row__align--center'>
              <View>
                <View className='at-row'>
                  <View className='border-decorate border-decorate-yellow' style={{ height: '18px' }}></View>
                  <View className='ml-2 text-normal text-secondary'>{LOCALE_COUPON}</View>
                </View>
              </View>

              <View>

                <View className='text-small'>
                  <View className='at-row at-row__align--center'>
                    <View className='order-coupon-icon mr-2'>
                      <View>{couponPrice || couponTotal}</View>
                      <View className='order-coupon-icon-angle vertical-center' style={{ left: Taro.pxTransform(-10) }}></View>
                      <View className='order-coupon-icon-angle vertical-center' style={{ right: Taro.pxTransform(-10) }}></View>
                    </View>
                    <AtIcon value='chevron-right' size='14' color='#888888'></AtIcon>
                  </View>
                </View>

              </View>
            </View>
          </View>

        </Board>

        {/* 退租险 */}
        <Board className='px-3 py-2 mb-3 order-lease-insurance'>
          <View onClick={this.props.onNavigateToRisk} className='at-row at-row__justify--between at-row__align--center'>
            <Image src={ORDER_LEASE_INSURANCE} className='picture' ></Image>
            <View className='text-small'>{LOCALE_ORDER_RISK}</View>
            <View className='text-bold '>
              <View className='at-row at-row__align--end'>
                <View className='text-small mb-1'>{LOCALE_PRICE_SEMICOLON}</View>
                <View className='text-huge'>{room_id && risk_money}</View>
              </View>
            </View>
          </View>
        </Board>

        {/* 价格相关 */}
        {room_id && <View className='mx-2 '>
          {/* 租金 */}
          <View className='mb-2 text-normal text-secondary'>
            <View className='at-row at-row__align--start at-row__justify--between'>
              <View>租金：</View>
              <View>￥{rentPrice}</View>
            </View>
            {/* 租金优惠明细 */}
            {
              priceList.map(i => i.type === 1 && <View className='at-row at-row__align--start at-row__justify--between' key={i.id}>
                <View>{i.Chinese}</View>
                <View>-￥{i.num}</View>
              </View>)
            }
            {/* 减去优惠金额后的租金 */}
            {
              renderPriceCutOff && <View className='at-row at-row__align--start at-row__justify--end text-black' >优惠后租金：{discount_price}</View>
            }
          </View>

          {/* 定金：减去优惠金额后的租金 除以2 */}
          <View className='text-normal text-secondary'>
            <View className='at-row at-row__align--start at-row__justify--between'>
              <View>定金(租金50%)：</View>
              <View>￥{deposit}</View>
            </View>
            {/* 定金减免 */}
            {
              priceList.map(i => i.type === 2 && <View className='at-row at-row__align--start at-row__justify--between' key={i.id}>
                <View>{i.Chinese}</View>
                <View>-￥{i.num}</View>
              </View>)
            }
          </View>

          {/* 分割线 */}
          <AtDivider height='25' />

          {/* 定金实付款 */}
          <View className='my-2'>
            <View className='at-row at-row__align--start at-row__justify--between '>
              <View>
                <View className='text-brand text-large text-bold'>{LOCALE_DOWN_PAYMENT_REAL}</View>
                {!cost_deposit && <View className='text-normal text-secondary mt-1'>{LOCALE_DOWN_PAYMENT_RATIO}</View>}
              </View>
              <View className='text-brand text-super text-bold' >{LOCALE_PRICE_SEMICOLON}{room_id ? price : 0}</View>
            </View>
          </View>

        </View>}


      </View>
    );
  }
}
