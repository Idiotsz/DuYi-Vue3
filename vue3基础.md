[toc]
https://v3.vuejs.org
# 构建工具 vite
- vue3依然可以使用vue-cli来构建，但是使用vite构建开发速度更快
```
$ npm init vite-app <project-name>
$ cd <project-name>
$ npm install
$ npm run dev
```
- vite使用注意
> 1. 引入单文件组件，不能省略.vue 后缀名
> 2. 开发必须要在现代版本浏览器，要支持 es Module

- vite为什么这么快，与webpack区别
>
> 1. webpack会先打包，然后启动开发服务器，请求服务器时直接给予打包结果。
> 而vite是直接启动开发服务器，请求哪个模块再对该模块进行实时编译。
> 2. 由于现代浏览器本身就支持ES Module，会自动向依赖的Module发出请求。vite充分利用这一点，将开发环境下的模块文件，就作为浏览器要执行的文件，而不是像webpack那样进行打包合并。因此开发要在现代浏览器开发，老版本不兼容 es Module
> 3. 由于vite在启动的时候不需要打包，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。当浏览器请求某个模块时，再根据需要对模块内容进行编译。这种按需动态编译的方式，极大的缩减了编译时间，项目越复杂、模块越多，vite的优势越明显。
> 4. 在HMR方面，当改动了一个模块后，仅需让浏览器重新请求该模块即可，不像webpack那样需要把该模块的相关依赖模块全部编译一次，效率更高。
> 5. 当需要打包到生产环境时，vite使用传统的rollup进行打包，因此，vite的主要优势在开发阶段。另外，由于vite利用的是ES Module，因此在代码中不可以使用CommonJS

# vue挂载
> vue3 取消了构造函数Vue, 没有了Vue.use, new Vue({}).$mount，而要通过createApp来创建vue应用，并使用其应用方法来使用插件，组件等。
> 更多vue应用的api：https://v3.vuejs.org/api/application-api.html

```js
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App).use(router).mount('#app')
```
- 为什么vue3要取消Vue构造函数？
> 1. 在过去，如果遇到一个页面有多个`vue`应用时，往往会遇到一些问题，因为使用同一个构造函数，重复生成的实例会受影响

```html
<!-- vue2 -->
<div id="app1"></div>
<div id="app2"></div>
<script>
  Vue.use(...); // 此代码会影响所有的vue应用
  Vue.mixin(...); // 此代码会影响所有的vue应用
  Vue.component(...); // 此代码会影响所有的vue应用
                
	new Vue({
    // 配置
  }).$mount("#app1")
  
  new Vue({
    // 配置
  }).$mount("#app2")
</script>
```
> 2. 在`vue3`中，去掉了`Vue`构造函数，转而使用`createApp`创建`vue`应用， 每一个vue应用都是独立的。

```html
<!-- vue3 -->
<div id="app1"></div>
<div id="app2"></div>
<script>  
	createApp(根组件).use(...).mixin(...).component(...).mount("#app1")
  createApp(根组件).mount("#app2")
</script>
```
> 3. 方法通过 import {h} from 'vue' ,从vue中导入，利于tree shaking

# tempate变化
## v-model和 .sync修饰符
`vue2`比较让人诟病的一点就是提供了两种双向绑定：`v-model`和`.sync`，在`vue3`中，去掉了`.sync`修饰符，只需要使用`v-model`进行双向绑定即可。

为了让`v-model`更好的针对多个属性进行双向绑定，`vue3`作出了以下修改，使组件支持多个v-model

1. 当对自定义组件使用`v-model`指令时，绑定的属性名由原来的`value`变为`modelValue`，事件名由原来的`input`变为`update:modelValue`

  ```html
  <!-- vue2 -->
  <ChildComponent :value="pageTitle" @input="pageTitle = $event" />
  <!-- 简写为 -->
  <ChildComponent v-model="pageTitle" />

  <!-- vue3 -->
  <ChildComponent
    :modelValue="pageTitle"
    @update:modelValue="pageTitle = $event"
  />
  <!-- 简写为 -->
  <ChildComponent v-model="pageTitle" />
  ```

2. 去掉了`.sync`修饰符，它原本的功能由`v-model`的参数替代

  ```html
  <!-- vue2 -->
  <ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
  <!-- 简写为 -->
  <ChildComponent :title.sync="pageTitle" />

  <!-- vue3 -->
  <ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
  <!-- 简写为 -->
  <ChildComponent v-model:title="pageTitle" />
  ```

3. `model`配置被移除（配置默认的事件属性名），vue3用不到了

4. 允许自定义`v-model`修饰符,组件会接受一个参数 xxxModifiers
```html
<ChildComponent v-model:title.trim="pageTitle" />
```
```js
// childComponent
export default {
  props:{
    title: String, // v-model 值
    titleModifiers: () => ({}), // 固定的值 xxxModifiers, 组件自动将修饰符信息传入该值。拿到修饰符的值，自行处理逻辑
  },
  setup(props, ctx) {
    console.log(props.titleModifiers); //  {trim: true}

  }

}

```

## v-if v-for
`v-if` 的优先级 现在高于 `v-for`
```html
<template>
  <div v-for="item in list" v-if="item.show"></div>
</template>
```
现在这样写会直接报错，因为会先执行v-if。

