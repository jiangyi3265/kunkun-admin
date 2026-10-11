import vue from 'eslint-plugin-vue'
import globals from 'globals'
export default [
 {ignores:['dist/**','node_modules/**']},
 ...vue.configs['flat/essential'],
 {files:['src/**/*.vue','src/**/*.js','vite/**/*.js','vite.config.js'],languageOptions:{ecmaVersion:2022,sourceType:'module',globals:{...globals.browser,...globals.node,defineStore:'readonly',ref:'readonly',reactive:'readonly',computed:'readonly',watch:'readonly',onMounted:'readonly',getCurrentInstance:'readonly',nextTick:'readonly',toRefs:'readonly',onBeforeUnmount:'readonly',onUnmounted:'readonly',useRoute:'readonly',useRouter:'readonly',defineEmits:'readonly',defineProps:'readonly',defineExpose:'readonly'}},rules:{'no-undef':'error','no-unreachable':'error','no-dupe-keys':'error','no-constant-binary-expression':'error','vue/multi-word-component-names':'off'}}
]
