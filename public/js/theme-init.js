/* Sets the theme on <html> before paint to avoid flash-of-wrong-theme.
   Loaded synchronously from <head>; no defer/async. */
(function () {
    try {
        var theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();
