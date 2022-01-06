function createApp(rootComponent){
   return {
       mount(selector){
           const el = document.querySelector(selector)
           let oldVnode = null
           let isMount = false
           watchEffect(() => {
                if(!isMount){
                    oldVnode = rootComponent.render()
                    mount(oldVnode,el)
                    isMount = true
                }else{
                    const newVnode = rootComponent.render()
                    patch(oldVnode,newVnode)
                    oldVnode = newVnode
                }
           })
       }
   }
}