import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/data/profile/page',
    method: 'post',
    data: params
  })
}

export function getAllProfile() {
  return request({
    url: '/data/profile/all',
    method: 'get'
  })
}

export function create(body) {
  return request({
    url: '/data/profile',
    method: 'post',
    data: body
  })
}

export function edit(body) {
  return request({
    url: '/data/profile',
    method: 'put',
    data: body
  })
}

export function del(id) {
  return request({
    url: '/data/profile/' + id,
    method: 'delete'
  })
}
