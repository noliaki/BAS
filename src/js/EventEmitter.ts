export default class EventEmitter {
  private static handler: Map<string, Function[]> = new Map()

  public static on(name: string, fn: Function): void {
    if (!this.handler.has(name)) {
      this.handler.set(name, [])
    }

    ;(this.handler.get(name) as Function[]).push(fn)
  }

  public static emit(name: string, ...data): void {
    if (!this.handler.has(name)) return

    const functions: Function[] = this.handler.get(name) as Function[]
    const len: number = functions.length

    for (let i: number = 0; i < len; i++) {
      functions[i](...data)
    }
  }
}

export class EventName {
  public static ON_INPUT_TEXT = 'onInputText'
}
