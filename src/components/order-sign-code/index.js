import Taro from '@tarojs/taro'
import { AtModal, AtModalContent } from 'taro-ui'
import { View, Image } from '@tarojs/components'

import BaseComponent from '@components/base'

import {
  LOCALE_SIGNED_CODE,
  LOCALE_SIGNED_CODE_NOTICE,
} from '@constants/locale'

class OrderSignCode extends BaseComponent {
  static defaultProps = {
    show: true,
    code: '',
  }

  render() {
    const { show, code } = this.props

    return (
      <AtModal isOpened={show}>
        <AtModalContent >
          <View className='p-2 text-center'>
            <View className='text-bold text-huge mb-2'>{LOCALE_SIGNED_CODE}</View>
            <Image className='mb-2' src={code} style={{ width: '200px', height: '200px' }} />
            <View className='text-normal'>{LOCALE_SIGNED_CODE_NOTICE}</View>
          </View>
        </AtModalContent>
      </AtModal>
    )
  }
}

export default OrderSignCode
