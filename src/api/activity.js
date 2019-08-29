import request from '@/utils/request'

export function fetchList(query) {
  // console.log('z:fetchList(query),query=' + query)
  return request({
    url: '/activity/list',
    method: 'get',
    params: query
  })
}

export function fetchActivity(id) {
  return request({
    url: '/activity/detail',
    method: 'get',
    params: { id }
  })
}

export function createActivity(data) {
  return request({
    url: '/activity/create',
    method: 'post',
    data
  })
}
