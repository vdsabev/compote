module compote.app.browser {
  const { Renderer } = core;

  bootstrap();

  function bootstrap() {
    Renderer.document = document;

    const container = document.getElementById('container');
    Renderer.mount(container, new AppComponent());
  }
}
