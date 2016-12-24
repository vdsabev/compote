module compote.app.browser {
  const { Renderer } = core;

  bootstrap();

  function bootstrap() {
    Renderer.document = document;

    const app = new AppComponent();
    const container = document.getElementById('container');
    app.$mount(container);
  }
}
