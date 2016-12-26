module compote.core {
  /** Utils */
  let idCounter = -1;
  export function uniqueId(prefix = '') {
    idCounter++;
    return prefix + idCounter.toString();
  }
}
