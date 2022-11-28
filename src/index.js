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
    Object.assign(store, toRefs(readonlyState))

    function patchActionForGrouping (actionNames) {
      // original actions of the store as they are given by pinia. We are going to override them
      const actions = actionNames.reduce((storeActions, actionName) => {
        // use toRaw to avoid tracking #541
        storeActions[actionName] = toRaw(store)[actionName]
        return storeActions
      }, {})
      for (const actionName in actions) {
        store[actionName] = function () {
          Object.assign(store, toRefs(originState))
          let result = actions[actionName].apply(store, arguments)
          Object.assign(store, toRefs(readonlyState))
          return result
        }
      }
    }
    //   devtoolsPlugin
    patchActionForGrouping(Object.keys(options.actions))

    store.$subscribe((mutation, state) => {
      console.log(345, state)
      // 响应 store 变化
    })
  }
}
