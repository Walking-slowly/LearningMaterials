# <p align="center">前端面试题<p>

### 深复制
> js里面数据类型有基本数据类型和引用数据类型，基本数据类型被计算机储存在栈内存里面，引用数据类型被存在堆内存里面，引用类型栈里面只是储存的该值在堆内存中的地址，所以如果不是深复制，复制的只是那个地址，两个指向的还是同一个值。

```js
    var a = { a : 1 }
    var b = JSON.parse(JSON.stringify(a))
```

### vue组件之间传参
##### 1 . **props** 和 **$emit**

> **props**用于父组件向子组件之间传值，**$emit**用于子组件向父组件传值
```js
    // 父组件
    <template>
        <children v-bind="aaa" @abc="ccc"/>
    </template>
    <script>
        export default {
            data() {
                return {
                    aaa: {
                        b: [1,2,3],
                        c: 3
                    }
                }
            },
            methods： {
                ccc(res) {
                    console.log(res);
                }
            }
        }
    </script>
    // 子组件
    <script>
        export default {
            props: {
                a: {
                    type: Array,
                    default: null
                },
                b: {
                    type: Number,
                    default: null
                }
            },
            methods： {
                aaa() {
                    this.$emit('abc', 2)
                }
            }
        }
    </script>
```


##### 2 . **$children** 和 **$parent**
> 打印**this**会返回当前的vue实例，而 **$children** 和 **$parent**就是当前组件的子组件和父组件的实例，也能通过这样的方式去访问属性和方法

##### 3 . 中央事件总线
> 这个方法其实就是创建一个空的vue实例，然后挂载到全局，用于非父子组件之间传值
```js
    // 创建空的vue实例
    const EventBus = new Vue();
    // 挂载到vue的原型对象上面或者在需要使用的组件中引入
    Vue.prototype.bus = EventBus;

    // 然后在需要传值的组件中
    this.bus.$emit('方法名', '值')
    // 接收
    this.bus.$on('方法名', res=> {
        console.log(res);
    })
```

##### 4 . vuex
> 如果页面太多，很多页面需要用到，或者嵌套太多，太复杂，我觉得就可以使用vuex状态管理去储存数据，在传值的界面触发**actions**或者**mutations**更改数据，在接收的页面去获取。

##### 5 . **provider** 和 **inject**
> 和props方法差不多，不过这个不管嵌套多少层都可以，一样是父组件向子组件传值
```js
    // 在父组件中注入变量，把需要传的参数写入
    provide: {
      a: 1,
      b: '2'
    },

    // 在子组件中接收
    inject: ['a', 'b'],    
```

### 闭包
##### 闭包的特性
> 1. 函数嵌套函数
> 2. 可以访问函数内部变量
> 3. 变量一直被引用不被垃圾回收机制给清掉
```js
    function a () {
        var a1 = 1;
        return function b () {
            console.log(a1);
        }
    }

    var c = a();
    c() // 1
```
> 由于闭包的特性造成数据一直被引用不被清掉，所以一直占用内存，会很消耗内存
