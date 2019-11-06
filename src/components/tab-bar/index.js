// Taro 相关
import Taro from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'
// 自定义方法
import textWrap from '@utils/text-wrap'

import { PAGE_HOUSE_TYPE_SHOW, PAGE_APARTMENT_SHOW } from '@constants/page'
import {
  LOCALE_SHARE_TEXT,
  LOCALE_CONSUMER_HOTLINE,
  LOCALE_ONLINE_SERVICE,
  LOCALE_TELEPHONE_CUSTOMER_SERVICE
} from '@constants/locale'
import { CALL, SHARE } from '@constants/picture'
// NPM 包
import classNames from 'classnames'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

@connect(state => state, {
  ...apartmentActions,
})

class TabBar extends BaseComponent {

  static defaultProps = {
    show: true,
    buttons: [],
    hasShare: true,
    hasContact: false,
    height: 90 * 2,
    width: 80 * 2,
    left: 10 * 2,
    bottom: 68 * 2,
    floatLayoutHeightNum: 80 * 2,
  }

  state = {
    showCallPhoneView: false,
    url: '',
  }

  onOpenCallPhoneView() {

    Taro.makePhoneCall({
      phoneNumber: LOCALE_CONSUMER_HOTLINE
    });
  }


  onCloseCallPhoneView() {
    this.setState({ showCallPhoneView: false })
  }

  onCallPhone() {
    Taro.makePhoneCall({ phoneNumber: LOCALE_CONSUMER_HOTLINE })
  }

  onShareAppMessage() {
    const { cityId } = this.state
    this.props.dispatchApartmentHouseDataPost({ type: 2, city_id: cityId })
    const text = LOCALE_SHARE_TEXT
    return {
      title: textWrap(text, 17)
    }
  }


  render() {
    const { className, buttons, hasShare, show, hasContact, height, width, left, bottom, onOpenLittleMask,
      showLittleMask, title, Id, type } = this.props


    const littleMaskHeight = Taro.pxTransform(height)
    const littleMaskWidth = Taro.pxTransform(width)
    const littleMaskLeft = Taro.pxTransform(left)
    const littleMaskBottom = Taro.pxTransform(bottom)
    const fontHeight = Taro.pxTransform(height / 2)



    const littleMaskStyle = {
      position: "fixed",
      left: Taro.pxTransform(littleMaskLeft),
      bottom: Taro.pxTransform(littleMaskBottom),
      width: Taro.pxTransform(littleMaskWidth),
      height: Taro.pxTransform(littleMaskHeight),
      backgroundColor: "#fff",
      border: "1px solid rgb(200,200,200)",
      borderRadius: "6px",
      zIndex: 999,
    }

    const fontStyle = {
      height: Taro.pxTransform(fontHeight),
    }

    const grayLineStyle = {
      borderTop: "1px solid rgb(200,200,200)"
    }



    const buttonStyle = {
      border: "1px solid #fff",
      color: "#888",
      padding: 0,
    }


    return (
      show && <View className={classNames(className)}>

        {/* 电话客服/在线客服 */}
        {
          showLittleMask && <View className='text-secondary text-normal ' style={littleMaskStyle} >
            <View className='at-row at-row__align--center at-row__justify--center' onClick={this.onOpenCallPhoneView} style={fontStyle}>{LOCALE_TELEPHONE_CUSTOMER_SERVICE}</View>
            {/* 分割线 */}
            <View style={grayLineStyle}></View>

            <View className='at-row at-row__align--center at-row__justify--center' >
              <Button
                className='Customer-button'
                send-message-path={type === 'house' ? `${PAGE_HOUSE_TYPE_SHOW}?id=${Id}` : `${PAGE_APARTMENT_SHOW}?id=${Id}`}
                open-type='contact' size='mini' plain style={buttonStyle} show-message-card bindcontact='handleContact' send-message-title={title}
              >
                <View className='text-normal at-row at-row__align--center at-row__justify--center' style={fontStyle}>{LOCALE_ONLINE_SERVICE}</View>
              </Button>
            </View>
          </View>
        }


        <View className='tab-bar at-row at-row__align--center p-2'>


          {hasContact && <View className='at-col-2'>
            <View onClick={onOpenLittleMask} className='tab-bar__item--icon at-row at-row__justify--center at-row__align--center'>
              <Image style='width:7vw;height:7vw' src={CALL}></Image>
            </View>

          </View>}
          {hasShare && <View className='at-col-2'>
            <AtButton open-type='share' className='tab-bar__item--icon at-row at-row__justify--center at-row__align--center'>
              <Image style='width:7vw;height:7vw' src={SHARE}></Image>
            </AtButton>
          </View>}

          {buttons.map((i, index) =>
            <View key={i.id} className={classNames(i.className || 'at-col', buttons.length - 1 !== index && 'pr-2')}>
              <AtButton
                circle
                className='btn-yellow active'
                onClick={this.props.onClick.bind(this, i.method)}
              >
                {i.message}
              </AtButton>
            </View>)}
        </View>
      </View>

    )
  }
}

export default TabBar
