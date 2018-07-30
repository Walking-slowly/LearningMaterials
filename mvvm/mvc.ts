interface MvnData {
    el: string
    data: Object
    methods?: Object 
}

// mvvm 入口函数
class Mvc {
    $mvc: any
    data: Object
    methods?: Object
    constructor (mvnData: MvnData) {
        this.$mvc = this
        this.data = mvnData.data
        this.methods = mvnData.methods
        new Compile(this.$mvc, mvnData.el).init()
        new Observer(mvnData.data).init()
    }
}

// 数据劫持，Dep收集改变属性
class Observer {
    datas: any
    constructor (data: any) {
        this.datas = data
    }

    init () {
        if (typeof this.datas !== 'object') return;
        for (var key in this.datas) {
            this. defineProprety(this.datas, key, this.datas[key])
        }
    }

    defineProprety (data: Object, key: string, val: any): any {
        new Observer(val).init() // 遍历子属性

        Object.defineProperty(
            data, // 对象
            key, // 属性名
            {
                enumerable: true, // 可枚举属性 允许修改
                get : function (): any{
                    return val
                },
                set: function (newVal: any) {
                    val = newVal  // 当属性被修改时触发

                }
            } // 属性描述符 -- 存取描述符
        )
    }
}



// compile 模板指令解析 
class Compile {
    $mvc: any
    ele: HTMLElement
    fragment: any
    constructor ($mvc: any, el: string) {
        this.$mvc = $mvc
        this.ele = document.querySelector(el) // 获取DOM
        this.fragment = document.createDocumentFragment() // 创建虚拟文档节点
    }

    init (): any {
        this.clonefragment(this.ele)
    }

    // 将DOM拷贝到虚拟文档
    clonefragment (ele: Node): any {
        let childrens = this.ele.children
        Array.prototype.slice.call(childrens).forEach(children => {
            this.fragment.appendChild(children)
        }) // 循环子节点写入虚拟文档
        this.compileText(this.fragment) // 在虚拟文档中处理操作
        this.ele.appendChild(this.fragment) // 完成后重新写入真实DOM
    }

    // 在文档碎片中处理DOM文本
    compileText (html: any): any {
        //循环html找出 文本节点 和 元素节点
        html.childNodes.forEach((node)=> {
            let text = node.textContent, reg = /\{\{(.*?)\}\}/g //获取所有文本节点  文本规则
            if (node.nodeType === 3 && reg.test(text)) { // 去掉空文本
                this.replaceText(node, RegExp.$1.trim())
            } else if (node.nodeType === 1) {
                this.replaceCompile(node)
            }
            if (node.childNodes && node.childNodes.length > 0) {
                this.compileText(node)
            }
        })
    }

    // 替换text
    replaceText (node: Text, reg: string) {
        
        console.log('666',node, reg, node.textContent)
        // console.log(text.split('.').indexOf('()'))
    }

    // 指令编译
    replaceCompile (node: Element) {
        let attrs = node.attributes
        Array.prototype.slice.call(attrs).forEach( (attr) => {
            let self = this
            // 规则 v-ssss
            if (/[v\-]{2}/.test(attr.name)) {
                console.log(attr.name,attr.value)
                if (/[v\-on\:]{5}/.test(attr.name)) {
                    let method = self.$mvc.methods[attr.value]
                    node.addEventListener(attr.name.slice(5), method.bind(self.$mvc), false)
                } else {
                    let res = self.$mvc.data[attr.value]
                    switch (attr.name.slice(2)) {
                        case 'html' :
                        node.innerHTML = res
                    }
                }
            } 
            // 规则 事件指令@click / v-on:click
            else if (/[\@]/.test(attr.name)) {
                let method = self.$mvc.methods[attr.value]
                node.addEventListener(attr.name.slice(1), method.bind(self.$mvc), false)
            }
        })

    }
 
}


// 消息订阅者 watcher
class watcher {
    constructor () {

    }
}


// 管理改变集合
class Dep {
    subs: any[]
    target: any
    constructor () {
        //改变的数据集合
        this.subs = []
    }

    //添加改变的数据
    addSub (sub: any) {
        this.subs.push(sub)
    }

    //通知订阅者数据发生变化
    notify(newVal) {

    }
}