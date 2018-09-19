import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/data/role/page',
    method: 'post',
    data: params
  })
}

export function create(body) {
  return request({
    url: '/data/role',
    method: 'post',
    data: body
  })
}

export function edit(body) {
  return request({
    url: '/data/role',
    method: 'put',
    data: body
  })
}

export function del(id) {
  return request({
    url: '/data/role/' + id,
    method: 'delete'
  })
}
