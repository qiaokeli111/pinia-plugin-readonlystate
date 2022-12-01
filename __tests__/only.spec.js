import { expect, test, beforeEach, describe, it } from 'vitest'
import { createApp, nextTick, ref,toRaw } from 'vue-demi'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import createReadonlyState from '../src/index'

beforeEach(() => {
  const app = createApp()
  const pinia = createPinia()
  let plugin = createReadonlyState()
  pinia.use(plugin)
  app.use(pinia)
  setActivePinia(pinia)
})
describe('option type', () => {
  const useStore = defineStore('user', {
    state: () => ({
      num: 0,
      info: { name: 'xxx', id: 'qqq' },
      cards: [2, 3]
    }),
    actions: {
      changeNum (num) {
        this.num = num
      },
      changeInfo (info) {
        this.info = info
      },
      changeCards (cards) {
        this.cards = cards
      },
      changeAll (num, info) {
        this.num = num
        this.info = info
      }
    }
  })

  it('change by action', async () => {
    const store = useStore()
    store.changeNum(66)
    expect(store.num).toBe(66)
  })
})
