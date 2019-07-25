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
    selector: [''],
    selectorChecked: '',
    onChangeSelector: () => { },

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
    const { selector, onChangeSelector, selectorChecked, size, isFixed, className, showCancel } = this.props

    return (
      <View className={classNames(className, 'search', `${isFixed ? 'search-fixed' : ''}`)}>
        <View className='search-box'>
          <View className='search-content at-row at-row__align--center'>
            <View className='at-col at-col-3'>
              <Picker mode='selector' range={selector} onChange={onChangeSelector}>
                <View className='picker text-normal ml-3 at-row at-row__align--center'>
                  <Text>{selectorChecked}</Text>
                  <AtIcon prefixClass='iconfont icon' value='down' size={size} color={COLOR_BLACK} />
                </View>
              </Picker>
            </View>

            {/* 带样式的输入框，点击后跳转搜索页 */}
            <View className='at-col at-col-9' onClick={this.onNavigation}>
              {!isInput
                ? <View className='at-row at-row__align--center text-normal text-muted' >
                  <AtIcon className='ml-2' value='search' size={size} color={COLOR_GREY_0} />

                  <Text className='ml-2'>{LOCALE_SEARCH_PLACEHOLDER}</Text>
                </View>
                : <View className='at-row at-row__align--center at-row__justify--between text-normal' >
                  <Input className='ml-3'
                    focus
                    value={value}
                    confirmType='确定'
                    onInput={this.onInputValue}
                    onConfirm={this.onInputConfirm}
                  />
                  {showCancel && <View className='mr-3 text-muted' onClick={this.onInputCancel}>取消</View>}
                </View>
              }
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Search
