interface MvnData {
    el: HTMLElement
    data: Object
    methods: Object 
}

class Mvn {
    el: HTMLElement
    data: Object
    methods: Object
    constructor (mvnData: MvnData) {
        this.el =  new observer(mvnData.el)
        this.data = mvnData.data
        this.methods = mvnData.methods
    }
    
}

// mvvm
class observer {
    el: HTMLElement
    constructor (el: HTMLElement) {
        this.el = el
    }

    init () {

    }
}

