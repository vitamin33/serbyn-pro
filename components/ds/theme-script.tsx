// Runs in <head> before first paint, so there is no flash of the wrong theme
// and no flash of a motion pre-state:
// 1. `js` on <html>: motion pre-states are scoped to `.js`, so with JavaScript
//    off every component renders in its final, settled state (T2).
// 2. a saved theme ("light" | "dark") becomes data-theme on <html>. "system",
//    or nothing saved, leaves the attribute off and prefers-color-scheme wins.

export const THEME_KEY = 'theme';

const source = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}
