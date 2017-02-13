module examples.virtualDom {
  export class FocusHook { // TODO: Implement hook interface
    hook($el: HTMLElement) {
      setTimeout(() => {
        if (document.activeElement !== $el) {
          $el.focus();
        }
      }, 0);
    }
  }
}
