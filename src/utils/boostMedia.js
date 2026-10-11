import { reactive } from 'vue'
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
const cache=reactive({});let identity='',scheduled=false;const pending=new Set()
function reset(){const token=getToken();if(token!==identity){Object.keys(cache).forEach(k=>delete cache[k]);identity=token;pending.clear()}}
// Authorization reads may repeat immediately when a thumbnail is opened in the viewer.
export async function authorizeMedia(paths){reset();const token=identity,unique=[...new Set(paths)].filter(p=>/^\/boost-media\/[a-f0-9]{32}\.(png|jpg|webp)$/.test(p));for(let i=0;i<unique.length;i+=100){const group=unique.slice(i,i+100);try{const r=await request({url:'/boost-admin/media/access',method:'post',headers:{repeatSubmit:false},data:{paths:group}});if(token!==getToken())return;for(const p of group)cache[p]={url:r.data.urls[p]?(import.meta.env.VITE_APP_BASE_API||'/dev-api')+r.data.urls[p]:'',expires:Date.now()+(r.data.urls[p]?90000:10000)}}catch{if(token!==getToken())return;for(const p of group)cache[p]={url:'',expires:Date.now()+5000}}}}
export function protectedMediaUrl(path){reset();if(!path)return '';if(!/^\/boost-media\//.test(path))return path;if(!cache[path]||cache[path].expires<Date.now()){pending.add(path);if(!scheduled){scheduled=true;Promise.resolve().then(async()=>{scheduled=false;const paths=[...pending];pending.clear();await authorizeMedia(paths)})}}return cache[path]?.url||''}
