// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs ,AtButton} from 'taro-ui'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'//遮盖层
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { LOCALE_RESET,LOCALE_CONFIRM ,LOCALE_ROOM_BUDGE} from '@constants/locale'

class RequirementPriceMask extends BaseComponent {
  static defaultProps = {
    show: true,
    apartments: [],
    headerIndex:'price',
    priceDist: [],

  }

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  render() {
    let { show } = this.props
    const { priceDist } = this.props
    return show && <View className='apartment-mask' onTouchMove={this.onMaskTouchMove}>
      {/* 主体内容 */}
      <Board fixed='bottom' border='top'>
        <View className='m-3'>
          {/* 头部 */}
          <View className='at-row at-row__justify--between mb-3'>
            <View className='text-bold'>{LOCALE_ROOM_BUDGE}</View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>
           {/* 主体 */}

           <View className='at-row at-row__justify--center'>
            <AtTabs
              scroll
              tabDirection='vertical'
              tabList={priceDist}
              onClick={this.props.onChangePrice}
              current={this.props.current}
            />
        </View>
          {/* 按钮 */}
          <View>
          <View className='select-button my-2 at-row at-row__justify--between'>
            <View className='at-col at-col-4'>
              <AtButton
                circle
                onClick={this.props.onResetClick}
                className='ml-2 btn-yellow'
              >
                {LOCALE_RESET}
              </AtButton>
            </View>
            <View className='at-col at-col-8'>
              <AtButton
                circle
                onClick={this.props.onComfirePrice}
                className='mx-2 btn-yellow active'
              >
                {LOCALE_CONFIRM}
              </AtButton>
            </View>
          </View>
          </View>
        </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} style='position:relative;z-index:1' />
    </View>
  }
}

export default RequirementPriceMask
