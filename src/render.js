// h函数调用生产虚拟dom
/**
 * 
 * @param {} tag  标签
 * @param {} props  属性
 * @param {} children  子节点
 * @returns 
 */
const h =(tag,props,children) => {
   return {
    tag,
    props,
    children
   }
}

/**
 * 
 * @param {} vNode 虚拟dom
 * @param {} container 挂载节点
 */
const mount = (vNode,container) => {
    // 创建元素
     const el = vNode.el = document.createElement(vNode.tag)

    //设置属性
    const props = vNode.props
    for(const key in props){
        if(key.startsWith('on')){
             el.addEventListener(key.splice(2).toLowerCase(), props[key])
        }else{
            el.setAttribute(key,props[key])
        }
    }
    

    // 设置子节点
    if(typeof vNode.children === 'string'){
       el.textContent = vNode.children
    }else{
        if(vNode.children.length){
            vNode.children.forEach(item => {
                mount(item,el)
            })
        }
    }
  
    // 将生产的元素渲染到节点
    container.appendChild(el)
}


/**
 * 
 * @param {*} node1 旧节点
 * @param {*} node2 新节点
 */
const patch = (node1,node2) => {
    //获取旧的dom并赋值到新的vNode属性上
   const el = node2.el =  node1.el

   // 处理tag
   //实际上的源码 vNode上的tag不同或者key不同都会删除旧的dom重新添加新的dom
   if(node1.tag !== node2.tag){
     const parentElement = el.parentElement
     parentElement.removeChild(el)
     mount(node2,parentElement)
   }else{
       //处理 props
       const newProps = node2.props || {}
       const oldProps = node1.props || {}

       //将新的props挂载到el上
        for (const key in newProps) {
            const oldValue = oldProps[key]
            const newValue = newProps[key]
            if(oldValue !== newValue){
                if(key.startsWith('on')){
                    el.addEventListener(key.splice(2).toLowerCase(), newValue)
                }else{
                    el.setAttribute(key,newValue)
                }
               
            }
        }

        //将旧的props删除
        for (const key in oldProps) {
            if(!(key in newProps)){
               if(key.startsWith('on')){
                  el.removeEventListener(key.splice(2).toLowerCase(),oldProps[key])
               }else{
                   el.removeAttribute(key)
               }
            }
        }

        //处理children
        const newChildren = node2.children || []
        const oldChildren = node1.children || []

        // 新vNode的children为字符串
        if(typeof newChildren === 'string'){
            if(typeof oldChildren === 'string'){
                el.textContent = newChildren
            }else{
                el.innerHTML = newChildren
            }
        }else{
            //新vNode的children为数组
            if(typeof oldChildren === 'string'){
                el.innerHTML = ''
                newChildren.forEach(item => {
                    mount(item,el)
                })
            }else{
                //oldChildren [a, b, c]
                //newChildren [a, b, c,d]
                const commonLength = Math.min(newChildren.length,oldChildren.length)
                for (let index = 0; index < commonLength; index++) {
                    patch(oldChildren[index], newChildren[index])
                }
                //newChildren长度 > oldChildren长度
                if(newChildren.length > oldChildren.length){
                    newChildren.splice(commonLength).forEach(item => {
                        mount(item,el)
                    })
                }
                 //newChildren长度 < oldChildren长度
                if(newChildren.length < oldChildren.length){
                    oldChildren.splice(commonLength).forEach(item => {
                        el.removeChild(item.el)
                    })
                }
            }
        }
   }
}