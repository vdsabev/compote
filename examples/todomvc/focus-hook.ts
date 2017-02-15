module examples.virtualDom {
  export class FocusHook implements VirtualDOM.VHook {
    hook($el: HTMLElement, propertyName: string) {
      setTimeout(() => {
        if (document.activeElement !== $el) {
          $el.focus();
        }
      }, 0);
    }

    unhook($el: HTMLElement, propertyName: string) {
      //
    }
  }
}
