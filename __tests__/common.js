import { expect, test, beforeEach, describe, it } from "vitest";
import { createApp, nextTick, ref, toRaw } from "vue-demi";
import { createPinia, defineStore, setActivePinia } from "pinia";
import createReadonlyState from "../src/index";

export var direct = (useStore) => {
  it("change direct in outside", async () => {
    const store = useStore();
    expect(store.num).toBe(0);
    expect(store.info.name).toBe("xxx");
    expect(store.cards.length).toBe(2);
    expect(store.cards).to.include.members([2, 3]);

    store.num = 3;
    await nextTick();
    expect(store.num).toBe(0);

    store.num++;
    await nextTick();
    expect(store.num).toBe(0);

    store.info.name = "sss";
    await nextTick();
    expect(store.info.name).toBe("xxx");

    store.cards[1] = 6;
    await nextTick();
    expect(store.cards).to.include.members([2, 3]);

    store.cards.length = 1;
    await nextTick();
    expect(store.cards.length).toBe(2);
  });
};

export var $patchObject = (useStore) => {
  it("change $patch object in outside", async () => {
    const store = useStore();
    expect(store.num).toBe(0);
    expect(store.info.name).toBe("xxx");

    store.$patch({
      num: 65,
    });
    await nextTick();
    expect(store.num).toBe(0);

    store.$patch({
      info: { name: "sss" },
    });
    await nextTick();
    expect(store.info.name).toBe("xxx");
    expect(store.info.id).toBe("qqq");

    store.$patch({
      cards: [4, 6],
    });
    await nextTick();
    expect(store.cards).to.include.members([2, 3]);
    expect(store.cards.length).toBe(2);
  });
};
export var $patchFunction = (useStore) => {
  it("change $patch function in outside", async () => {
    const store = useStore();
    expect(store.num).toBe(0);
    expect(store.info.name).toBe("xxx");

    store.$patch((state) => {
      state.nums = 34;
    });
    await nextTick();
    expect(store.num).toBe(0);

    store.$patch((state) => {
      state.info.name = "ggg";
    });
    await nextTick();
    expect(store.info.name).toBe("xxx");
    expect(store.info.id).toBe("qqq");

    store.$patch((state) => {
      state.info = { name: "sss" };
    });
    await nextTick();
    expect(store.info.name).toBe("xxx");
    expect(store.info.id).toBe("qqq");

    store.$patch((state) => {
      state.cards = [4, 6];
    });
    await nextTick();
    expect(store.cards).to.include.members([2, 3]);
    expect(store.cards.length).toBe(2);
  });
};
export var action = (useStore) => {
  it("change by action", async () => {
    const store = useStore();
    store.changeNum(66);
    expect(store.num).toBe(66);

    let info = store.info;
    info.name = "fff";
    store.changeInfo(info);
    expect(store.info.name).toBe("xxx");

    let rawInfo = { ...store.info };
    rawInfo.name = "fff";
    store.changeInfo(info);
    expect(store.info.name).toBe("xxx");

    
  });
};
