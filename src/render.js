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
             el.addEventListener(key.splice(2), props[key])
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