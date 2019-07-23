// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'//遮盖层
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { AtButton } from 'taro-ui';
import { LOCALE_SELF_SEE, LOCALE_HELP_REMOEND } from '@constants/locale'

class RequirementCardMask extends BaseComponent {
  static defaultProps = {
    show: false,
    apartments: [],
  }

  render() {
    let { show } = this.props

    return show &&
      <View className='apartment-mask'>

        <Board fixed='top' border='top'>
          <View className='page-requirementtop'></View>
        </Board>

        {/* 主体内容 */}
        <Board fixed='bottom' border='all'>

          <View className='page-requirement' style='height:120vw;width: 100vw' >
            {/* 头部 */}
            <View className='at-row at-row__justify--between p-2 '>
              <View className='at-col at-col-9'></View>
              <View className='at-col at-col-3 ml-4 mt-1' onClick={this.props.onClose}>
                <ABCIcon icon='close' color={COLOR_GREY_2} />
              </View>
            </View>

            {/*
            {按钮部分}
            */}

            <View style='position: absolute;top:95vw; width:90vw' className='select-button  my-2 at-row at-row__justify--center ml-4'>
              <View className='at-col at-col-5'>
                <AtButton
                  circle
                  onClick={this.props.onClose}
                  className='btn-grey'>{LOCALE_SELF_SEE}
                </AtButton>
              </View>
              <View className='at-col at-col-5 ml-3'>
                <AtButton
                  circle
                  onClick={this.props.onNext}
                  className='mx-2 btn-yellow active'>{LOCALE_HELP_REMOEND}
                </AtButton>
              </View>
            </View>
          </View>


        </Board>

        {/* 遮罩层 */}
        <Masks show={show} />
      </View>
  }
}

export default RequirementCardMask
