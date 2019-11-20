//首页顶端选择器加搜索样式（点击跳转）
// Taro 相关
import Taro from '@tarojs/taro'
import { View, Picker, Text, Input } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// NPM 包
import classNames from 'classnames'

// 自定义组件
import BaseComponent from '@components/base'

// 自定义常量
import { PAGE_SEARCH } from '@constants/page'
import { LOCALE_SEARCH_PLACEHOLDER } from '@constants/locale'
import { COLOR_GREY_0, COLOR_BLACK } from '@constants/styles'

class Search extends BaseComponent {
  static defaultProps = {
    size: 13,
    showCancel: false,
    isFixed: false,
    // 城市选择器相关
    selector: [''],
    selectorChecked: '',
    onChangeSelector: () => { },
    showPicker: true,

    // 输入相关
    isInput: false,
  }

  state = {
    value: '',
    focus: false,
  }


  onNavigation() {
    const { isInput } = this.props
    !isInput && Taro.navigateTo({ url: PAGE_SEARCH })
  }

  /**
   * 根据输入框的值判断是取消还是搜索
   */
  onInputValue({ currentTarget: { value } }) {
    this.setState({ value })
  }

  /**
   * 清空输入框
   */
  onInputCancel() {
    this.setState({ value: '' })
    this.props.onInputCancel()
  }

  /**
   * 回车搜索
   */
  onInputConfirm() {
    const { value } = this.state

    this.props.onInputConfirm({
      payload: { search_key: value }
    })
  }


  render() {
    const { isInput, value } = this.state
    const { selector, showPicker, onChangeSelector, selectorChecked, size, isFixed, className, showCancel, showSearch, isInputSub, inputValue } = this.props

    const hideStyle = {top: Taro.pxTransform(-92)}

    const showStyle = {top: 0}

    return (
      <View className={classNames(className, 'search', isFixed ? 'search-fixed px-3' : '')} style={showSearch ? showStyle : hideStyle} >
        <View className='search-box'>
          <View className='search-content at-row  at-row__align--center'>
            {/* 城市选择器 */}
            {showPicker && <View className='at-col at-col-3'>
              <Picker mode='selector' range={selector} value={selectorChecked.sort - 1} onChange={onChangeSelector}>
                <View className='picker text-normal ml-3 at-row at-row__align--center'>
                  <Text>{selectorChecked.title}</Text>
                  <AtIcon prefixClass='iconfont icon' value='down' size={size} color={COLOR_BLACK} />
                </View>
              </Picker>
            </View>}

            {/* 带样式的输入框，点击后跳转搜索页 */}
            {!isInputSub &&
              <View className='at-col' onClick={this.onNavigation}>
                {!isInput
                  ? <View className='at-row at-row__align--center text-normal text-muted' >
                    <AtIcon className='ml-2' value='search' size={size} color={COLOR_GREY_0} />
                    <Text className='ml-2'>{LOCALE_SEARCH_PLACEHOLDER}</Text>
                  </View>
                  : <View className='at-row at-row__align--center text-normal' >
                    <AtIcon className='ml-3' value='search' size={size} color={COLOR_GREY_0} />
                    <View className='at-col'>
                      <Input
                        className='ml-2'
                        style={{height : Taro.pxTransform(30 * 2) , minHeight : Taro.pxTransform(30 * 2)}}
                        focus
                        value={value}
                        confirmType='确定'
                        placeholder='搜索公寓/商圈'
                        onInput={this.onInputValue}
                        onConfirm={this.onInputConfirm}
                      />
                    </View>
                    {showCancel && <View className='px-3 text-muted' style={{float : 'right'}} onClick={this.onInputCancel}>取消</View>}
                  </View>
                }
              </View>}
            {/* 搜索转租 */}
            {isInputSub && <View className='at-col '>
              <View className='at-row at-row__align--center at-row__justify--between text-normal' >
                <Input className='ml-3'
                  value={inputValue}
                  confirmType='确定'
                  placeholder='搜索公寓/户型等关键词'
                  onInput={this.props.onInputValue}
                  onConfirm={this.props.onInputConfirm}
                />
                {showCancel && <View className='mr-3 text-muted' onClick={this.props.onInputCancel}>取消</View>}
              </View>

            </View>}


          </View>
        </View>
      </View>
    )
  }
}

export default Search
