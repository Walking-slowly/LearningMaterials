var target = null; // 声明一个全局容器，用来存放watcher
// mvvm 入口函数
var Mvc = /** @class */ (function () {
    function Mvc(mvnData) {
        this.$mvc = this;
        this.data = mvnData.data;
        this.methods = mvnData.methods;
        new Observer(mvnData.data).init();
        new Compile(this.$mvc, mvnData.el).init();
    }
    return Mvc;
}());
// 数据劫持，Dep收集改变属性
var Observer = /** @class */ (function () {
    function Observer(data) {
        this.datas = data;
    }
    Observer.prototype.init = function () {
        if (typeof this.datas !== 'object')
            return;
        for (var key in this.datas) {
            this.defineProprety(this.datas, key, this.datas[key]);
        }
    };
    // 给每一个子属性绑定set/get
    Observer.prototype.defineProprety = function (data, key, val) {
        new Observer(val).init(); // 遍历子属性
        var dep = new Dep();
        Object.defineProperty(data, // 对象
        key, // 属性名
        {
            enumerable: true,
            // configurable: true,
            set: function (newVal) {
                console.log('set', val, newVal);
                val = newVal; // 当属性被修改时触发
                dep.notify(); // 数据变化通知所有订阅者
            },
            get: function () {
                console.log('get', target);
                target && dep.addSub(target); // 订阅者初始化添加自己到消息订阅器中
                return val;
            }
        } // 属性描述符 -- 存取描述符
        );
    };
    return Observer;
}());
// compile 模板指令解析 
var Compile = /** @class */ (function () {
    function Compile($mvc, el) {
        this.$mvc = $mvc;
        this.ele = document.querySelector(el); // 获取DOM
        this.fragment = document.createDocumentFragment(); // 创建虚拟文档节点
    }
    Compile.prototype.init = function () {
        this.clonefragment();
    };
    // 将DOM拷贝到虚拟文档
    Compile.prototype.clonefragment = function () {
        var _this = this;
        var childrens = this.ele.children;
        Array.prototype.slice.call(childrens).forEach(function (children) {
            _this.fragment.appendChild(children);
        }); // 循环子节点写入虚拟文档
        this.compileText(this.fragment); // 在虚拟文档中处理操作
        this.ele.appendChild(this.fragment); // 完成后重新写入真实DOM
    };
    // 在文档碎片中处理DOM文本
    Compile.prototype.compileText = function (html) {
        var _this = this;
        //循环html找出 文本节点 和 元素节点
        html.childNodes.forEach(function (node) {
            var text = node.textContent, reg = /\{\{(.*?)\}\}/g; //获取所有文本节点  文本规则
            if (node.nodeType === 3 && reg.test(text)) { // 去掉空文本
                _this.replaceText(node, RegExp.$1.trim());
            }
            else if (node.nodeType === 1) {
                _this.replaceCompile(node);
            }
            if (node.childNodes && node.childNodes.length > 0) {
                _this.compileText(node);
            }
        });
    };
    // 替换text
    Compile.prototype.replaceText = function (node, reg) {
        node.textContent = this.$mvc.data[reg];
        new Watcher(this.$mvc, this.$mvc.data[reg], reg, function (value) {
            node.textContent = value;
            console.log('222', value);
        });
    };
    // 指令编译
    Compile.prototype.replaceCompile = function (node) {
        var _this = this;
        var attrs = node.attributes;
        Array.prototype.slice.call(attrs).forEach(function (attr) {
            var self = _this;
            // 规则 v-ssss
            if (/[v\-]{2}/.test(attr.name)) {
                if (/[v\-on\:]{5}/.test(attr.name)) { // v-on:click
                    var method = self.$mvc.methods[attr.value];
                    node.addEventListener(attr.name.slice(5), method.bind(self.$mvc), false);
                }
                else {
                    if (attr.value === '')
                        return;
                    _this[attr.name.slice(2)] && _this[attr.name.slice(2)](node, _this.$mvc.data[attr.value], attr.value);
                }
                node.removeAttribute(attr.name); // 删除自定义
            }
            // 规则 事件指令@click
            else if (/[\@]/.test(attr.name)) {
                var method = self.$mvc.methods[attr.value];
                node.addEventListener(attr.name.slice(1), method.bind(self.$mvc), false);
                node.removeAttribute(attr.name); // 删除自定义
            }
        });
    };
    // 指令集合
    Compile.prototype.html = function (node, res) {
        node.innerHTML = res;
    };
    Compile.prototype.text = function (node, res) {
        node.innerText = res;
    };
    Compile.prototype.model = function (node, res, path) {
        var self = this;
        node.value = res;
        node.addEventListener('input', function (e) {
            self.$mvc.data[path] = e.target.value; // 触发该属性的set/get
        }, false);
        new Watcher(self.$mvc, res, path, function (value) {
            node.value = value;
            console.log('111', value);
        }); // 执行初始化
    };
    return Compile;
}());
// 订阅者 watcher
var Watcher = /** @class */ (function () {
    function Watcher(vm, exp, path, cb) {
        this.cb = cb; // 更新视图函数
        this.vm = vm;
        this.exp = exp;
        this.path = path;
        this.value = this.get(); // 初始化添加自己到消息订阅器中
    }
    Watcher.prototype.update = function () {
        this.run();
    };
    Watcher.prototype.run = function () {
        var value = this.vm.$mvc.data[this.path]; // 得到修改后的属性值
        var oldVal = this.value; // 得到初始化时的属性值
        console.log('run', value, oldVal, this.exp);
        if (value !== oldVal) { // 属性值修改后 触发更新视图
            this.value = value;
            this.cb.call(this.vm, value);
        }
    };
    Watcher.prototype.get = function () {
        target = this; // 存放当前wachter
        // console.log(dep)
        // 访问当前属性，触发属性get ，从而添加订阅者到订阅器中
        var value = this.vm.$mvc.data[this.path];
        target = null; // 添加完订阅者重置
        return value;
    };
    return Watcher;
}());
/* 消息订阅器  负责收集订阅者*/
var Dep = /** @class */ (function () {
    function Dep() {
        //用来收集订阅者
        this.subs = [];
    }
    //添加改变的数据
    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub); // 添加对应的订阅者
        console.log(this.subs);
    };
    //通知订阅者数据发生变化
    Dep.prototype.notify = function () {
        this.subs.forEach(function (sub) {
            sub.update(); // 触发对应订阅者的update 更新函数
            console.log(sub);
        });
        console.log(this.subs);
    };
    return Dep;
}());
