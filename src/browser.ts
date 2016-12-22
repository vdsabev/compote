module compote.app.browser {
  const { setRenderer } = core;

  export class BrowserAppComponent extends AppComponent {
    $mount() {
      // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
      const container = document.getElementById('container');
      while (container.firstChild) {
        container.removeChild(container.lastChild);
      }
      container.appendChild(this.$el);
    }
  }

  setRenderer(virtualDom);
  new BrowserAppComponent({ name: 'World' });
}
