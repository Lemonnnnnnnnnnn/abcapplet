// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

// 自定义组件
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { API_UPLOAD_IMAGE } from '@constants/api'

class ImageUpload extends BaseComponent {
  static defaultProps = {
    placeholer: 6,
  }

  state = {
    index: 0,
    files: [],
  }

  componentDidMount() {
    const { placeholer } = this.props
    const files = Array.from({ length: placeholer - 1 }).map((i, key) => ({
      id: key,
      url: '',
    }))

    this.setState({ files })
  }

  async onClick() {
    let { files, index } = this.state
    const { placeholer } = this.props
    const { tempFilePaths } = await Taro.chooseImage({
      count: placeholer - 1,
      sizeType: ['compressed'],
    })

    Taro.showLoading({ title: '正在上传照片' })

    for (let i = 0; i < tempFilePaths.length; i++) {
      if (index >= placeholer - 1) return;

      let { data } = await Taro.uploadFile({
        name: 'risk',
        url: API_UPLOAD_IMAGE,
        filePath: tempFilePaths[i],
      })

      const file = (JSON.parse(data)).data[0]

      files[index++] = {
        ...files[index],
        url: file.path,
      }

      this.setState({ files, index: index - 1 })
    }

    Taro.hideLoading()
    this.props.onChange(files.filter(i => i.url !== '').map(i => i.url))
  }

  render() {
    const { files } = this.state
    return (
      <View className='at-row at-row--wrap'>
        <View className='at-col at-col-4' onClick={this.onClick}>
          <View className='upload-image-item at-row at-row__align--center at-row__justify--center'>
            <View>
              <View className='at-row at-row__justify--center'>
                <ABCIcon icon='add' color={COLOR_GREY_2} size='32' />
              </View>
              <View className='text-normal text-secondary mt-2'>上传证明</View>
            </View>
          </View>
        </View>
        {
          files.map(i =>
            <View key={i.id} className='at-col at-col-4'>
              <View className='upload-image-item at-row at-row__align--center at-row__justify--center'>
                <Image src={i.url} style={{ width: '80%', height: '80%' }} />
              </View>
            </View>
          )
        }
      </View >
    )
  }
}

export default ImageUpload
