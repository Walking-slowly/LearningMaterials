// mvvm 入口函数
var Mvc = /** @class */ (function () {
    function Mvc(mvnData) {
        new Compile(mvnData.el).init();
        observer(mvnData.data);
    }
    return Mvc;
}());
// 数据监听，改变通知订阅者
function defineProprety(data, key, val) {
    observer(val);
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
}
// observer 遍历所有属性
function observer(data) {
    if (typeof data !== 'object')
        return;
    for (var key in data) {
        defineProprety(data, key, data[key]);
    }
}
// compile 模板指令解析 
var Compile = /** @class */ (function () {
    function Compile(el) {
        this.ele = document.querySelector(el); // 获取DOM
        this.fragment = document.createDocumentFragment(); // 创建文档碎片
    }
    Compile.prototype.init = function () {
        this.clonefragment();
    };
    // 将DOM拷贝到文档碎片
    Compile.prototype.clonefragment = function () {
        this.fragment.appendChild(this.ele);
        this.compileText(this.fragment);
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
        console.log('666', node, reg);
        // console.log(text.split('.').indexOf('()'))
    };
    // 指令编译
    Compile.prototype.replaceCompile = function (node) {
        var attrs = node.attributes;
        Array.prototype.slice.call(attrs).forEach(function (attr) {
            console.log(attr.name, attr.value);
            // 规则 v-ssss  v-on:clicl
            if (/[v\-]{2}/.test(attr.name)) {
                console.log(attr.value);
            }
            // 规则 @click
            else if (/[\@]/.test(attr.name)) {
            }
        });
    };
    return Compile;
}());
