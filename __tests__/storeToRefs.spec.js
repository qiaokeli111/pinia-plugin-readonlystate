import { expect, test, beforeEach, describe, it } from 'vitest'
import { createApp, nextTick, ref,toRaw } from 'vue-demi'
import { createPinia, defineStore, setActivePinia,storeToRefs } from 'pinia'
import createReadonlyState from '../src/index'

beforeEach(() => {
  const app = createApp()
  const pinia = createPinia()
  let plugin = createReadonlyState({disablePatch:true})
  pinia.use(plugin)
  app.use(pinia)
  setActivePinia(pinia)
})
function commonFunction(useStore) {
  it('change direct in outside', async () => {
    const store = useStore()
    let {num,info,cards} = storeToRefs(store)
    expect(num.value).toBe(0)
    expect(info.value.name).toBe('xxx')
    expect(cards.value.length).toBe(2)
    expect(cards.value).to.include.members([2, 3])

    num.value = 3
    await nextTick()
    expect(store.num).toBe(0)

    num.value++
    await nextTick()
    expect(store.num).toBe(0)

    info.value.name = 'sss'
    await nextTick()
    expect(store.info.name).toBe('xxx')

    cards.value[1] = 6
    await nextTick()
    expect(store.cards).to.include.members([2, 3])

    cards.value.length = 1
    await nextTick()
    expect(store.cards.length).toBe(2)
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

