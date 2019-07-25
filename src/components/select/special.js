import Taro from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'

import { AtTag } from 'taro-ui'

// import Tag from '@components/tag'
import BaseComponent from '@components/base'

/**
 * Select 中的特殊需求部分
 * ----------------------------
 **参数
 * ----------------------------
 */
class SelectSpecial extends BaseComponent {

  static defaultProps = {
    index: '',
    items: [],
    show: false,
    onChange: () => { },
  }


  state = {
    specialList: [],
  }

  componentWillMount() {
    const { items } = this.props

    const specialList = []

    items.map((i, key) => {
      i.posi = key
      i.type = false
      i.active = true
      specialList.push(i)
    })

    this.setState({
      specialList: [...specialList],
    })
  }


  onSelectedItemsChange(e, index) {
    let { specialList } = this.state
    let arr = []
    let newselectedItems = JSON.parse(JSON.stringify(specialList))
    newselectedItems.map(i => {
      if (i.posi === index) {
        i.type = !i.type
      }
      if (i.type === true) {
        arr.push(i.id)
      }
    })
    this.setState({
      specialList: [...newselectedItems]
    })

    this.props.onChange({ payload: { tags: arr.toString() } })

  }

  render() {
    const { show } = this.props
    const { specialList } = this.state
    console.log(specialList)


    const fontStyle = {
      fontSize: "12px",
      padding: "0 5px"
    }

    return (show &&
      <ScrollView
        scrollX
        className='my-2 ml-2 carousel-normal'
      >
        {
          specialList.map((i, key) =>
            <AtTag
              type={i.type ? "primary" : ""}
              className='ml-3 mr-1 mt-2 mb-3'
              circle
              onClick={(e) => this.onSelectedItemsChange(e, key)}
              key={key}
              active={i.active} >
              <View style={fontStyle}>{i.title}</View>
            </AtTag>)
        }
       
      </ScrollView>
    )
  }
}

export default SelectSpecial
