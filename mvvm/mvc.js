// mvvm 入口函数
var Mvc = /** @class */ (function () {
    function Mvc(mvnData) {
        this.$mvc = this;
        this.data = mvnData.data;
        this.methods = mvnData.methods;
        new Compile(this.$mvc, mvnData.el).init();
        new Observer(mvnData.data).init();
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
    Observer.prototype.defineProprety = function (data, key, val) {
        new Observer(val).init(); // 遍历子属性
        var dep = new Dep();
        Object.defineProperty(data, // 对象
        key, // 属性名
        {
            enumerable: true,
            get: function () {
                console.log('get');
                return val;
            },
            set: function (newVal) {
                console.log('666', val, newVal);
                val = newVal; // 当属性被修改时触发
                // dep.notify() // 通知订阅者
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
        node.parentNode.innerText = this.getData(this.$mvc.data, reg);
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
                    _this[attr.name.slice(2)] && _this[attr.name.slice(2)](node, _this.getData(_this.$mvc.data, attr.value), attr.value);
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
    // 根据路径查找数据
    Compile.prototype.getData = function (data, path) {
        var router = path.split(".");
        router.forEach(function (item, index) {
            var p;
            p = router[index];
            if (data[p]) {
                data = data[p];
            }
        });
        return data;
    };
    // 修改数据
    Compile.prototype.setData = function (data, path, newVal) {
        var router = path.split(".");
        router.forEach(function (item, index) {
            var p;
            p = router[index];
            if (index < router.length - 1) {
                data = data[p];
            }
            else {
                data[p] = newVal; // 找到最后一个路径修改值
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
        var _this = this;
        node.value = res;
        node.addEventListener('input', function (e) {
            _this.setData(_this.$mvc.data, path, e.target.value);
            console.log(_this.$mvc);
        }, false);
        // new Watcher(this.$mvc, res)
    };
    return Compile;
}());
// 订阅者 watcher
var Watcher = /** @class */ (function () {
    function Watcher($mvc) {
        this.$mvc = $mvc;
    }
    // 添加当前到消息订阅者
    // get () {
    //     let dep = new Dep()
    //     dep.target = this
    //     // var value = this.$mvc.data[]
    // }
    Watcher.prototype.update = function () {
    };
    return Watcher;
}());
// 消息订阅器
var Dep = /** @class */ (function () {
    function Dep() {
        //用来收集订阅者
        this.subs = [];
        this.target = null;
    }
    //添加改变的数据
    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub);
        console.log(this.subs);
    };
    //通知订阅者数据发生变化
    Dep.prototype.notify = function () {
        this.subs.forEach(function (sub) {
            sub.update(); // 触发Watcher的update
            console.log(sub);
        });
    };
    return Dep;
}());
