// Taro 相关
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtButton,AtModalContent } from 'taro-ui'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'


// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

class customerMask extends BaseComponent {
  static defaultProps = {
    show: false,
    apartments: [],
  }

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }
 //电话客服
 onCallPhone() {

  Taro.makePhoneCall({ phoneNumber: '0592-5911297' })
}

  render() {
    let { show } = this.props

    return show && <View className='apartment-mask'>
      {/* 主体内容 */}
      <Board fixed='top' border='top'>

        <View className='page-msg' style='width:80vw;border-radius: 5vw;' >
          <View className='m-3'>
            {/* 头部 */}
            <View className='at-row at-row__justify--between mb-3'>
              <View className='page-middile at-col-10 ml-4'>客服服务</View>
              <View onClick={this.props.onClose}>
                <ABCIcon icon='close' color={COLOR_GREY_2} />
              </View>
            </View>

            <View className='city-modal-action mb-2'>

                <View >
                  <AtButton  onClick={this.onCallPhone}>
                    <View className='city-modal-item text-center p-2 text-secondary'>
                      电话客服
                    </View>
                  </AtButton>
                  <View className='at-row at-row__align--center at-row__justify--center'>
                    <View style={{width: '60%',borderBottom: '1px solid #E5E5E5'}}></View>
                  </View>
                </View>

                <AtButton  open-type='contact'  >
                    <View className='city-modal-item text-center p-2 text-secondary'>
                      在线客服
                    </View>
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

export default customerMask
