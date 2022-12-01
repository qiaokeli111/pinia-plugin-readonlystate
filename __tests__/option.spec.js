import { expect, test, beforeEach, describe, it } from "vitest";
import { createApp, nextTick, ref, toRaw } from "vue-demi";
import { createPinia, defineStore, setActivePinia } from "pinia";
import createReadonlyState from "../src/index";
import { direct, $patchObject, $patchFunction, action } from "./common";

beforeEach(() => {
  const app = createApp();
  const pinia = createPinia();
  let plugin = createReadonlyState({ disablePatch: true });
  pinia.use(plugin);
  app.use(pinia);
  setActivePinia(pinia);
});
describe("option type", () => {
  const useStore = defineStore("user", {
    state: () => ({
      num: 0,
      info: { name: "xxx", id: "qqq" },
      cards: [2, 3],
    }),
    actions: {
      changeNum(num) {
        this.num = num;
      },
      changeInfo(info) {
        this.info = info;
      },
      changeCards(cards) {
        this.cards = cards;
      },
      changeAll(num, info) {
        this.num = num;
        this.info = info;
      },
    },
  });

  direct(useStore);
  $patchObject(useStore);
  $patchFunction(useStore);
  action(useStore);
});
