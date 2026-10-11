import request from '@/utils/request'
const base='/boost-admin/rewards'
export const rewardList=(type,params)=>request({url:base+'/'+type,params})
export const rewardDetail=id=>request({url:base+'/activities/'+id})
export const saveReward=(type,id,data)=>request({url:base+'/'+type+(id?'/'+id:''),method:id?'put':'post',data})
export const grantPoints=(id,data)=>request({url:base+'/points/'+id,method:'post',data})
export const readPoints=id=>request({url:base+'/points/'+id})
export const shipReward=(id,data)=>request({url:base+'/orders/'+id+'/ship',method:'post',data})
export const uploadReward=file=>{const data=new FormData();data.append('file',file);return request({url:base+'/upload',method:'post',data,headers:{'Content-Type':undefined,repeatSubmit:false},timeout:30000})}
export const rewardImage=p=>/^\/boost-reward-media\/[a-f0-9]{32}\.png$/.test(p||'')?(import.meta.env.VITE_APP_BASE_API||'')+p:''
