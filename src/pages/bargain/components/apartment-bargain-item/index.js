
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';

// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'

// 自定义常量
import { LOCALE_PRICE_SEMICOLON, LOCALE_QI, LOCALE_PRICE_ORIGIN_BARGAIN } from '@constants/locale'

export default class ApartmentBargainItem extends BaseComponent {
  static defaultProps = {
    bargainItem: {
      cover: 'https://images.gongyuabc.com/7aadedd1090e6d68fcb20f6be03794f9',
      name: '安居公寓·县后店',
      houseType_room: '单身公寓-A380',
      tag: ['高新技术园', '县后'],
      discount_price: '1080',
      price: '1880',
      people_num: '99',
    },
    imageHeight: 500,
    imageWidth: 750,
  }

  render() {
    const { bargainItem, imageHeight, imageWidth } = this.props
    return (
      <View className='pb-3'>
        <Board>
          <View className='at-row p-2'>
            {/* 左 image */}
            <View className='' style={{ position: 'relative' }}>
              <View className='bargain-image-wrap '>
                <Image className='bargain-image' mode='widthFix' src={`${bargainItem.cover}?imageView2/1/w/${imageWidth}/h/${imageHeight}`}></Image>
                <View className='bargain-image-mask text-center text-small'>{bargainItem.people_num}人参与</View>
              </View>
            </View>
            {/* 右 message */}
            <View className='ml-1'>
              <View className='text-large'>{bargainItem.name}</View>
              <View className='text-normal text-secondary'>{bargainItem.houseType_room}</View>
              <View className='at-row at-row__align--center mt-2'>
                {
                  bargainItem.tag.map(i =>
                    <View key={i} className='at-col at-col-1 at-col--auto  mr-2 tag--grey--1 bargain-tag text-small'>{i}</View>
                  )
                }
              </View>
              <View className='at-row at-row__justify--between at-row__align--center mt-2'>
                <View className='text-orange'>
                  <Text className='text-huge text-bold'>{LOCALE_PRICE_SEMICOLON}{bargainItem.price}</Text>
                  <Text className='text-normal'>{LOCALE_QI}</Text>
                </View>
                <View className='text-secondary text-small ml-2 mt-1'>
                  {LOCALE_PRICE_ORIGIN_BARGAIN}
                  <Text className='text-line-through'>{LOCALE_PRICE_SEMICOLON + bargainItem.discount_price + LOCALE_QI}</Text>
                </View>
              </View>

            </View>

          </View>
        </Board>
      </View>
    );
  }
}
