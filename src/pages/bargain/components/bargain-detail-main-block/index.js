import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtCountdown, AtIcon, AtDivider } from 'taro-ui'

import {
  LOCALE_NONE,
  LOCALE_BARGAIN_OVER,
  LOCALE_BARGAIN_ROOM,
  LOCALE_COLON,
  LOCALE_ORIGINAL_PRICE,
  LOCALE_BARGAIN_AFTER,
  LOCALE_MONEY,
  LOCALE_QI,
  LOCALE_BARGAIN_IMMEDIATE_PROVINCE,
  LOCALE_ACTIVITY_REMAIN_TIME,
  LOCALE_ACTIVITY_START_TIME,
  LOCALE_DATE,
  LOCALE_HOUR,
  LOCALE_MINUTE,
  LOCALE_SECOND
} from '@constants/locale'

import { PAGE_HOUSE_TYPE_SHOW, PAGE_APARTMENT_SHOW } from '@constants/page'


import Board from '@components/board'
import BaseComponent from '@components/base'


export default class BargainDetailMainBlock extends BaseComponent {
  static defaultProps = {
    bargainDetail: {
      apartment_title: '', apartment_type_title: '', content: '', cover: '', headimg: '', original_price: '', participate_num: '', price: '',
      price_list: [], reward_id: 0, save_money: '', tenancy: 12, type: 0, type_id: 0, id: 0, end_time: '', begin_time: '', no: 0, day: 99,
      hours: 23, minutes: 59, seconds: 59, activityOver: true, count_down: 0
    }
  }

  onTimeUp() {
    Taro.showToast({ title: LOCALE_BARGAIN_OVER, icon: LOCALE_NONE })
  }

  onNavigation() {
    const { bargainDetail: { type_id, type } } = this.props
    switch (type) {
      case 1: { Taro.navigateTo({ url: PAGE_APARTMENT_SHOW + '?id=' + type_id }) } break
      case 2: { Taro.navigateTo({ url: PAGE_HOUSE_TYPE_SHOW + '?id=' + type_id }) } break
    }
  }

  render() {
    const { bargainDetail } = this.props
    const { apartment_title, apartment_type_title, cover, original_price, participate_num, price, picture,
      save_money, tenancy = 12, close_time, no, days, hours, minutes, seconds, activityOver, count_down } = bargainDetail

    let { headimg } = bargainDetail
    const headImgRender = headimg && headimg.slice(0, 5)
    const tenancyRender = '（租期' + tenancy + '个月）'

    return (
      <Board className=' ml-3 mr-3' customStyle={{ minHeight: Taro.pxTransform(273 * 2) }}>
        {/* 用padding让板块具有一定内边距 */}
        <View className='p-2'>
          {/* 板块内第一个板块  图片加公寓信息左右排列*/}
          <View className='at-row at-row__justify--between'>
            <View className='main-block-image' onClick={this.props.onOpenPicCurtain}>
              <Image lazyLoad className='inherit-Width inherit-Height' src={cover} ></Image>
              {picture.length && <View className='text-mini page-middile main-block-image-mask' > 查看照片</View>}
            </View>

            <View className='at-col at-col-7'>
              <View onClick={this.onNavigation} className='pt-2 text-large text-bold at-row at-row__align--center at-row__justify--between'>
                <Text >{apartment_title}</Text>
                <AtIcon value='chevron-right' size='17' color='rgba(53, 53, 53, 1)' />
              </View>

              <View className='text-normal pt-2'>
                {apartment_type_title && <Text className='text-secondary'>{LOCALE_BARGAIN_ROOM + LOCALE_COLON}</Text>}
                {apartment_type_title && <Text className='text-gray--2 ml-2'>{apartment_type_title}</Text>}
                {no && <Text className='ml-2'>{no}</Text>}
              </View>
            </View>
          </View>

          {/* 第二板块 价格*/}
          <View className='at-row text-center'>
            <View className='at-col main-block-price mr-3'>
              <View className='text-normal'>{LOCALE_ORIGINAL_PRICE + LOCALE_COLON}</View>
              <View className='text-line-through text-secondary'>{LOCALE_MONEY + parseInt(original_price || 0) + LOCALE_QI}</View>
            </View>
            <View className='at-col main-block-price'>
              <View className='text-normal'>{LOCALE_BARGAIN_AFTER + LOCALE_COLON}</View>
              <View className='text-orange text-bold'>{LOCALE_MONEY + parseInt(price || 0) + LOCALE_QI}</View>
            </View>
          </View>

          {/* 第三板块 吸引词 */}
          <View className='text-normal mt-3 text-orange text-center gray-border'>{LOCALE_BARGAIN_IMMEDIATE_PROVINCE + LOCALE_MONEY + save_money + tenancyRender}</View>

          <AtDivider height='20' lineColor='#E8E8E8' />

          {/* 第四板块 活动剩余时间 */}
          {!activityOver &&
            <View>
              <View className='text-normal text-center py-3'>{count_down ? LOCALE_ACTIVITY_START_TIME : LOCALE_ACTIVITY_REMAIN_TIME}</View>
              <View className='at-row at-row__justify--center'>
                <AtCountdown
                  isCard
                  isShowDay
                  isShowHour
                  format={{ day: LOCALE_DATE, hours: LOCALE_HOUR, minutes: LOCALE_MINUTE, seconds: LOCALE_SECOND }}
                  day={days}
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  onTimeUp={this.onTimeUp.bind(this)}
                />
              </View>
            </View>
          }

          {headImgRender.length && <View className='at-row at-row__justify--center pt-3'>
            {headImgRender.map(i => <Image className='mr-1 main-block-header' key={i} src={i} />)}
          </View>}
          <View className='pt-3 text-normal text-center text-secondary'>————共{participate_num}人参与————</View>

        </View>
      </Board>
    );
  }
}
