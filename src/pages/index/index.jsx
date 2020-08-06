import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'
import { View } from '@tarojs/components'
import { optsChange, dispatchOptsGoods } from '../../actions/opts'
import { AtTabs, AtTabsPane, AtSearchBar, AtGrid, AtToast } from 'taro-ui'
import { API_REDPACKET } from '../../constants/api'
import { getGlobalData } from '../../utils/global_data'
import fetch from '../../utils/request'
import Goods from '../../components/goods'
import msImg from './cms_seckill_icon_v3.png'
import oneNineImg from './one_point_nine_v3.png'
import brandImg from './cms_brand_sales_v3.png'
import redpacketImg from './cms_redpacket_v3.png'
import './index.scss'


@connect(({ opts }) => ({
  opts
}), (dispatch) => ({
  optsChange: (index) => {
    dispatch(optsChange(index))
  },
  dispatchOptsGoods: (payload, index) => {
    return dispatch(dispatchOptsGoods(payload, index))
  }
}))
class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }
  handleClick (value) {
    this.props.optsChange(value)
  }

  loadGoods(index) {
    return this.props.dispatchOptsGoods({
      opt_id: this.props.opts.categoryList[index].optId,
      page: this.props.opts.categoryList[index].page + 1,
      page_size: 20,
      isunion: 1
    }, index)
  }

  handleToSearch() {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  toRedpacket() {
    this.setState({
      open: true
    })
    fetch({
      url: API_REDPACKET,
      payload: {
        positionid: getGlobalData('pid'),
        channel_type: 0
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
            appId: process.env.TARO_ENV == 'qq' ? res.alldata.url_list[0].qq_app_info.app_id : res.alldata.url_list[0].we_app_info.app_id,
            path: process.env.TARO_ENV == 'qq' ? res.alldata.url_list[0].qq_app_info.page_path : res.alldata.url_list[0].we_app_info.page_path,
            envVersion: 'release',
            success: function () {
              // 打开成功
            },
            fail: function (err) {
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
  handleClickRrid(item, index) {
    switch (index) {
      case 0:
        return Taro.navigateTo({
          url: '/pages/baokuan/index'
        })
      case 1:
        return Taro.navigateTo({
          url: '/pages/duoninenine/index'
        })
      case 2:
        return Taro.navigateTo({
          url: '/pages/brand/index'
        })
      case 3:
        this.toRedpacket()
        return false
      default:
        return false
    }
  }

  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }

  componentWillUnmount () { }

  componentDidShow () {

  }
  onShareAppMessage() {
    return {
      title: '拼多多海量优惠券，让你不再花冤枉钱',
      desc: '一多宝,只为让你省钱',
    }
  }
  onShareTimeline() {
    return {
      title: '拼多多海量优惠券，让你不再花冤枉钱',
      desc: '一多宝,只为让你省钱',
    }
  }
  componentDidHide () { }
  render () {
    const tabList = this.props.opts.categoryList.map(item => ({
      title: item.optName
    }))
    return (
      <View className='index'>
        <View onClick={this.handleToSearch}>
          <AtSearchBar
            placeholder='搜索你要的商品'
            disabled
          />
          <AtToast hasMask isOpened={this.state.open} status='loading'></AtToast>
        </View>
        <AtTabs
          current={this.props.opts.activeTab}
          scroll
          tabList={tabList}
          onClick={this.handleClick.bind(this)}
        >
          {
            tabList.map((item, index) => (
              <AtTabsPane key={index} current={this.props.opts.activeTab} index={index}>
                {
                  this.props.opts.categoryList[index].page > 0 || this.props.opts.activeTab === index
                  ? <Goods
                      renderHeadComment={
                          index === 0
                          ?
                          <View className='search-recommend'>
                            <AtGrid onClick={this.handleClickRrid.bind(this)} columnNum={4} hasBorder={false} data={[
                              {
                                image: msImg,
                                value: '今日爆款'
                              },
                              {
                                image: oneNineImg,
                                value: '1.9包邮'
                              },
                              {
                                image: brandImg,
                                value: '品牌清仓'
                              },
                              {
                                image: redpacketImg,
                                value: '天天红包'
                              }
                            ]} />
                          </View>
                          : null
                      }
                      list={this.props.opts.categoryList[index].list}
                      onInit={this.loadGoods.bind(this, index)}
                    />
                  : null
                }
              </AtTabsPane>
            ))
          }
        </AtTabs>
      </View>
    )
  }
}

export default Index

