// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'


// 自定义组件
import BaseComponent from '@components/base'
import ImagePlaceholder from '@components/image-placeholder'

// 自定义常量
import {
  TYPE_CBD_APARTMENT,
  TYPE_SEARCH_APARTMENT,
  TYPE_NORMAL_APARTMENT,
  TYPE_ACTIVITY_APARTMENT,
  TYPE_FAVORITE_APARTMENT,
  TYPE_FAVORITE_HOUSE_TYPE,
  ACTIVITY_TYPE_DIST,
} from '@constants/apartment'

import { HEART_YELLOW, HEART_BLACK, SIGN } from '@constants/picture'

import {
  PAGE_APARTMENT_SHOW,
  PAGE_HOUSE_TYPE_SHOW
} from '@constants/page'

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
    minHeight: 200,
    mini: false,
    apartment: { cover: '' },
    className: '',
  }


  onCreateFavorite(e) {
    e.stopPropagation()
    const payload = this.getFavoritePayload()

    const user_info = Taro.getStorageSync('user_info')
    user_info.token &&
      this.props.onCreateFavorite({ payload })
  }

  onDeleteFavorite(e) {
    e.stopPropagation()
    const payload = this.getFavoritePayload()

    const user_info = Taro.getStorageSync('user_info')
    user_info.token &&
      this.props.onDeleteFavorite({ payload })
  }

  getFavoritePayload() {
    const { type, apartment } = this.props
    const { id } = apartment

    switch (type) {
      case TYPE_CBD_APARTMENT: return { type_id: id }
      case TYPE_SEARCH_APARTMENT: return { type_id: id }
      case TYPE_ACTIVITY_APARTMENT: return { type_id: id }
      case TYPE_FAVORITE_HOUSE_TYPE:
      case TYPE_NORMAL_APARTMENT: return { type_id: id }
      case TYPE_FAVORITE_APARTMENT: return { id: id }
    }
  }

  onNavigation() {
    const { apartment, type } = this.props
    if (type === TYPE_FAVORITE_APARTMENT) {
      Taro.navigateTo({ url: `${PAGE_APARTMENT_SHOW}?id=${apartment.id}` })
    } else {
      Taro.navigateTo({ url: `${PAGE_HOUSE_TYPE_SHOW}?id=${apartment.id}` })
    }

  }


  render() {
    let { width, height, minWidth, minHeight, mini, nearbyPost, imgHeight } = this.props
    const { apartment, type } = this.props

    // 重置宽高
    width = mini ? minWidth : width
    height = mini ? minHeight : height

    const {
      cbd, desc,
      is_collect,
      cover, rules, title,
      price_title: priceTitle,
      apartment_title: apartmentTitle,
      num, is_sign, sub_title, one_word, discount_price_title,
    } = apartment

    const fontSize = mini ? Taro.pxTransform(20) : Taro.pxTransform(30)
    const padding = mini ? "0 10px" : "2px 12px"

    const apartmentHeaderType = {
      padding: padding,
      fontSize: fontSize,
      left: '5%'
    }

    // 格式化价格
    const isNaNPrice = Number.isNaN(parseInt(priceTitle))

    // 设置图片宽高，方便七牛云格式化图片
    // const src = `${cover.split('?')[0]}?imageView2/1/w/${width}/h/${height}`
    const src = `${cover.split('?')[0]}?imageView2/1/w/${width}/h/${height}`

    //封面图高度
    const imgWrapHeight = imgHeight ? imgHeight : height

    // 是否已收藏
    // 当 type 为 favorite-house-type、favorite-apartment 时显示，isCollect为ture时显示
    const isCollect = type === TYPE_FAVORITE_APARTMENT
      || type === TYPE_FAVORITE_HOUSE_TYPE
      || is_collect

    let cbdTitle = ''
    if (cbd) {
      cbdTitle = cbd.map(i => i.title).toString().replace(',', ' / ')
    }

    if (mini) {
      if (cbdTitle.length > 8) {
        cbdTitle = cbdTitle.substring(0, 8) + "..."
      }
    }


    return (
      <View className='apartment-item-wrap' onClick={this.onNavigation}>
        {/* 户型头部 */}
        <View className='apartment-item-header'>

          <View className='wrap-Style inherit-Width' style={{ height: Taro.pxTransform(imgWrapHeight) }}>
            {/* 户型封面，如果没有地址则使用 Image Placeholder 来占位 */}
            {cover
              ? <Image src={src} style={{ borderRadius: Taro.pxTransform(12) }} mode='widthFix' className='vertical-level-center inherit-Width inherit-Height' />
              : <ImagePlaceholder height={height} />
            }
          </View>

          {/* 户型 cbd 列表 */}
          {
            cbd && <View className='apartment-item-header-title' >
              {cbdTitle}
            </View>
          }

          {/* 户型种类，公寓类型是没有这个字段的 */}
          {apartmentTitle && <View style={apartmentHeaderType} className=' text-large apartment-item-header-type'>{apartmentTitle}</View>}

          {/* 爱心按钮*/}
          {!mini && (isCollect
            ?
            <View className='apartment-item-header-favorite mr-2 mt-2' onClick={this.onDeleteFavorite}>
              <View className='apartment-item-heart-wrap' >
                <Image className='apartment-item-heart' src={HEART_YELLOW} ></Image>
              </View>
              <View className='apartment-item-heart-num text-small' >{num}</View>

            </View>
            :
            <View className='apartment-item-header-favorite mr-2 mt-2' onClick={this.onCreateFavorite}>
              <View className='apartment-item-heart-wrap' >
                <Image className='apartment-item-heart' src={HEART_BLACK} ></Image>
              </View>
              <View className='apartment-item-heart-num text-small' >{num}</View>

            </View>)
          }
        </View>

        {/* 正常内容 */}
        {!mini && <View className='apartment-item-content mx-3 py-2'>


          {/* 公寓名称 */}
          <View className='mt-1'>
            <View >
              <View className='at-row at-row__justify--between at-row__align--center'>
                <View className='text-large mt-2 at-col-1 at-col--auto' style={{ color: "rgba(53, 53, 53, 1)" }}>{sub_title}</View>
                {is_sign && <View className='mt-2 text-normal tag-risk'>安心住</View>}
              </View>
              {desc && <View className='text-muted text-normal apartment-item-content-desc'>{one_word}</View>}

            </View>
          </View>

          {/* 优惠活动 */}
          {/* 没有折扣价格的样式 */}
          {!discount_price_title && <View className='at-row at-row__align--center'>
            <View className='at-row'>
              {rules.map(i =>
                <View key={i.id} className='at-col-1 at-col--auto mr-2 mb-1 '>
                  <Text className={`badge badge-${i.type} text-mini`}> {ACTIVITY_TYPE_DIST[i.type]['message']}</Text>
                </View>
              )}
            </View>

            {/* 价格 */}

            <View className='text-yellow mt-1'>
              <Text className='text-bold text-large'>
                {isNaNPrice ? priceTitle : `${LOCALE_MONEY}${priceTitle}`}
              </Text>
              <Text className='text-normal'>{LOCALE_QI}</Text>
            </View>

          </View>}

          {/* 有折扣价格的样式 */}
          {discount_price_title && <View >
            {/* 价格 */}
            <View className='at-row at-row__justify--between'>

              <View className=' at-row at-col-5'>
                <View className='text-yellow text-small mt-1' >活动价：</View>
                <Text className='text-bold text-large text-yellow '>
                  {discount_price_title ? discount_price_title : `${LOCALE_MONEY}${priceTitle}`}
                </Text>
                <Text className='text-small mt-1 text-yellow'>{LOCALE_QI}</Text>
              </View>

              <View className='mt-1 at-row ml-4 at-col-5  page-middile' style='text-decoration:line-through;' >
                <View className='text-muted text-mini' >原价：</View>
                <Text className=' text-mini text-muted'>
                  {isNaNPrice ? priceTitle : `${LOCALE_MONEY}${priceTitle}`}
                </Text>
                <Text className='text-mini text-muted ' >{LOCALE_QI}</Text>
              </View>
            </View>

            <View className='at-row'>
              {rules.map(i =>
                <View key={i.id} className='at-col-1 at-col--auto mr-2 mb-1 '>
                  <Text className={`badge badge-${i.type} text-mini`}> {ACTIVITY_TYPE_DIST[i.type]['message']}</Text>
                </View>
              )}
            </View>


          </View>}
        </View>
        }


        {/* 迷你内容 ,公寓列表*/}
        {mini && <View className='apartment-item-content mx-2 mt-2 mb-2'>
          {/* 价格和公寓名称 */}
          {
            nearbyPost ? <View className='text-normal '>{title}</View> : <View className=' text-normal mt-3'>{apartmentTitle}</View>
          }
          {/* 优惠价 */}
          {
            discount_price_title ?
              <View className='text-yellow text-normal ml-1 ' style={{ marginTop: Taro.pxTransform(5) }} >{`${LOCALE_MONEY}${discount_price_title}${LOCALE_QI}`}</View> :
              <View className='text-yellow text-normal mt-1 mb-2  ml-1'>{`${LOCALE_MONEY}${priceTitle}${LOCALE_QI}`}</View>
          }
          {/* 原价 */}
          {discount_price_title && <View className='at-row  at-row__align--center  mb-2' style='text-decoration:line-through;' >
            <View className='text-muted text-mini'>原价：</View>
            <Text className=' text-mini text-muted'>
              {priceTitle ? priceTitle : `${LOCALE_MONEY}${priceTitle}`}元
            </Text>
            <Text className='text-mini text-muted '>{LOCALE_QI}</Text>
          </View>}


        </View>
        }
      </View>
    )
  }
}

export default ApartmentItem
