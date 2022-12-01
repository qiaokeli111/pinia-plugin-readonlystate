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
function commonFunction(useStore) {
  it('change direct in outside', async () => {
    const store = useStore()
    expect(store.num).toBe(0)
    expect(store.info.name).toBe('xxx')
    expect(store.cards.length).toBe(2)
    expect(store.cards).to.include.members([2, 3])

    store.num = 3
    await nextTick()
    expect(store.num).toBe(0)

    store.num++
    await nextTick()
    expect(store.num).toBe(0)

    store.info.name = 'sss'
    await nextTick()
    expect(store.info.name).toBe('xxx')

    store.cards[1] = 6
    await nextTick()
    expect(store.cards).to.include.members([2, 3])

    store.cards.length = 1
    await nextTick()
    expect(store.cards.length).toBe(2)
  })

  it('change $patch object in outside', async () => {
    const store = useStore()
    expect(store.num).toBe(0)
    expect(store.info.name).toBe('xxx')

    store.$patch({
      num: 65
    })
    await nextTick()
    expect(store.num).toBe(65)

    store.$patch({
      info: { name: 'sss' }
    })
    await nextTick()
    expect(store.info.name).toBe('sss')
    expect(store.info.id).toBe('qqq')

    store.$patch({
      cards: [4, 6]
    })
    await nextTick()
    expect(store.cards).to.include.members([4, 6])
    expect(store.cards.length).toBe(2)
  })

  it('change $patch function in outside', async () => {
    const store = useStore()
    expect(store.num).toBe(0)
    expect(store.info.name).toBe('xxx')

    store.$patch(state => {
      state.num = 34
    })
    await nextTick()
    expect(store.num).toBe(34)

    store.$patch(state => {
      state.info.name = 'ggg'
    })
    await nextTick()
    expect(store.info.name).toBe('ggg')
    expect(store.info.id).toBe('qqq')

    store.$patch(state => {
      state.info = { name: 'sss' }
    })
    await nextTick()
    expect(store.info.name).toBe('sss')
    expect(store.info.id).toBe(undefined)

    store.$patch(state => {
      state.cards = [4, 6]
    })
    await nextTick()
    expect(store.cards).to.include.members([4, 6])
    expect(store.cards.length).toBe(2)
  })

  it('change by action', async () => {
    const store = useStore()
    store.changeNum(66)
    expect(store.num).toBe(66)

    let info = store.info
    info.name = 'fff'
    store.changeInfo(info)
    expect(store.info.name).toBe('xxx')

    let rawInfo = {...store.info}
    rawInfo.name = 'fff'
    store.changeInfo(info)
    expect(store.info.name).toBe('xxx')
  })
}
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
  commonFunction(useStore)
  it('change by action', async () => {
    const store = useStore()

    store.$reset()
    expect(store.num).toBe(0);
    expect(store.info.name).toBe("xxx");
    expect(store.cards).to.include.members([2, 3]);
    expect(store.cards.length).toBe(2);
  })
})
describe('setup type', () => {
  const useStore = defineStore("user", () => {
    var num = ref(0);
    var info = ref({ name: "xxx", id: "qqq" });
    var cards = ref([2, 3]);
    function changeNum(num1) {
      num.value = num1;
    }
    function changeInfo(info1) {
      info.value = info1;
    }
    function changeCards(cards1) {
      cards.value = cards1;
    }
    function changeAll(num1, info1) {
      num.value = num;
      info.value = info;
    }
    return { num, info, cards, changeNum, changeInfo, changeCards, changeAll };
  });
  commonFunction(useStore)
})