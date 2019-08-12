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
    const { apartment, type } = this.props
    if (type === TYPE_FAVORITE_APARTMENT) {
      Taro.navigateTo({ url: `${PAGE_APARTMENT_SHOW}?id=${apartment.id}` })
    } else {
      Taro.navigateTo({ url: `${PAGE_HOUSE_TYPE_SHOW}?id=${apartment.id}` })
    }

  }


  render() {
    let { width, height, minWidth, minHeight, mini, nearbyPost, home, } = this.props
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
      num, is_sign, sub_title, one_word
    } = apartment


    const headerStyle = {
      width: '100%',
      height: Taro.pxTransform(height),
    }



    const fontSize = mini ? "10px" : "15px"
    const padding = mini ? "0 10px" : "2px 12px"
    // const borderRadius = mini ? "6px" : "12px"

    const apartmentHeaderType = {
      padding: padding,
      fontSize: fontSize,
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
      <View className={home === null ? 'apartment-box-shadow-style' : 'apartment-card-margin-style'} onClick={this.onNavigation}>
        {/* 户型头部 */}
        <View className='apartment-header' style={headerStyle}>


          {/* 户型封面，如果没有地址则使用 Image Placeholder 来占位 */}
          {cover
            ? <Image src={src} mode='scaleToFill' className='apartment-image' />
            : <ImagePlaceholder height={height} />
          }

          {/* 户型 cbd 列表 */}
          {
            cbd && <View className='apartment-header-title'>
              {cbdTitle}
            </View>
          }


          {/* 户型种类，公寓类型是没有这个字段的 */}
          {apartmentTitle && <View style={apartmentHeaderType} className=' text-large apartment-header-type'>{apartmentTitle}</View>}

          {/* 爱心按钮*/}
          {!mini && (isCollect
            ?
            <View className='apartment-header-favorite mr-2 mt-2' onClick={this.onDeleteFavorite}>
              <View className='apartment-heart-wrap' >
                <Image className='apartment-heart' src={HEART_YELLOW} ></Image>
              </View>
              <View className='apartment-heart-num' >{num}</View>

            </View>
            :
            <View className='apartment-header-favorite mr-2 mt-2' onClick={this.onCreateFavorite}>
              <View className='apartment-heart-wrap' >
                <Image className='apartment-heart' src={HEART_BLACK} ></Image>
              </View>
              <View className='apartment-heart-num' >{num}</View>

            </View>)
          }
        </View>

        {/* 正常内容 */}
        {!mini && <View className='apartment-content mx-3 py-2'>


          {/* 公寓名称 */}
          <View className='mt-1'>
            <View >
              <View className='at-row at-row__justify--between at-row__align--center'>
                <View className='text-large mt-2 at-col-1 at-col--auto' style={{ color: "rgba(53, 53, 53, 1)" }}>{sub_title}</View>
                {
                  is_sign && <View className='mt-2'>
                    <Image src={SIGN} className='apartment-container-sign'></Image>
                  </View>
                }
              </View>
              {desc && <View className='text-muted text-normal apartment-content-desc'>{one_word}</View>}

            </View>
          </View>

          {/* 优惠活动 */}

          <View className='at-row at-row__align--center'>
            <View className='at-row'>
              {rules.map(i =>
                <View key={i.id} className='at-col-1 at-col--auto mr-2 mb-1 '>
                  <Text className={`badge badge-${i.type} text-mini`}> #{ACTIVITY_TYPE_DIST[i.type]['message']}#</Text>
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

          </View>
        </View>
        }

        {/* 迷你内容 */}
        {mini && <View className='apartment-content mx-2 mt-2'>
          {/* 价格和公寓名称 */}
          {
            nearbyPost ? <View className='text-normal'>{title}</View> : <View className=' text-normal'>{apartmentTitle}</View>
          }
          <View className='text-yellow text-normal'>{isNaNPrice ? priceTitle : `${LOCALE_MONEY}${priceTitle}${LOCALE_QI}`}</View>
        </View>
        }
      </View>
    )
  }
}

export default ApartmentItem
