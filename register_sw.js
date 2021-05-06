if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      // var serviceWorker;
      // if (registration.installing) {
      //   serviceWorker = registration.installing;
      // } else if (registration.waiting) {
      //   serviceWorker = registration.waiting;
      // } else if (registration.active) {
      //   serviceWorker = registration.active;
      // }

      // if (serviceWorker) {
      //   if (serviceWorker.state === 'activated') return insertCss();
      //   serviceWorker.addEventListener('statechange', function(e) {
      //     if (e.target.state === 'activated') insertCss();
          
      //   });
      // }
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
function insertCss() {
  fetch('style.scss').then(res => res.text()).then(styles => {
    const css = document.createElement('style')
    css.type = 'text/css';
    if (css.styleSheet) css.styleSheet.cssText = styles;
    else css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName("head")[0].appendChild(css)
  })

}
window.addEventListener('load', () => {
  insertCss();
});