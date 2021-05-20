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

function successNotification(text) {
  new Noty({
    text: text, 
    type: 'success',
    layout: 'topRight',
    theme: 'sunset',
    timeout: 3000,
    closeWith: ['click']
  }).show();
}