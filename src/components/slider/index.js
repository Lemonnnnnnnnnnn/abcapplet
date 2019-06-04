/* eslint-disable no-restricted-globals */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import { COLOR_YELLOW, COLOR_GREY_2 } from '@constants/styles'

class Slider extends Component {
  static options = {
    addGlobalClass: true,
  }

  state = {
    windowWidth: 1,
  }

  static defaultProps = {
    step: 1,
    minValue: 0,
    maxValue: 100,
    min: 0,
    max: 100,
    height: 3,
    onChangeValue: () => { },
    activeColor: COLOR_YELLOW,
    defaultColor: COLOR_GREY_2,
  }

  setMin({ changedTouches, currentTarget }) {
    const { onChangeValue } = this.props
    let { minValue, maxValue, margin, min } = this.getSilderRect()

    minValue = this.transform({ changedTouches, currentTarget, target: minValue })

    if (minValue + margin < maxValue && minValue > min) {
      onChangeValue({ minValue, maxValue })
    }
  }

  setMax({ changedTouches, currentTarget }) {
    const { onChangeValue } = this.props
    let { minValue, maxValue, margin, max } = this.getSilderRect()

    maxValue = this.transform({ changedTouches, currentTarget, target: maxValue })
    if (minValue + margin < maxValue && maxValue < max) {
      onChangeValue({ minValue, maxValue })
    }
  }

  transform({ changedTouches, currentTarget, target }) {
    const { windowWidth } = this.state
    const { min, max, step } = this.getSilderRect()

    const oldPos = currentTarget.offsetLeft == 0 ? 1 : currentTarget.offsetLeft
    const newPos = changedTouches[0].pageX < 0 ? 0 : changedTouches[0].pageX

    const range = max - min
    const radio = (newPos - oldPos) / windowWidth

    const result = parseInt(target + range * radio)
    return Math.ceil(result / step) * step
  }

  componentWillMount() {
    Taro.getSystemInfo()
      .then(({ windowWidth }) => this.setState({ windowWidth }))
  }

  getSilderRect() {
    let { maxValue, minValue, min, max, step } = this.props

    // 修正大小
    maxValue < minValue && ([maxValue, minValue] = [maxValue, minValue])
    max < min && ([max, min] = [min, max])

    // 防止数据越界
    if (minValue < min || minValue > max) minValue = min
    if (maxValue < min || maxValue > max) maxValue = max

    // 格式化数据
    step = parseInt(step)
    min = parseInt(min)
    max = parseInt(max)
    minValue = parseInt(minValue)
    maxValue = parseInt(maxValue)

    // 修正数据
    min = isNaN(min) ? 0 : min
    max = isNaN(max) ? 100 : max
    minValue = isNaN(minValue) ? min : minValue
    maxValue = isNaN(maxValue) ? max : maxValue

    // 确定间隔
    const margin = parseInt((max - min) * 0.1)
    step = isNaN(step) ? (margin % 10) * 10 : step

    return {
      min,
      max,
      step,
      margin,
      minValue,
      maxValue,
    }
  }

  render() {
    let { className, height } = this.props
    let { maxValue, minValue, min, max } = this.getSilderRect()

    // 计算比例
    const range = max - min
    const sliderLeftWidth = Math.floor((minValue - min) / range * 100)
    const sliderBodyWidth = Math.floor((maxValue - minValue) / range * 100)
    const sliderRightWidth = Math.floor(100 - sliderLeftWidth - sliderBodyWidth)

    const sliderLeftStyle = {
      'background-color': COLOR_GREY_2,
      height: `${Taro.pxTransform(parseInt(height))}`,
      width: `${sliderLeftWidth}%`,
    }

    const sliderRightStyle = {
      'background-color': COLOR_GREY_2,
      height: `${Taro.pxTransform(parseInt(height))}`,
      width: `${sliderRightWidth}%`,
    }

    const sliderBodyStyle = {
      'background-color': COLOR_YELLOW,
      height: `${Taro.pxTransform(parseInt(height))}`,
      width: `${sliderBodyWidth}%`,
    }

    const sliderMinStyle = {
      left: `${sliderLeftWidth}%`,
    }

    const sliderMaxStyle = {
      right: `${sliderRightWidth}%`,
    }

    return (
      <View className={classNames('slider', className)}>
        <View className='at-row at-row__justify--center'>
          <View class='slider-content' style={{ width: '80%' }}>
            <View className='at-row'>
              <View className='slider-left' style={sliderLeftStyle}></View>
              <View className='slider-body' style={sliderBodyStyle}></View>
              <View className='slider-right' style={sliderRightStyle}></View>
            </View>
            <View className='slider-min' onTouchMove={this.setMin} style={sliderMinStyle}><View className='inner'></View></View>
            <View className='slider-max' onTouchMove={this.setMax} style={sliderMaxStyle}><View className='inner'></View></View>
          </View>
        </View>
      </View>
    )
  }
}

export default Slider
