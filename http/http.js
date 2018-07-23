class http {
    constructor ({
        url, 
        contentType = 'application/x-www-form-urlencoded',
        timeOut = '1000'
    }) {
        this.url = url
        this.contentType = contentType
        this.timeOut = timeOut
    }

     /**
     * get请求拼接参数
     * @param {object} parmas 请求参数
     */
    splicing (parmas) {
        let res
        for (var key in parmas) {
            res += key + '=' + parmas[key]
        }

        return res
    }

    /**
     * 请求
     * @param {object} option 请求参数
     */
    xmlHTTP (option) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest()

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve(xhr.responseText)
                } else {
                    reject(xhr.stutas)
                }
            }

            if (option.type.macth(/get/i)) {
                xhr.open('GET', this.url + option.router + '?' + this.splicing(option.parmas), true)
                xhr.setRequestHeader("Content-Type", this.contentType)
                xhr.send()
            } else {
                xhr.open('POST', this.url + option.router , true)
                xhr.setRequestHeader("Content-Type", this.contentType)
                xhr.send(option.parmas)
            }
            
        })

    }

    /**
     * ajax
     * @param {string} router 请求路由
     * @param {string} type 请求类型
     * @param {object} parmas 请求参数
     */
    ajax ({
        router,
        type = 'GET',
        parmas = {}
    }) {
        this.xmlHTTP ({
            router,
            type,
            parmas
        })
    }

   
    // setConfig ({
    //     url = this.url,
    //     ContentType = this.ContentType,
    //     timeOut = this.timeOut
    // }) {

    // }
}

    
console.log(new http({
    url: 'www.baidu.com',
}))
