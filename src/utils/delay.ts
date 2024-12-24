export default function delay(ms: number): Promise<any> {
    return new Promise((cb: Function) => setTimeout(cb, ms));
}