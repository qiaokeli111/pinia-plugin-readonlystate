import { expect, test, beforeEach, describe, it } from "vitest";
import { createApp, nextTick, ref, reative } from "vue-demi";
import { createPinia, defineStore, setActivePinia } from "pinia";
import createReadonlyState from "../src/index";
import { direct, $patchObject, $patchFunction, action } from "./common";

beforeEach(() => {
  const app = createApp({});
  const pinia = createPinia();
  let plugin = createReadonlyState({ disablePatch: true });
  pinia.use(plugin);
  app.use(pinia);
  setActivePinia(pinia);
});
describe("option type", () => {
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
  direct(useStore);
  $patchObject(useStore);
  $patchFunction(useStore);
  action(useStore);
});
