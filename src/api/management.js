import request from '@/utils/request'

export function getUserList(query) {
  return request({
    url: '/management/userList',
    method: 'get',
    params: query
  })
}

export function lockUser(userId) {
  return request({
    url: '/management/lockUser',
    method: 'post',
    params: { userId }
  })
}

export function unlockUser(userId) {
  return request({
    url: '/management/unlockUser',
    method: 'post',
    params: { userId }
  })
}
