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
        Object.defineProperty(data, // 对象
        key, // 属性名
        {
            enumerable: true,
            get: function () {
                return val;
            },
            set: function (newVal) {
                val = newVal; // 当属性被修改时触发
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
        this.clonefragment(this.ele);
    };
    // 将DOM拷贝到虚拟文档
    Compile.prototype.clonefragment = function (ele) {
        var _this = this;
        var childrens = this.ele.children;
        Array.prototype.slice.call(childrens).forEach(function (children) {
            _this.fragment.appendChild(children);
        });
        this.compileText(this.fragment);
        this.ele.appendChild(this.fragment);
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
        console.log('666', node, reg, node.textContent);
        // console.log(text.split('.').indexOf('()'))
    };
    // 指令编译
    Compile.prototype.replaceCompile = function (node) {
        var _this = this;
        var attrs = node.attributes;
        Array.prototype.slice.call(attrs).forEach(function (attr) {
            var self = _this;
            // 规则 v-ssss
            if (/[v\-]{2}/.test(attr.name)) {
                console.log(attr.name, attr.value);
                if (/[v\-on\:]{5}/.test(attr.name)) {
                    var method = self.$mvc.methods[attr.value];
                    node.addEventListener(attr.name.slice(5), method.bind(self.$mvc), false);
                }
                else {
                    var res = self.$mvc.data[attr.value];
                    switch (attr.name.slice(2)) {
                        case 'html':
                            node.innerHTML = res;
                    }
                }
            }
            // 规则 事件指令@click / v-on:click
            else if (/[\@]/.test(attr.name)) {
                var method = self.$mvc.methods[attr.value];
                node.addEventListener(attr.name.slice(1), method.bind(self.$mvc), false);
            }
        });
    };
    return Compile;
}());
// 消息订阅者 watcher
var watcher = /** @class */ (function () {
    function watcher() {
    }
    return watcher;
}());
// 管理改变集合
var Dep = /** @class */ (function () {
    function Dep() {
        //改变的数据集合
        this.subs = [];
    }
    //添加改变的数据
    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub);
    };
    //通知订阅者数据发生变化
    Dep.prototype.notify = function (newVal) {
    };
    return Dep;
}());
