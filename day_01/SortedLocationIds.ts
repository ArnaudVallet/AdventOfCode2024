class SortedLocationIds extends LocationIds {
    constructor(leftList: number[], rightList: number[]) {
        super();
        this.left = leftList
        this.right = rightList
        this.left = this.left.sort((a, b) => a - b)
        this.right = this.right.sort((a, b) => a - b)
    }
}