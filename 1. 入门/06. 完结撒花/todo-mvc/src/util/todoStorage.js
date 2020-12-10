const LOCAL_KEY = "todomvc";

/**
 * 生成一个任务的唯一编号，时间戳+4位随机数
 */
export function generateId() {
  return Date.now() + Math.random().toString(16).substr(2, 4);
}

/**
 * 获取目前所有的任务
 */
export function fetch() {
  const result = localStorage.getItem(LOCAL_KEY);
  if (result) {
    return JSON.parse(result);
  }
  return [];
}

/**
 * 保存所有任务
 * @param {*} todos 任务列表
 */
export function save(todos) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(todos));
}

export function filter(todos, visibility = "all") {
  if (visibility === "all") {
    return todos;
  } else if (visibility === "active") {
    return todos.filter((it) => !it.completed);
  } else if (visibility === "completed") {
    return todos.filter((it) => it.completed);
  }
  throw new Error("invalid visibility value");
}
import { 
  ref, // 给定默认数据，返回ref对象，-----给任何数据   1.给原始值，就使用访问器get(), set();2.给对象，如果是代理，使用代理，如果不是代理，内部调用reactive
  reactive, // 给定默认数据，返回可读写的代理----只能给对象
  readonly, // 给定默认数据，返回只读的代理-----只能给对象
  toRef, // 根据reactive对象，生成并返回该对象某一相应属性
  toRefs, // 把reactive对象的每一个值全转成ref对象。使用场景：结构reactive对象后的值，并不具备相应性，但是toRefs后，再结构，每个都变成ref对象了，具备响应性了
  watchEffect, // 函数依赖的值变化后就执行，并且立即执行函数体内容
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