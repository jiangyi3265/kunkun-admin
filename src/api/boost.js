import request from '@/utils/request'
export const businessConfig=()=>request({url:'/boost/config',method:'get'})
export const overview = () => request({ url: '/boost-admin/overview' })
export const listBusiness = (type, params) => request({ url: '/boost-admin/list/' + type, params })
export const orderDetail = id => request({ url: '/boost-admin/orders/' + id })
export const moderate = (type,id,data) => request({ url: `/boost-admin/moderate/${type}/${id}`, method: 'post', data })
export const handleAftersale = (id,data) => request({ url: `/boost-admin/aftersales/${id}`, method: 'post', data })
export const handleWithdrawal = (id,data) => request({ url: `/boost-admin/withdrawals/${id}`, method: 'post', data })
export { protectedMediaUrl as mediaUrl } from '@/utils/boostMedia'
export const reconcileOrder = (id,data) => request({url:`/boost-admin/orders/${id}/reconcile`,method:'post',data})
export const amount = n => '¥' + (Number(n||0)/100).toFixed(2)
export const statusText = {WAIT_DELIVERY:'待交付',WAIT_CONFIRM:'待收货',SOLD:'已售出',VERIFIED:'已实名',PENDING:'待审核',ACTIVE:'上架中',OFFLINE:'已下架',REJECTED:'未通过',RESERVED:'已预订',MATCHED:'已接单',APPROVED:'已认证',NONE:'未认证',BLOCKED:'已停用',WAIT_PAY:'待付款',WAIT_START:'待开始',IN_PROGRESS:'进行中',REVIEW:'待验收',COMPLETED:'已完成',CANCELLED:'已取消',AFTERSALE:'售后中',REFUNDED:'已退款',REFUNDING:'退款中',REFUND_EXCEPTION:'退款异常',SIMULATED_PAID:'测试已完成',PROCESSING:'处理中',WAIT_USER_CONFIRM:'待确认收款',PAID:'已到账',FAILED:'转账失败'}
