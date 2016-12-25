module compote.app.browser {
  const { Renderer } = core;

  bootstrap();

  function bootstrap() {
    Renderer.delay = (fn: Function) => {
      setTimeout(fn, 0);
    };

    Renderer.document = document;

    const app = new AppComponent();
    const container = document.getElementById('container');
    app.$mountTo(container);
  }
}
