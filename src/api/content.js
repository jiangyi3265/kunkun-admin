import request from '@/utils/request'
const base='/boost-admin/content'
export const readSite=()=>request({url:base+'/site'})
export const saveSite=data=>request({url:base+'/site',method:'put',data})
export const listActivities=params=>request({url:base+'/activities',params})
export const readActivity=id=>request({url:base+'/activities/'+id})
export const saveActivity=(id,data)=>request({url:base+'/activities'+(id?'/'+id:''),method:id?'put':'post',data})
export const uploadContent=file=>{const data=new FormData();data.append('file',file);return request({url:base+'/upload',method:'post',data,headers:{'Content-Type':undefined,repeatSubmit:false},timeout:30000})}