## key

- 当使用`<template>`进行`v-for`循环时，需要把`key`值放到`<template>`中，而不是它的子元素中

- 当使用`v-if v-else-if v-else`分支的时候，不再需要指定`key`值，因为`vue3`会自动给予每个分支一个唯一的`key`

  即便要手工给予`key`值，也必须给予每个分支唯一的`key`，**不能因为要重用分支而给予相同的 key**

## Fragment

`vue3`现在允许组件出现多个根节点

# 组件
## defineAsyncComponent 异步组件
> Global Api 创建异步组件，仅在组件被使用时才加载
- defineAsyncComponent 接受一个函数为参数，该函数返回一个promise
```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```
- defineAsyncComponent 通常除了传一个函数，也可以传入一个对象来配置

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent({
  // The factory function
  loader: () => import('./Foo.vue')
  // 异步组件加载时使用的组件
  loadingComponent: LoadingComponent,
  // A component to use if the load fails 加载失败时使用的组件
  errorComponent: ErrorComponent,
  // Delay before showing the loading component. Default: 200ms. 
  // 显示加载组件之前的延迟。默认值：200ms
  delay: 200,
  // The error component will be displayed if a timeout is provided and exceeded. Default: Infinity.
  // 如果设置了timeout, 并加载超时了，则将显示错误组件。默认值：无穷大。
  timeout: 3000,
  // Defining if component is suspensible. Default: true.
  suspensible: false,
  /**
   *
   * @param {*} error Error message object
   * @param {*} retry A function that indicating whether the async component should retry when the loader promise rejects
   * @param {*} fail  End of failure
   * @param {*} attempts Maximum allowed retries number
   */
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/) && attempts <= 3) {
      // retry on fetch errors, 3 max attempts
      retry()
    } else {
      // Note that retry/fail are like resolve/reject of a promise:
      // one of them must be called for the error handling to continue.
      fail()
    }
  },
})

```

# Reactivity API
> vue3 暴露给用户自主创建响应式数据的api，除了这些api，完全脱离其他依赖

```js
import {
  ref, // 给定默认数据，返回ref对象，-----给任何数据   1.给原始值，就使用访问器get(), set();2.给对象，如果是代理，使用代理，如果不是代理，内部调用reactive
  reactive, // 给定默认数据，返回可读写的代理----只能给对象
  readonly, // 给定默认数据，返回只读的代理-----只能给对象
  toRef, // 根据reactive对象，生成并返回该对象某一响应属性
  toRefs, // 把reactive对象的每一个值全转成ref对象。使用场景：解构reactive对象后的值，并不具备相应性，但是toRefs后，再解构，每个都变成ref对象了，具备响应性了
  watchEffect, // 函数依赖的值变化后就执行，并且立即执行函数体内容（同步代码，会立即执行）
  watch, // 监听
} from "vue";

const state = reactive({
  name: 'song',
  age: {
    realAge: 19
  }
});
window.state = state;
let nameRef = toRef(state, 'name');
let stateRef = toRefs(state);
console.log('state: ', state);
console.log('stateRef: ', stateRef);
watchEffect(() => {
  // 依赖变动，自动执行 非computed 非watch。
  // 同步代码，首次会自动执行
  console.log(nameRef.value, "----------stateRef.name")
})

watch(
  () => stateRef.name.value,
  (n, o) => {
    // console.log(n, o, '-----watch change')
  },
  {
    immediate: true
  }
)
```

# composition Api
## setup 函数
> 1.在组件created之前，props被加载之后就会调用setup 函数，该函数return 的东西可以在模板被直接使用。可以返回数据或者方法。

> 2. setup 的出现，让项目的最小颗粒度更细致，vue2 以component为基础，而vue3 可以以每一个composition 为基础
```html
<!-- MyBook.vue -->
<template>
  <div>{{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue'
  const useBooks = () => {
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3 Guide' })
    return {
      readersNumber,
      book
    }
  }
  export default {
    setup() {
      // expose to template
      return {
        ...useBooks()
      }
    }
  }
</script>

```
## 生命周期钩子
```js
import { onMounted, onUpdated, onUnmounted } from 'vue'

const MyComponent = {
  setup() {
    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  }
}
```

## provide/inject
- provide/inject 支持vue2使用方法 
- 同时增加在setup 函数中使用，和直接在vue 应用实例上使用
1. 在app应用实例中使用
```js
import {createApp , provide , inject, readonly, reactive} from "vue"
const key = Symbol(); // Provide的key

const app = createApp(App);

let state = reactive({})

export function provideStore(app) => {
  app.provide(key, {
    state: readonly(state), // 对外只读
  })
}
export function useStore(defaultValue = null) {
  return inject(key, defaultValue);
}

provideStore(app);

app.mount("#app");

```
2. setup中使用
```html
<template>
  <div>{{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive,readonly, provide, inject } from 'vue'

  export default {
    setup() {
      // expose to template
      const userObj = reactive({});

      provide('userObj', readonly(userObj));

      let headerHeight = inject('headerHeight');

      return {
        headerHeight
      }
    }
  }
</script>
```

