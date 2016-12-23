module compote.app.browser {
  bootstrap();

  function bootstrap() {
    // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    const container = document.getElementById('container');
    while (container.firstChild) {
      container.removeChild(container.lastChild);
    }

    const app = new AppComponent();
    container.appendChild(app.$el);
  }
}
