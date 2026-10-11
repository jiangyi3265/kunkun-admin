import fs from 'node:fs'
import path from 'path'

export default function createSvgIcon() {
  const root=path.resolve(process.cwd(),'src/assets/icons/svg'),id='virtual:svg-icons-register'
  return {name:'local-svg-icons',resolveId(source){if(source===id)return '\0'+id},load(source){
    if(source!=='\0'+id)return
    const symbols=[]
    function visit(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())visit.call(this,file);else if(item.name.endsWith('.svg')){this.addWatchFile(file);const name=path.relative(root,file).replace(/\\/g,'-').replace(/\.svg$/,'');const svg=fs.readFileSync(file,'utf8').replace(/<\?xml[\s\S]*?\?>|<!DOCTYPE[\s\S]*?>/g,'').replace(/<svg\b([^>]*)>/,(_,attrs)=>`<symbol id="icon-${name}"${attrs.replace(/\s(?:width|height|id)="[^"]*"/g,'')}>`).replace(/<\/svg>/g,'</symbol>');symbols.push(svg)}}}
    visit.call(this,root)
    return `const node=document.createElementNS('http://www.w3.org/2000/svg','svg');node.id='__svg__icons__dom__';node.style.display='none';node.innerHTML=${JSON.stringify(symbols.join(''))};if(!document.getElementById(node.id))document.body.prepend(node);`
  }}
}
