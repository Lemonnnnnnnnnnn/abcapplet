import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import {
  LOCALE_APARTMENT_APPOINTMENT_AD_TEXT1,
  LOCALE_APARTMENT_APPOINTMENT_AD_TEXT2,
} from '@constants/locale'
// 自定义组件
import BaseComponent from '@components/base'

export default class apartmentAppointmentHeader extends BaseComponent {
  render() {
    return (
      <View>
        <View className='ad-font-wrap position-absolute' >
          <View className='ad-white-line'></View>
          <View className='ad-image-font text-white text-bold'>{LOCALE_APARTMENT_APPOINTMENT_AD_TEXT1}</View>
          <View className='ad-image-font text-white text-bold'>{LOCALE_APARTMENT_APPOINTMENT_AD_TEXT2}</View>
        </View>

        <View className='ad-image inherit-Width' >
          <Image lazyLoad className='inherit-Width' src={this.props.swipers}></Image>
          <View className='ad-mask inherit-Width position-absolute' >
          </View>
        </View>

      </View>
    );
  }
}
