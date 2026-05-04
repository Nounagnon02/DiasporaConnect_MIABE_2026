/**
 * DiasporaConnect — Top Nav Bar universel (icônes SVG)
 * Usage : <div id="dc-nav" data-active="home"></div>
 * data-active : "home" | "onboarding" | "send" | "confirm" | "receive" | "dashboard"
 */
(function () {
    var ICONS = {
        home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>',
        onboarding: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
        send: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
        confirm: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
        receive: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
        dashboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'
    };

    var ITEMS = [
        { key: 'home',       label: 'Accueil',      href: 'splash.html' },
        { key: 'onboarding', label: 'Onboarding',   href: 'onboarding.html' },
        { key: 'send',       label: 'Envoi',        href: 'calculator.html' },
        { key: 'confirm',    label: 'Confirmation', href: 'send-step3.html' },
        { key: 'receive',    label: 'Réception',    href: 'home-receiver.html' },
        { key: 'dashboard',  label: 'Dashboard',    href: 'home-sender.html' },
    ];

    var CSS = '<style id="dc-nav-style">' +
        '.dc-topnav{width:100%;max-width:430px;background:rgba(250,249,245,0.97);' +
        'backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);' +
        'border-bottom:1px solid rgba(208,197,178,0.35);' +
        'display:flex;align-items:center;overflow-x:auto;overflow-y:hidden;' +
        'scrollbar-width:none;-ms-overflow-style:none;' +
        'padding:0 2px;gap:0;z-index:200;flex-shrink:0;position:sticky;top:0;}' +
        '.dc-topnav::-webkit-scrollbar{display:none;}' +
        '.dc-tnav-item{display:flex;flex-direction:column;align-items:center;justify-content:center;' +
        'gap:3px;white-space:nowrap;padding:8px 12px;' +
        'font-family:"Public Sans",sans-serif;font-size:10px;font-weight:500;' +
        'color:#4A4A48;text-decoration:none;border-bottom:2px solid transparent;' +
        'transition:color .15s,border-color .15s;flex-shrink:0;}' +
        '.dc-tnav-item svg{display:block;flex-shrink:0;}' +
        '.dc-tnav-item:hover{color:#755B00;}' +
        '.dc-tnav-item.active{color:#755B00;border-bottom-color:#755B00;font-weight:600;}' +
        '</style>';

    document.addEventListener('DOMContentLoaded', function () {
        var el = document.getElementById('dc-nav');
        if (!el) return;
        var active = el.dataset.active || '';
        if (!document.getElementById('dc-nav-style')) {
            document.head.insertAdjacentHTML('beforeend', CSS);
        }
        var links = ITEMS.map(function (item) {
            var cls = 'dc-tnav-item' + (item.key === active ? ' active' : '');
            return '<a href="' + item.href + '" class="' + cls + '">' +
                ICONS[item.key] +
                '<span>' + item.label + '</span>' +
                '</a>';
        }).join('');
        el.outerHTML = '<nav class="dc-topnav">' + links + '</nav>';
    });
})();
