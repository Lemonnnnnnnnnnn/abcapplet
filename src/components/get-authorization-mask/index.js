// Taro 相关
import Taro from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import BaseComponent from '@components/base'


// 自定义常量
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'

@connect(state => state.user, actions)
class GetAuthorizationMask extends BaseComponent {
  static defaultProps = {
    show: false,
    apartments: [],
  }

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  render() {
    let { show, type, customText } = this.props

    return show && <View className='apartment-mask ' onTouchMove={this.onMaskTouchMove}>
      {/* 主体内容 */}

      <Board fixed='top' border='top' style='position:absolute;z-index:300 '>
        <View className='page-msg p-4' style='width:80vw;border-radius: 4vw;' >

          {type === 'getPhoneNumber' &&
            <View>
              <View className='text-large mt-3  page-middile'>{customText ? customText : '是否自动填充此微信绑定的手机号码？'}</View>
              <View className='mt-3'>
                <AtButton circle className='btn-yellow mt-4 active pl-2 pr-2 page-middile' openType='getPhoneNumber' onGetPhoneNumber={this.props.onGetPhoneNumber}>获取手机号码</AtButton>
                <AtButton circle className='btn-grey mt-2  active pl-2 pr-2 page-middile text-muted' onClick={this.props.onClose}>取消</AtButton>
              </View>
            </View>}

          {type === 'writePhotosAlbum' && <View>
            <View className='text-large mt-3  page-middile' >{customText ? customText : '是否重新打开保存图片权限？'}</View>
            <View className='mt-3'>
              <AtButton circle className='btn-yellow mt-4 active pl-2 pr-2 page-middile' openType='openSetting' onOpenSetting={this.props.onClose}>打开权限</AtButton>
              <AtButton circle className='btn-grey mt-2  active pl-2 pr-2 page-middile text-muted' onClick={this.props.onClose}>取消</AtButton>
            </View>
          </View>
          }
          {type === 'getAddress' && <View>
            <View className='text-large mt-3  page-middile' >{customText ? customText :'是否展示您附近的公寓？'}</View>
            <View className='mt-3'>
              <AtButton circle className='btn-yellow mt-4 active pl-2 pr-2 page-middile' openType='openSetting' onOpenSetting={this.props.onClose}>获取您的地理位置</AtButton>
              <AtButton circle className='btn-grey mt-2  active pl-2 pr-2 page-middile text-muted' onClick={this.props.onClose}>取消</AtButton>
            </View>
          </View>
          }
        </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} />
    </View>
  }
}

export default GetAuthorizationMask
