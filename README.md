#### 为什么要写这个插件
在用pinia的时候发现官方文档说明了可以在外部直接修改store的数据，这就导致数据变化难以追踪，
尤其是在改造vben的时候，非常痛苦感觉回到了全局变量直接挂载window的时代

去网上搜索了下，在pinia的[issue](https://github.com/vuejs/pinia/issues/58 "issue")里也有不少人提出了这个问题
总结下有以下几点
- 作者解答为什么这么设计： 

  -  认为这个问题是linter来处理
  - 如果在pinia处理会增加代码量，使其运行变慢
  
- 开发者提出的解决方案：

  - 写一个linter来处理（然而没人提供现成的）
  - 使用ts的reandonly(然而项目不用ts，而且无法强制约束别的开发者定义类型为readonly)
  - 使用setup写法在state导出时使用vue3的readonly包裹（这个方案我比较推荐，代码可以去issue看，但是也有2个问题）
  
     - pinia一定要使用setup写法，原来用的option写法需要改造
	 -  我的全局缓存插件pinia-plugin-persistedstate用不了了
	 
感觉没有特别合适的方案，我想不动代码就能实现这个功能，并且全局缓存插件还能使用，所以我基于vue3的readonly来完成了这个插件
#### 如何使用
```javascript
// 安装一下
 npm install -D pinia-plugin-readonlystate

// 在main.js
import { createPinia } from 'pinia'
import piniaPluginReadonlystate from 'pinia-plugin-readonlystate'

const pinia = createPinia()
// 如果要使用pinia-plugin-persistedstate，需要在此插件前面执行
pinia.use(piniaPluginReadonlystate())
```
#### 配置
- 默认外部可以使用$patch方法来修改store可以在初始化插件的时候修改此操作
```javascript
  let plugin = createReadonlyState({disablePatch:true})
  pinia.use(plugin)
```