// Taro 相关
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Image,Text } from '@tarojs/components'

// NPM 包
import classNames from 'classnames'

// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'


// 自定变量
import {
  LOCALE_CALLBACK,
  LOCALE_CAN_APPLY,
  LOCALE_SEMICOLON,
} from '@constants/locale'



class SunletItem extends BaseComponent {
  static defaultProps = {

  }


  render() {
    const { item } = this.props


    return (
      <View className='at-row at-row__justify--center py-2'  style='width:100%' >
        {item && <View className='at-row page-sublet' onClick={this.props.onNavicatSublet.bind(this,item)}>
          <View className='at-col-5'>
            <Image src={item.url} className='page-sublet-image' mode='aspectFill'></Image>
          </View>

          <View className='at-col at-col-6 m-2' style='position:relative'>
            <View className='text-normal text-bold  at-col--wrap'>
              <Text >
                {item.title}
              </Text>

            </View>
            <View className='at-row at-row__justify--between' style='position:absolute;bottom:2% '>
              <View className='at-col-4 page-middile text-small page-house'>{item.dict_house_type}</View>
              <View className='at-col-6 at-row'>
                <View className='text-yellow'>￥</View>
                <View className='text-yellow'>{parseInt(item.price)}</View>
                <View className='text-yellow text-small mt-2 ml-1'>/月</View>
              </View>
            </View>
          </View>




        </View>}
      </View>
    )
  }
}

export default SunletItem
