function errorNotification(text) {
  new Noty({
    text: text, 
    type: 'error',
    layout: 'topRight',
    theme: 'sunset',
    timeout: 3000,
    closeWith: ['click']
  }).show();
}