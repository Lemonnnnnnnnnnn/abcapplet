
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';

// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'

// 自定义常量
import { LOCALE_MONEY, LOCALE_QI, LOCALE_ORIGINAL_PRICE, LOCALE_COLON } from '@constants/locale'
import { PAGE_BARGAIN_DETAIL } from '@constants/page'

export default class ApartmentBargainItem extends BaseComponent {
  static defaultProps = {
    imageHeight: 500,
    imageWidth: 750,
    item: {
      apartment_title: '',
      cbd: [],
      cover: '',
      id: 0,
      original_price: '',
      participate_num: '',
      price: '',
      apartment_type_title: '',
      no: '',
      type: '',
      type_id: 0
    }
  }

  onNavigation(target) {
    const { id, bargain_id, block } = target
    block === 'userActivity' && Taro.navigateTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + bargain_id })
    block === 'bargainList' && Taro.navigateTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id })
  }

  render() {
    const { item, block } = this.props
    const { apartment_title, cbd, cover, original_price, participate_num, price, apartment_type_title, no, bargain_id, id } = item
    return (
      <View className='pb-3' style={{ overflow: 'hidden' }} onClick={this.onNavigation.bind(this, { id, bargain_id, block })}>
        <Board shadow='black-shadow'>
          <View className='at-row p-2' style={{ width: 'auto' }}>
            {/* 左 image */}
            <View className='position-relative at-col at-col-5' >
              {/* 水平垂直居中 */}
              <View className='vertical-level-center '>
                <View className='bargain-list-image' >
                  <Image lazyLoad className='inherit-Width inherit-Height' mode='scaleToFill' src={cover}></Image>
                  <View className='bargain-list-image-mask text-center text-small'>{participate_num}</View>
                </View>
              </View>
            </View>

            {/* 右 message */}
            <View className='at-col at-col-7 '>
              <View className='text-large'>{apartment_title}</View>
              <View className='text-normal text-secondary'>
                {apartment_type_title && <Text >{apartment_type_title}</Text>}
                {no && <Text>{'-' + no}</Text>}
              </View>

              <View className='at-row at-row__align--center mt-1'>
                {cbd.map(i =>
                  <View key={i} className='at-col at-col-1 at-col--auto mr-2 tag--grey--1 bargain-tag text-small '>{i.title}</View>
                )}
              </View>
              <View className='at-row at-row__justify--between at-row__align--center mt-1'>
                <View className='text-orange'>
                  <Text className='text-huge text-bold'>{LOCALE_MONEY}{parseInt(price)}</Text>
                  <Text className='text-normal'>{LOCALE_QI}</Text>
                </View>
                <View className='text-secondary text-small ml-2 mt-1'>
                  {LOCALE_ORIGINAL_PRICE + LOCALE_COLON}
                  <Text className='text-line-through'>{LOCALE_MONEY + parseInt(original_price) + LOCALE_QI}</Text>
                </View>
              </View>

            </View>

          </View>
        </Board>
      </View>
    );
  }
}
