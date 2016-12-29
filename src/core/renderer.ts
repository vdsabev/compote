module compote.core {
  /** Renderer */
  export class Renderer {
    static defer: (fn: Function) => void;
    static document: Document;
  }
}
