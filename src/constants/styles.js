import Taro from '@tarojs/taro'

/**
 * -------------------------------------------
 * 轮播高度和宽度
 * -------------------------------------------
 **说明
 * 1.记录各个轮播的宽高数据
 */
// BANNER 相关
export const CAROUSEL_BANNER_IMAGE_HEIGHT = 344
export const CAROUSEL_BANNER_IMAGE_WIDTH = 626
export const CAROUSEL_BANNER_CONTENT_HEIGHT = 170

// CBD 相关
export const CAROUSEL_CBD_IMAGE_HEIGHT = 176
export const CAROUSEL_CBD_IMAGE_WIDTH = 312
export const CAROUSEL_CBD_CONTENT_HEIGHT = 0

// AD 相关
export const CAROUSEL_AD_IMAGE_HEIGHT = 126
export const CAROUSEL_AD_IMAGE_WIDTH = 686
export const CAROUSEL_AD_CONTENT_HEIGHT = 0

// RECOMMEND 相关
export const CAROUSEL_RECOMMEND_IMAGE_HEIGHT = 275
export const CAROUSEL_RECOMMEND_IMAGE_WIDTH = 642
export const CAROUSEL_RECOMMEND_CONTENT_HEIGHT = 0

// ACTIVITY 相关
export const CAROUSEL_ACTIVITY_IMAGE_HEIGHT = 240
export const CAROUSEL_ACTIVITY_IMAGE_WIDTH = 414
export const CAROUSEL_ACTIVITY_CONTENT_HEIGHT = 0

// SELECT 中的特殊需求
export const CAROUSEL_SELECT_SPECIAL_HEIGHT = 60

/**
 * -------------------------------------------
 * AtTabs 基础高度
 * -------------------------------------------
 */
// SELECT 相关
export const TABS_SELECT_ITEM_HEIGHT = 60

/**
 * -------------------------------------------
 * 颜色
 * -------------------------------------------
 **说明
 * 1.主要以 taro-ui 中的默认颜色为主
 * 2.修改时记得修改 `src/styles/_overrides.scss` 中的样式
 */
export const COLOR_BLACK = "#000000"  // 黑色
export const COLOR_WHITE = "#FFFFFF"  // 白色
export const COLOR_YELLOW = "#FFC919" // 黄色 & 主题色
export const COLOR_BLUE = "#177eff" // 蓝色
export const COLOR_LIGHT_YELLOW = '#FFDA61' // 浅黄
export const COLOR_RED = '#FF6161' // 红色

export const COLOR_GREY_0 = "#333333" // 灰色
export const COLOR_GREY_1 = "#666666" // 灰色
export const COLOR_GREY_2 = "#999999" // 灰色
export const COLOR_GREY_3 = "#CCCCCC" // 灰色
export const COLOR_GREY_4 = "#E5E5E5" // 灰色
export const COLOR_GREY_5 = "#F0F0F0" // 灰色
export const COLOR_GREY_6 = "#F7F7F7" // 灰色

/**
 * -------------------------------------------
 * 字体相关
 * -------------------------------------------
 **说明
 * 1.主要以 taro-ui 中的默认字体为主
 * 2.主要用于 icon 的 size大小
 */
//  /* Font */
export const FONT_SIZE_XS = Taro.pxTransform(10)   // 非常用字号，用于标签
export const FONT_SIZE_SM = Taro.pxTransform(12)   // 用于辅助信息
export const FONT_SIZE_BASE = Taro.pxTransform(14) // 常用字号
export const FONT_SIZE_LG = Taro.pxTransform(16)   // 常规标题
export const FONT_SIZE_XL = Taro.pxTransform(20)   // 大标题
export const FONT_SIZE_XXL = Taro.pxTransform(30)  // 用于大号的数字
