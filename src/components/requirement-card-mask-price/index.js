// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'//遮盖层
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'
import SelectButton from '@components/select/button'
import SelectPrice from '@components/select/price'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

class RequirementPriceMask extends BaseComponent {
  static defaultProps = {
    show: false,
    apartments: [],
    headerIndex:'price',
    priceDist: [],
  }

  render() {
    console.log("121111111111")
    console.log(this.props)
    let { show } = this.props
    const { priceDist } = this.props
    return show && <View className='apartment-mask'>
      {/* 主体内容 */}
      <Board fixed='bottom' border='top'>
        <View className='m-3'>
          {/* 头部 */}
          <View className='at-row at-row__justify--between mb-3'>
            <View className='text-bold'>租房预算</View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>
           {/* 主体 */}
           <View>
            <SelectPrice
              //  ref={this.refSelectPrice}//用于重置数据
                items={priceDist}
                show = {this.props.show}
                onChange={this.onPayloadChange}
            />
          </View>
          {/* 按钮 */}
          <View>
            <SelectButton
                show = {this.props.show}
            />
          </View>

        </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} />
    </View>
  }
}

export default RequirementPriceMask
