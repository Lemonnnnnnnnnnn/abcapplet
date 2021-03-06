import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'

import { View } from '@tarojs/components'
import BaseComponent from '@components/base'
import { LOCALE_CONFIRM, LOCALE_RESET } from '@constants/locale'

/**
 * Select 中的按钮部分
 * ----------------------------
 **参数
 * ----------------------------
 */
class SelectButton extends BaseComponent {
  static defaultProps = {
    index: '',
    items: [],
    show: false,
    onConfirmClick: () => { },
    onResetClick: () => { },
  }

  render() {
    const { onResetClick, onConfirmClick, show } = this.props

    return (show && <View className='select-button my-2 at-row at-row__justify--between mb-3'>
      <View className='at-col at-col-4'>
        <AtButton
          circle
          onClick={onResetClick}
          className='ml-2 btn-yellow'
        >
          {LOCALE_RESET}
        </AtButton>
      </View>
      <View className='at-col at-col-8'>
        <AtButton
          circle
          onClick={onConfirmClick}
          className='mx-2 btn-yellow active'
        >
          {LOCALE_CONFIRM}
        </AtButton>
      </View>
    </View>)
  }
}

export default SelectButton
