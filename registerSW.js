if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/enrollaife/sw.js', { scope: '/enrollaife/' })})}