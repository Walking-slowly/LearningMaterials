interface MvnData {
    el: string
    data: Object
    methods?: Object 
}

// mvvm 入口函数
class Mvc {
    constructor (mvnData: MvnData) {
        new Compile(mvnData.el).init()
        observer(mvnData.data)
    }
}

// 数据监听，改变通知订阅者
function defineProprety (data: Object, key: string, val: any) {
    observer(val)

    Object.defineProperty(
        data, // 对象
        key, // 属性名
        {
            enumerable: true, // 可枚举属性 允许修改
            get : function (){
                return val
            },
            set: function (newVal: any) {
                val = newVal  // 当属性被修改时触发
            }
        } // 属性描述符 -- 存取描述符
    )
}

// observer 遍历所有属性
function observer (data: any) {
    if (typeof data !== 'object') return;
    for (var key in data) {
        defineProprety(data, key, data[key])
    }
}



// compile 模板指令解析 
class Compile {
    ele: HTMLElement
    fragment: any
    constructor (el: string) {
        this.ele = document.querySelector(el) // 获取DOM
        this.fragment = document.createDocumentFragment() // 创建文档碎片
    }

    init () {
        this.clonefragment()
    }

    // 将DOM拷贝到文档碎片
    clonefragment () {
        this.fragment.appendChild(this.ele)
        this.compileText()
    }

    // 在文档碎片中处理DOM文本
    compileText () {
        this.fragment.childNodes.forEach((node)=> {
            let text = node.innerText, reg = /\{\{(.*)\}\}/g //获取所有文本节点  文本规则
            if (reg.test(text) && this.isTextNode(text)) {
               
                this.replaceText(RegExp.$1, node)
            }
            
        })
    }

    // 替换text
    replaceText (text: string, node: HTMLElement) {
        console.log(text)
        // console.log(text.split('.').indexOf('()'))
    }

    isTextNode(el) {
        return el.nodeType === 3 // 文本节点
    }
    isElementNode(el) {
        return el.nodeType === 1  // 元素节点
    }

    
}