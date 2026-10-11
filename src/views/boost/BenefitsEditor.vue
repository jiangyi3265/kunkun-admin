<template><section class="benefits-editor"><h3>会员与成长</h3><p>管理员手动授予，操作留痕。会员不会代替实名或店铺认证，暂不开放会员购买。</p><el-alert v-if="error" :title="error" type="error" :closable="false" /><el-form label-position="top"><el-form-item label="等级累计阈值（从 0 开始，用英文逗号分隔）"><el-input v-model="levels" :disabled="busy||!canRules" placeholder="例：0,100,300,1000" /></el-form-item><el-form-item label="本次操作原因"><el-input v-model="note" maxlength="200" /></el-form-item><el-button v-if="canRules" :disabled="busy||!ready" @click="saveRules">保存等级规则</el-button><template v-if="canManage"><el-form-item label="操作类型"><el-select v-model="action" :disabled="busy"><el-option label="会员状态" value="membership" /><el-option label="成长值调整" value="growth" /></el-select></el-form-item><template v-if="action==='membership'"><el-form-item label="会员状态"><el-select v-model="membershipType"><el-option label="会员" value="MEMBER" /><el-option label="非会员（取消会员）" value="FREE" /></el-select></el-form-item><el-form-item v-if="membershipType==='MEMBER'" label="到期时间（UTC）"><el-date-picker v-model="expiresAt" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" /></el-form-item></template><el-form-item v-else label="调整成长值（正数增加、负数扣减）"><el-input-number v-model="delta" :min="-1000000000" :max="1000000000" :precision="0" /></el-form-item><el-button type="primary" :disabled="busy||!ready" @click="saveMember">确认更新玩家资料</el-button></template></el-form></section></template>
<script setup>
import {ref,onMounted,onBeforeUnmount} from 'vue'
import {ElMessageBox,ElMessage} from 'element-plus'
import auth from '@/plugins/auth'
import request from '@/utils/request'
import {getToken} from '@/utils/auth'
import useUserStore from '@/store/modules/user'
const props=defineProps({member:{type:Object,required:true}}),emit=defineEmits(['saved'])
const canManage=auth.hasPermi('boost:benefits:manage'),canRules=auth.hasPermi('boost:benefits:rules')
const levels=ref(''),original=ref(''),note=ref(''),action=ref('membership'),membershipType=ref('MEMBER'),expiresAt=ref(''),delta=ref(0),busy=ref(false),error=ref(''),ready=ref(false)
const userStore=useUserStore();let intent=null,alive=true
onBeforeUnmount(()=>{alive=false})
function storage(){if(!userStore.id)throw new Error('管理员身份未就绪，请重新登录');return 'boost_benefits_pending_'+userStore.id+'_'+props.member.id}
onMounted(async()=>{try{const r=await request({url:'/boost-admin/benefits/rules'});if(!alive)return;levels.value=original.value=r.data.thresholds;const saved=JSON.parse(localStorage.getItem(storage())||'null');if(saved&&saved.adminId===Number(userStore.id)&&saved.memberId===props.member.id&&typeof saved.body?.requestKey==='string'){intent=saved;action.value=saved.body.action;note.value=saved.body.note;membershipType.value=saved.body.membershipType;expiresAt.value=saved.body.expiresAt;delta.value=saved.body.delta;error.value='上次操作结果未确认，请保持原内容点击确认，核对同一笔操作。'}ready.value=true}catch(e){if(alive)error.value=e.message}})
async function submit(kind){
 if(busy.value||!ready.value)return
 if(note.value.trim().length<2){error.value='请填写至少两个字的操作原因';return}
 const id=props.member.id,token=getToken(),body=kind==='rules'?{thresholds:levels.value,expectedThresholds:original.value,note:note.value}:{action:action.value,expectedRevision:props.member.benefitsRevision||0,note:note.value,membershipType:membershipType.value,expiresAt:expiresAt.value,delta:delta.value}
 const signature=JSON.stringify({...body,expectedRevision:undefined})
 if(kind==='member'&&intent&&intent.signature!==signature){error.value='上次操作结果未确认，请保留原内容重试核对';return}
 const data=kind==='member'?(intent?.body||{...body,requestKey:crypto.randomUUID()}):body
 busy.value=true;error.value=''
 try{await ElMessageBox.confirm(kind==='rules'?'新等级阈值会用于所有玩家，确认保存？':'确认更新此玩家的会员或成长资料？','确认操作');if(!alive||token!==getToken()||props.member.id!==id)return
  if(kind==='member'){intent={signature,body:data,adminId:Number(userStore.id),memberId:id};localStorage.setItem(storage(),JSON.stringify(intent))}
  await request({url:kind==='rules'?'/boost-admin/benefits/rules':'/boost-admin/benefits/'+id,method:kind==='rules'?'put':'post',data})
  if(!alive||token!==getToken())return
  if(kind==='member'){localStorage.removeItem(storage());intent=null}
  ElMessage.success('已保存');emit('saved')
 }catch(e){if(!alive||token!==getToken())return;const code=[e.response?.data?.code,e.response?.status,e.code].map(Number).find(Number.isFinite);if(kind==='member'&&code>=400&&code<500&&code!==401&&code!==429){localStorage.removeItem(storage());intent=null}if(e!=='cancel'&&e!=='close')error.value=e.message||'保存失败，请刷新核对后重试'}finally{busy.value=false}
}
const saveRules=()=>submit('rules'),saveMember=()=>submit('member')
</script>
<style scoped>.benefits-editor{margin-top:28px;padding-top:16px;border-top:1px solid #e5e7eb}.benefits-editor p{color:#64748b;line-height:1.7}.benefits-editor .el-form-item{margin-top:16px}</style>
