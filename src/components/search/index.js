import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { MESSAGE_SEARCH_PLACEHOLDER } from "@constants/message"
import { COLOR_GREY_0, COLOR_BLACK } from '@constants/styles'

class Search extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    selector: [''],
    onChangeSelector: () => { },
    selectorChecked: '',
    size: 13,
  }

  render() {
    const { selector, onChangeSelector, selectorChecked, size } = this.props

    return (
      <View class='search'>
        <View class='search-box at-row at-row__align--center'>
          <View class='at-col at-col-1 ml-3'>
            <Picker mode='selector' range={selector} onChange={onChangeSelector}>
              <View className='picker text-normal'>
                <Text>{selectorChecked}</Text>
                <AtIcon prefixClass='iconfont icon' value='down' size={size} color={COLOR_BLACK} />
              </View>
            </Picker>
          </View>
          <View class='at-col'>
            <View class='text-normal text-center text-muted'>
              <AtIcon value='search' size={size} color={COLOR_GREY_0} />
              <Text className='ml-2'>{MESSAGE_SEARCH_PLACEHOLDER}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Search
