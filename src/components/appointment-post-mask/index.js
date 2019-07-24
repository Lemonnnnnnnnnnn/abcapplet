// Taro 相关
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtButton} from 'taro-ui'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'


// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

class AppointPostMask extends BaseComponent {
  static defaultProps = {
    show: false,
    apartments: [],
  }

  render() {
    let { show } = this.props

    return show && <View className='apartment-mask'>
      {/* 主体内容 */}
      <Board fixed='bottom' border='top'>
        <View className='m-3'>
          {/* 头部 */}
          <View className='at-row at-row__justify--between mb-3'>
            <View className='text-bold'></View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>
          <View className='at-row'>
            <View className='at-col-3 text-normal at-row at-row__align--center '>姓名：</View>
            <View className='at-col-8 p-1 at-row ' style='background:#F8F8F8; border-radius: 30px'>
              <Input className='text-normal ml-2'   placeholder='修改姓名' onChange={this.props.onGetName} ></Input>
            </View>
          </View>
          <View className='at-row mt-3'>
            <View className='at-col-3 text-normal at-row at-row__align--center '>电话号码：</View>
            <View className='at-col-8 p-1 at-row ' style='background:#F8F8F8; border-radius: 30px'>
              <Input className='text-normal ml-2 '  placeholder='修改电话号码' onChange={this.props.onGetTel} ></Input>
            </View>
          </View>
          <AtButton
            circle
            className='mt-3 mb-2 btn-yellow active'
            onClick={this.props.onCenter}
            >确定</AtButton>
        </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} />
    </View>
  }
}

export default AppointPostMask
