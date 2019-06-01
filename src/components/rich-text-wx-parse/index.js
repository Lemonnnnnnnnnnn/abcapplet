/* eslint-disable react/forbid-elements */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { wxParse } from '../wx-parse/wxParse'

class RichTextWxParse extends Component {

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    wxParse('content', 'html', this.props.content, this.$scope, 0)
  }

  render() {
    return (
      <View className={this.props.className}>
        <import src='../../components/wx-parse/wxParse.wxml' />
        <template is='wxParse' data='{{wxParseData:content.nodes}}' />
      </View >
    )
  }
}

export default RichTextWxParse
