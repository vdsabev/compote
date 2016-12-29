module compote.app.browser {
  const { Renderer } = core;

  bootstrap();

  function bootstrap() {
    Object.assign(Renderer, {
      document,
      // TODO: Find a way to preserve the stack trace
      defer(fn: Function) {
        setTimeout(fn, 0);
      }
    });

    const app = new AppComponent();
    const $container = document.getElementById('container');
    // TODO: Replace / merge element instead of appending
    app.$mountTo($container);
  }
}
