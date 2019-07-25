import Taro from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'

import { AtTag } from 'taro-ui'

// import Tag from '@components/tag'
import BaseComponent from '@components/base'
import { CAROUSEL_SELECT_SPECIAL_HEIGHT } from '@constants/styles'

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

  // static defaultState = {
  //   selectedItems: [],
  //   scrollViewHeight: CAROUSEL_SELECT_SPECIAL_HEIGHT,
  // }

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

  // onResetState() {
  //   this.setState({ ...SelectSpecial.defaultState })
  // }

  // onSelectedItemsChange({ name: id }) {
  //   let { selectedItems } = this.state
  //   console.log(selectedItems)

  //   selectedItems = selectedItems.includes(id)
  //     ? selectedItems.filter(i => i !== id)
  //     : [...selectedItems, id]

  //   this.setState({ selectedItems })
  //   this.props.onChange({ payload: { tags: selectedItems.toString() } })
  // }

  onSelectedItemsChange(e, index) {
    let { specialList } = this.state
    let arr = []
    let newselectedItems = JSON.parse(JSON.stringify(specialList))
    newselectedItems.map(i => {
      if (i.posi === index) {
        i.type = !i.type
        if (i.type === true) {
          arr.push(i.id)
        }
      }
    })
    this.setState({
      specialList: [...newselectedItems]
    })

    this.props.onChange({ payload: { tags: arr.toString() } })

    // selectedItems.push(index + 1)
  }

  render() {
    const { show } = this.props
    const { specialList } = this.state
    console.log(specialList)

    // const style = { height: Taro.pxTransform(scrollViewHeight) }

    const fontStyle = {
      fontSize: "15px",
      padding: "0 5px"
    }

    return (show &&
      <ScrollView
        scrollX
        // style={style}
        className='my-2 ml-2 carousel-normal'
      >
        {
          specialList.map((i, key) =>
            <AtTag
              type={i.type ? "primary" : ""}
              className='ml-3 mr-1 mt-3 mb-3'
              circle
              onClick={(e) => this.onSelectedItemsChange(e, key)}
              key={key}
              active={i.active} >
              <View style={fontStyle}>{i.title}</View>
            </AtTag>)
        }
        {/* {items.map((item) =>
          <Tag
            key={item.id}
            type='special'
            name={item.id}
            className='carousel-normal-item'
            active={selectedItems.includes(item.id)}
            onClick={this.onSelectedItemsChange}
          >{item.title}</Tag>
        )} */}
      </ScrollView>
    )
  }
}

export default SelectSpecial
