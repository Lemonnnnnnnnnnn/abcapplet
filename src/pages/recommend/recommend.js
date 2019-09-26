import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { PAYLOAD_SUB_LIST } from '@constants/api'

import Search from '@components/search'
import SubletList from '@components/sublet-list'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as subletActions from '@actions/subleat'

@connect(state => state, {
  ...subletActions,
})

class ApartmentRecommend extends Component {
  config = {
    navigationBarTitleText: '转租列表',
    backgroundColor: '#FFFFFF',
  }

  refSubletList = (node) => this.SubletList = node

  state = {
    selector: ['厦门市'],
    selectorChecked: '厦门市',
    isInput: 1,
    payload:PAYLOAD_SUB_LIST,
    count:false,
  }

  /**
 * 到底部加载公寓下一页
 */
  onReachBottom() {
    this.SubletList.onNextPage(1)
  }


  componentDidShow(){
    const { count } = this.state
    count && this.SubletList.onReset(null)
    this.setState({
      count:true
    })
  }


  render() {
    const { selector, selectorChecked, isInput,payload } = this.state
    const { sublet } = this.props

    const page = {
      backgroundColor: '#FFFFFF',
      minHeight: '',
    }
    return (
      <View style={page}>
        <View className='home-search pl-3 pr-3 pt-2'>
          {
            <Search
              className='mb-2'
              selector={selector}
              selectorChecked={selectorChecked}
              isInputSub={isInput}
            />
          }
        </View>

        <SubletList
          items={sublet.list}
          ref={this.refSubletList}
          defaultPayload={payload}
          dispatchList={this.props.dispatchSubList}
          dispatchNextPageList={this.props.dispatchNextPageSubList}

        />
      </View>
    )
  }
}

export default ApartmentRecommend
