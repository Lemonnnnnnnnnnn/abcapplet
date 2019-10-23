import Taro from '@tarojs/taro'

export default function initProject() {
  const dateCur = new Date().getTime()
  const dateBefore = Taro.getStorageSync('dateCur')

  const CurtainShow = (dateCur - dateBefore <= 24 * 60 * 60 * 1000) ? false : true

  Taro.setStorageSync('dateCur', dateCur)
  Taro.setStorageSync('CurtainShow', CurtainShow)

}
