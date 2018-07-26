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
        this.compileText();
    };
    // 在文档碎片中处理DOM文本
    Compile.prototype.compileText = function () {
        var _this = this;
        this.fragment.childNodes.forEach(function (node) {
            var text = node.innerText, reg = /\{\{(.*)\}\}/g; //获取所有文本节点  文本规则
            if (reg.test(text)) {
                _this.replaceText(RegExp.$1, node);
            }
        });
    };
    // 替换text为data中的数据
    Compile.prototype.replaceText = function (text, node) {
        console.log(text);
        // console.log(text.split('.').indexOf('()'))
    };
    return Compile;
}());
