import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { AtActivityIndicator, AtToast } from 'taro-ui'
import fetch from '../../utils/request'
import { API_GETUNION_URL } from '../../constants/api'
import { getGlobalData } from '../../utils/global_data'
import './index.scss'


class Goods extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      open: false
    }
  }
  static defaultProps = {
    onInit: () => {},
    list: [],
    brand: false
  }

  handleClick(id) {
    this.setState({
      open: true
    })
    fetch({
      url: API_GETUNION_URL,
      payload: {
        goods_id: id,
        positionid: getGlobalData('pid')
      }
    })
      .then(res => {
        this.setState({
          open: false
        })
        if (process.env.TARO_ENV === 'h5') {
          window.location.href = res.alldata.we_app_web_view_url
          return 
        }
        if (process.env.TARO_ENV === 'qq' || process.env.TARO_ENV === 'weapp') {
          Taro.navigateToMiniProgram({
            appId: process.env.TARO_ENV == 'qq' ? getGlobalData('qqAppid') : res.alldata.we_app_info.app_id,
            path: res.alldata.we_app_info.page_path,
            envVersion: 'release',
            success: function() {
              // 打开成功
            },
            fail: function(err) {
              //打开失败
            }
          })
          return 
        }
      })
      .catch(err => {
        this.setState({
          open: false
        })
      })
  }

  onScrollToLower() {
    if (this.state.loading) {
        return
    }
    this.setState({
      loading: true
    })
    this.props.onInit()
      .then(res => {
        this.setState({
          loading: false
        })
      })
      .catch(err => {
        this.setState({
          loading: false
        })
      })
  }

  componentWillMount() {
    this.setState({
      loading: true
    })
    this.props.onInit()
      .then(res => {
        this.setState({
          loading: false
        })
      })
      .catch(err => {
        this.setState({
          loading: false
        })
      })
  }
  render() {
    return (
      <ScrollView
        className='goods-root'
        scrollY
        onScrollToLower={this.onScrollToLower.bind(this)}
      >
        {this.props.renderHeadComment}
        <AtToast hasMask isOpened={this.state.open} status='loading'></AtToast>
        <View className='at-row at-row--wrap'>
        {
          this.props.list.map((item, index) => (
            <View key={item.goods_id} className='at-col-6'>
              <View className='goods-item' onClick={this.handleClick.bind(this, item.goods_id)}>
                <View className='goods-item-body'>
                  <Image className='goods-img' src={item.goods_thumbnail_url} />
                  <View className='goods-item-panel'>
                    <View className='goods-item-title ellipsis'>
                      {item.goods_name}
                    </View>
                    {
                      !this.props.brand
                      ?
                      <View className='goods-item-sales'>
                       <Text>销量{item.sales_tip}件</Text>
                      </View>
                      :
                      <View className='goods-item-brand'>
                        <Text>{item.mall_name}</Text>
                      </View>
                    }

                    <View className='at-row at-row__align--center'>
                      <View className='at-col'>
                        {
                          item.has_coupon ?
                            <Text className='goods-item-discount'>
                              {item.coupon_discount / 100}元券
                            </Text>
                          : null
                        }
                      </View>
                      <View className='at-col--auto at-col-h5'>
                        {
                          item.has_coupon ?
                            <Text className='goods-item-price'>
                              券后￥
                            </Text>
                            : null
                        }
                        <Text className='goods-item-price goods-item-price_bold'>{(item.min_group_price - item.coupon_discount) / 100}</Text>
                        {
                          this.props.brand
                            ?
                            <Text className='goods-item-origin_price'>
                              ￥{item.min_normal_price / 100}
                            </Text>
                            : null
                        }
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))
        }
        </View>
        {
          this.state.loading
          ? <AtActivityIndicator className='goods-loading' content='加载中...'></AtActivityIndicator>
          : null
        }
      </ScrollView>
    )
  }
}

export default Goods
