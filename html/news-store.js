(function () {
  'use strict';
  var root = new URL('../', document.currentScript.src);
  var items = window.BA_NEWS.map(function(n) {
    return Object.assign({body:'', imageAlt:n.title, status:'published'}, n, {legacyHref:n.href || ''});
  }).filter(function(n) { return n.status === 'published'; });
  items.sort(function(a,b) { return b.date.localeCompare(a.date) || a.id.localeCompare(b.id); });
  function externalURL(value) {
    var u = new URL(value);
    if (!/^https?:$/.test(u.protocol) || u.username || u.password) throw new Error('Invalid URL');
    return u.href;
  }
  var store = {
    url: function(value) { return new URL(value,root).href; },
    externalURL: externalURL,
    imageURL: function(value) { return value ? externalURL(new URL(value,root).href) : ''; },
    link: function(n) { return n.body ? store.url('html/' + (n.legacyHref || 'news-detail.html?id=' + encodeURIComponent(n.id))) : ''; },
    list: function() { return Promise.resolve(items.slice()); },
    get: function(id) { return Promise.resolve(items.filter(function(n) { return n.id === id; })[0] || null); }
  };
  window.BANews = store;
}());
