import { readonly, toRefs, toRaw } from 'vue-demi'
export default (config={}) => {
  let disablePatch = config.disablePatch
  return ({ store, app, pinia, options }) => {
    let $id = store.$id

    var originState = pinia.state.value[$id]
    var readonlyState = readonly(pinia.state.value[$id])
    if (disablePatch) {
        pinia.state.value[$id] = readonlyState
    }
    const trackedStore = new Proxy(store, {
      get(target, key, receiver) {
        if (key in originState) {
          return readonlyState[key]
        }else if(key === "__v_raw"){
          return Object.assign({},store, toRefs(readonlyState))
        } else{
          return target[key]
        }
      },
      set(target, key, receiver) {
        if (key in originState) {
          return Reflect.set(readonlyState, key)
        }
        return Reflect.set(target, key, receiver)
      },
    })

    function patchActionForGrouping (actionNames) {
      // original actions of the store as they are given by pinia. We are going to override them
      const actions = actionNames.reduce((storeActions, actionName) => {
        // use toRaw to avoid tracking #541
        storeActions[actionName] = toRaw(store)[actionName]
        return storeActions
      }, {})
      for (const actionName in actions) {
        store[actionName] = function () {
          return actions[actionName].apply(store, arguments)
        }
      }
    }
    //   devtoolsPlugin
    patchActionForGrouping(Object.keys(options.actions))

    pinia._s.set($id, trackedStore)
  }
}
