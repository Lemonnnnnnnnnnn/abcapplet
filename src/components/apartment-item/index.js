// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon, AtTag } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'
import ImagePlaceholder from '@components/image-placeholder'

// NPM 包
import classNames from 'classnames'

// 自定义常量
import {
  TYPE_CBD_APARTMENT,
  TYPE_SEARCH_APARTMENT,
  TYPE_NORMAL_APARTMENT,
  TYPE_ACTIVITY_APARTMENT,
  TYPE_FAVORITE_APARTMENT,
  TYPE_FAVORITE_HOUSE_TYPE,
  ACTIVITY_TYPE_DIST
} from '@constants/apartment'

import {
  COLOR_YELLOW,
} from '@constants/styles'

import {
  LOCALE_MONEY,
  LOCALE_QI,
} from '@constants/locale'



class ApartmentItem extends BaseComponent {
  static defaultProps = {
    type: '',
    width: 573,
    height: 346,
    minWidth: 330,
    minHeight: 222,
    mini: false,
    apartment: { cover: '' },
    className: '',
  }

  onCreateFavorite(e) {
    e.stopPropagation()
    const payload = this.getFavoritePayload()

    this.props.onCreateFavorite({ payload })
  }

  onDeleteFavorite(e) {
    e.stopPropagation()
    const payload = this.getFavoritePayload()
    this.props.onDeleteFavorite({ payload })
  }

  getFavoritePayload() {
    const { type, apartment } = this.props
    const { id } = apartment

    switch (type) {
      case TYPE_CBD_APARTMENT:
      case TYPE_SEARCH_APARTMENT:
      case TYPE_ACTIVITY_APARTMENT:
      case TYPE_FAVORITE_HOUSE_TYPE:
      case TYPE_NORMAL_APARTMENT: return { type_id: id }
      case TYPE_FAVORITE_APARTMENT: return { id: id }
    }
  }

  onNavigation() {
    const { apartment } = this.props
    const { url } = apartment
    Taro.navigateTo({ url })
  }

  render() {
    let { width, height, minWidth, minHeight, mini } = this.props
    const { className, apartment, type, } = this.props
    const { is_sign } = apartment

    // 重置宽高
    width = mini ? minWidth : width
    height = mini ? minHeight : height

    const {
      cbd, desc,
      is_collect,
      cover, rules, title,
      price_title: priceTitle,
      apartment_title: apartmentTitle,
      num
    } = apartment


    const imageStyle = {
      width: '100%',
      height: '100%',
    }

    const headerStyle = {
      width: '100%',
      height: Taro.pxTransform(height),
    }

    const heartWrap = {
      padding: '10px',
    }

    const heartNum = {
      top: 0,
      position: 'absolute',
      textAlign: 'center',
      fontSize: "15px",
      left: '50%',
      top: '40%',
      transform: 'translate(-50%,-50%)',
      color: '#FFC919'
    }

    const fontSize = mini ? "10px" : "15px"
    const padding = mini ? "4px 12px" : "6px 16px"

    const apartmentHeaderType = {
      position: "absolute",
      left: "6%",
      bottom: "0",
      transform: "translateY(50%)",
      color: "#fff",
      padding: padding,
      fontSize: fontSize,
      borderRadius: "12px",
      background: "#ffc919",
    }


    // 格式化价格
    const isNaNPrice = Number.isNaN(parseInt(priceTitle))

    // 设置图片宽高，方便七牛云格式化图片
    const src = `${cover.split('?')[0]}?imageView2/1/w/${width}/h/${height}`

    // 是否已收藏
    // 当 type 为 favorite-house-type、favorite-apartment 时显示，isCollect为ture时显示
    const isCollect = type === TYPE_FAVORITE_APARTMENT
      || type === TYPE_FAVORITE_HOUSE_TYPE
      || is_collect

    return (
      <View className='apartment  mb-5 ' onClick={this.onNavigation}>
        {/* 户型头部 */}
        <View className='apartment-header' style={headerStyle}>

          {/* 户型封面，如果没有地址则使用 Image Placeholder 来占位 */}
          {cover
            ? <Image src={src} mode='scaleToFill' style={imageStyle} />
            : <ImagePlaceholder height={height} />
          }

          {/* 户型 cbd 列表 */}
          <View className='apartment-header-title'>
            {cbd && cbd.map(i => i.title).toString().replace(',', ' / ')}
          </View>

          {/* 户型种类，公寓类型是没有这个字段的 */}
          {apartmentTitle && <View style={apartmentHeaderType} className=' text-large '>{apartmentTitle}</View>}

          {/* 爱心按钮*/}
          {!mini && (isCollect
            ?
            <View className='apartment-header-favorite' onClick={this.onDeleteFavorite}>
              <View style={heartWrap}>
                {/* <AtIcon value='heart-2' size='40'  color={COLOR_YELLOW} /> */}
                <Image src='https://images.gongyuabc.com//image/heart-yellow.png' style={{ width: "40px", height: "35px" }}></Image>
              </View>
              <View style={heartNum}>{num}</View>

            </View>
            :
            <View className='apartment-header-favorite' onClick={this.onCreateFavorite}>
              <View style={heartWrap}>
                {/* <AtIcon value='heart-2' size='40' /> */}
                <Image src='https://images.gongyuabc.com//image/heart-black.png' style={{ width: "40px", height: "35px" }}></Image>
              </View>
              <View style={heartNum}>{num}</View>

            </View>)
          }
        </View>

        {/* 正常内容 */}
        {!mini && <View className='apartment-content mx-3 py-3'>
          {/* <View>{rules.map(i =>
            <AtTag className='mr-1 p-1 text-mini' key={i.id} size='small' circle>{i.title}</AtTag>
          )}
          </View> */}


          {/* 公寓名称 */}
          <View className=''>
            <View >
              <View className='at-row at-row__justify--between at-row__align--center'>
                <View className='text-large mt-2 at-col-1 at-col--auto'>{title}</View>
                {
                  is_sign && <View className='mt-2'>
                    <Image src='https://images.gongyuabc.com//image/signing.png' style={{ width: "18px", height: "18px" }}></Image>
                  </View>
                }
              </View>
              {desc && <View className='text-muted text-large mt-2 apartment-content-desc'>{desc}</View>}

            </View>
          </View>

          {/* 优惠活动 */}

          <View className='at-row at-row__align--center'>
            <View className='at-row'>
              {rules.map(i =>
                <View key={i.id} className='at-col-1 at-col--auto mt-2 mr-2 '>
                  <Text className={`badge badge-${i.type} text-small`}> #{ACTIVITY_TYPE_DIST[i.type]['message']}#</Text>
                </View>
              )}
            </View>

            {/* 价格 */}

            <View className='text-yellow mt-2'>
              <Text className='text-bold' style={{ fontSize: "24px" }}>
                {isNaNPrice ? priceTitle : `${LOCALE_MONEY}${parseFloat(priceTitle)}`}
              </Text>
              <Text className='text-large'>{LOCALE_QI}</Text>
            </View>

          </View>
        </View>
        }

        {/* 迷你内容 */}
        {mini && <View className='apartment-content mx-2 py-2'>
          {/* 价格和公寓名称 */}
          <View className='my-2 text-large'>{apartmentTitle}</View>
          <View className='text-yellow text-huge text-bold'>{isNaNPrice ? priceTitle : `${LOCALE_MONEY}${parseFloat(priceTitle)}${LOCALE_QI}`}</View>
        </View>
        }
      </View>
    )
  }
}

export default ApartmentItem
