class Request {
    constructor () {
        this.contentType = 'application/x-www-form-urlencoded'
        this.type = 'get'
        this.parmas = {}
    }

     /**
     * get请求拼接参数
     * @param {object} parmas 请求参数
     */
    splicing (parmas) {
        let res
        if (parmas == {}) return res = ''
        for (var key in parmas) {
            res += key + '=' + parmas[key]+ '&'
        }
        return res.substring(0,res.length-1)
    }

    xmlHttp () {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve(xhr.responseText)
                } else if (xhr.readyState == 1) {
                    console.log('请求中')
                } else if (xhr.readyState == 4 && xhr.status == 0){
                    reject('错误')
                }
            }
            if (this.type.match(/get/i)) {
                xhr.open('GET', this.url + '?' + this.splicing(this.parmas), true)
                xhr.setRequestHeader("Content-Type", this.contentType)
                xhr.send()
            } else {
                xhr.open('POST', this.url, true)
                xhr.setRequestHeader("Content-Type", this.contentType)
                xhr.send(this.parmas)
            }
        })
    }

    /**
     * get
     * @param {object} option 
     */
    get (option) {
        Object.assign(this, {type:'get'}, option)
        return this.xmlHttp()
    }

    /**
     * get
     * @param {object} option 
     */
    post (option) {
        Object.assign(this,  {type:'post'},option)
        return this.xmlHttp()
    }

    /**
     * get
     * @param {object} option 
     */
    http (option) {
        Object.assign(this, option)
        return this.xmlHttp()
    }
}

var axios = new Request()

