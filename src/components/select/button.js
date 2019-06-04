import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'

import { View } from '@tarojs/components'
import BaseComponent from '@components/base'
import { MESSAGE_CONFIRM, MESSAGE_RESET } from '@constants/message'

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

    return (show && <View className='select-button my-2 at-row at-row__justify--between'>
      <View className='at-col at-col-4'>
        <AtButton
          circle
          onClick={onResetClick}
          className='ml-2 btn-yellow'
        >
          {MESSAGE_RESET}
        </AtButton>
      </View>
      <View className='at-col at-col-8'>
        <AtButton
          circle
          onClick={onConfirmClick}
          className='mx-2 btn-yellow active'
        >
          {MESSAGE_CONFIRM}
        </AtButton>
      </View>
    </View>)
  }
}

export default SelectButton
