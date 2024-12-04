class LocationIds {
    left: number[]
    right: number[]

    constructor() {
        this.left = []
        this.right = []
    }

    insert(left: number, right: number) {
        this.left.push(left)
        this.right.push(right)
    }

    insertLeft(num: number) {
        this.left.push(num)
    }
    
    insertRight(num: number) {
        this.right.push(num)
    }

}