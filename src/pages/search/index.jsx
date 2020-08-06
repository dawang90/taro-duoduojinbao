import React, { Component } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtSearchBar } from 'taro-ui'
import fetch from '../../utils/request'
import { API_GOODS_LIST } from '../../constants/api'
import Goods from "../../components/goods"
import clsx from 'clsx'
import './index.scss'

class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      open: false,
      list: [],
      page: 0,
      keyword: '',
      isSearch: false,
      type: 0,
      focus: true,
      selector: ['综合排序', '评分排序'],
      selectorChecked: '综合排序'
    }
  }
  handleLoad() {
    const page = this.state.page + 1
    return fetch({
      url: API_GOODS_LIST,
      payload: {
        page,
        isunion: 1,
        page_size: 20,
        sort_type: this.state.type,
        keyword: this.state.keyword,
      }
    })
      .then(res => {
        this.setState({
          page,
          isSearch: true,
          list: page > 1 ? this.state.list.concat(res.goods_list) : res.goods_list
        })
        return res
      })
  }
  handleChange(value) {
    this.setState({
      keyword: value
    })
  }
  handleSubmit() {
    this.setState({
      loading: false,
      page: 1,
      list: [],
      type: 0
    }, () => {
      if (this.state.isSearch) {
        this.handleLoad()
      }
    })
  }
  handleSort(value) {
      this.setState({
        page: 1,
        list: [],
        type: value
      }, () => {
        this.handleLoad()
      })
  }
  onChange(e) {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
    if (e.detail.value == 0) {
      this.handleSort(0)
    }
    if (e.detail.value == 1) {
      this.handleSort(16)
    }
  }
  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    const paramsSearch = getCurrentInstance().router.params.search
    if (paramsSearch) {
      this.setState({
        keyword: decodeURIComponent(paramsSearch),
        focus: false
      }, () => {
        this.handleSubmit()
      })
    }
  }
  onShareAppMessage() {
    return {
      title: '拼多多海量优惠券，让你不再花冤枉钱',
      desc: '一多宝,只为让你省钱',
      path: `/pages/search/index?search=${this.state.keyword}`
    }
  }
  onShareTimeline() {
    return {
      title: '拼多多海量优惠券，让你不再花冤枉钱',
      desc: '一多宝,只为让你省钱',
      path: `/pages/search/index?search=${this.state.keyword}`
    }
  }
  render() {
    return (
      <View className='index'>
        <AtSearchBar
          onChange={this.handleChange.bind(this)}
          onConfirm={this.handleSubmit.bind(this)}
          onActionClick={this.handleSubmit.bind(this)}
          focus={this.state.focus}
          placeholder='搜索你要的商品'
          value={this.state.keyword}
          actionName='搜索'
        />
        {
          !this.state.loading ?
          <View className='at-row at-row__justify--between'>
            <View className='at-col'>
              <Picker mode='selector' range={this.state.selector} onChange={this.onChange.bind(this)}>
                <View className={clsx('search-sort', {
                  'search-sort--active': this.state.type == 0 || this.state.type == 16
                })}
                >
                  {
                    this.state.type == 16
                    ?
                    <Text>
                      评分
                    </Text>
                    :
                    <Text>
                      综合
                    </Text>
                  }
                </View>
              </Picker>
            </View>
            <View className='at-col'>
              <View onClick={this.handleSort.bind(this, 6)} className={clsx('search-sort', {
                'search-sort--active': this.state.type == 6
              })}
              >
                <Text>
                  销量
                </Text>
              </View>
            </View>
            <View className='at-col'>
              <View
                onClick={this.handleSort.bind(this, this.state.type == 9 ? 10 : 9)}
                className={clsx('search-sort', {
                  'search-sort--active': this.state.type == 9 || this.state.type == 10
                })}
              >
                <Text>
                  券后价
                </Text>
                {
                  this.state.type == 10
                  ? <View className='at-icon at-icon-arrow-down'></View>
                  : <View className='at-icon at-icon-arrow-up'></View>
                }
              </View>
            </View>
          </View>
          : null
        }
        <View className='search-body'>
          {
            !this.state.loading ?  <Goods list={this.state.list} onInit={this.handleLoad.bind(this)} /> : null
          }
        </View>
      </View>
    )
  }
}

export default Index
