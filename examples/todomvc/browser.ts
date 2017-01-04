module compote.examples.todomvc {
  const { Renderer } = core;

  bootstrap();

  function bootstrap() {
    Object.assign(Renderer, {
      document,
      defer(fn: Function) {
        setTimeout(fn, 0);
      }
    });

    const app = new AppComponent();
    const $container = document.getElementById('container');
    app.$mountTo($container);
  }
}
