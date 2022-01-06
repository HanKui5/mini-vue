class Dep {
    constructor() {
        this.subscribe = new Set()
    }
    addEffect(effect) {
        this.subscribe.add(effect)
    }
    depend() {
        if (activeEffect) {
            this.subscribe.add(activeEffect)
        }
    }
    notify() {
        this.subscribe.forEach(effect => {
            effect()
        })
    }
}



// const dep = new Dep()
const targetMap = new WeakMap()
function getDep(target, key) {
    let depMap = targetMap.get(target);
    if (!depMap) {
        depMap = new Map()
        targetMap.set(target, depMap)
    }

    let dep = depMap.get(key)
    if (!dep) {
        dep = new Dep()
        depMap.set(key, dep)
    }
    return dep
}

 /**
  * vue2 实现响应式
  * @param {*} raw 
  * @returns 
  */
// function reactive(raw) {
//     Object.keys(raw).forEach(key => {
//         const dep = getDep(raw, key)
//         value = raw[key]
//         Object.defineProperty(raw, key, {
//             get() {
//                 dep.depend()
//                 return value
//             },
//             set(newValue) {
//                 if (newValue !== value) {
//                     value = newValue
//                     dep.notify()
//                 }
//             }
//         })
//     })
//     return raw
// }

function reactive(raw) {
   const proxy = new Proxy(raw, {
       get(target,key){
           const dep = getDep(target, key)
           dep.depend()
           return target[key]
       },
       set(target, key, newValue){
           const dep = getDep(target, key)
           target[key] = newValue
           dep.notify()
       }
   })
   return proxy
}


let activeEffect = null
const watchEffect = function (effect) {
    activeEffect = effect
    // dep.depend()
    effect()
    activeEffect = null
};



// const info = reactive({
//     num: 2,
//     age: 18
// })

// const height = reactive({
//     number: 15
// })

// watchEffect(function doubelNum() {
//     console.log(info.num + info.age)
// })

// watchEffect(function squareNum() {
//     console.log(info.num + 3)
// })

// watchEffect(function threeNum() {
//     console.log(height.number)
// })

