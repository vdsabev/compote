module compote.app.browser {
  const { Renderer } = core;

  const container = document.getElementById('container');

  const app = new App({
    renderer: new Renderer(virtualDom.h),
    name: 'World',
    update(this: App) {
      // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
      while (container.firstChild) {
        container.removeChild(container.lastChild);
      }
      container.appendChild(virtualDom.create(this.render()));
    }
  });

  app.update();
}
