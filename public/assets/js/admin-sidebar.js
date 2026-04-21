(function () {
  'use strict';

  const I = {
    dashboard:     '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    users:         '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    cms:           '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    blog:          '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    courses:       '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    payments:      '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    analytics:     '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/>',
    announce:      '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    messages:      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    email:         '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    notifications: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    catalog:       '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    archive:       '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
    profile:       '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  };

  const ITEMS = [
    { href: '/admin-panel.html',          label: 'Admin Panel',    icon: I.dashboard },
    { section: 'Content' },
    { href: '/admin-cms.html',            label: 'CMS',            icon: I.cms },
    { href: '/blog.html',                 label: 'Blog',           icon: I.blog },
    { href: '/course-manager.html',       label: 'Courses',        icon: I.courses },
    { href: '/student-archive.html',       label: 'The Archive',    icon: I.archive },
    { section: 'Commerce' },
    { href: '/student-payments.html',             label: 'Payments',       icon: I.payments },
    { section: 'Engagement' },
    { href: '/student-announcements.html',        label: 'Announcements',  icon: I.announce },
    { href: '/student-messaging.html',            label: 'Messages',       icon: I.messages },
    { href: '/email-automation.html',     label: 'Email',          icon: I.email },
    { href: '/student-notifications.html',        label: 'Notifications',  icon: I.notifications },
    { section: 'Insights' },
    { href: '/analytics-instructor.html', label: 'Analytics',      icon: I.analytics },
    { section: 'Discovery' },
    { href: '/student-course-catalog.html',       label: 'Browse Catalog', icon: I.catalog },
    { section: 'Account' },
    { href: '/student-profile.html',      label: 'Profile',        icon: I.profile },
  ];

  const SVG_TPL = (inner) =>
    `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

  function ensureStyles() {
    if (document.getElementById('role-sidebar-styles')) return;
    const style = document.createElement('style');
    style.id = 'role-sidebar-styles';
    style.textContent = `
      .sidebar-nav .nav-section {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.4px;
        text-transform: uppercase;
        color: rgba(255,255,255,0.32);
        padding: 18px 24px 6px;
        pointer-events: none;
      }
      .sidebar-nav .nav-section:first-child { padding-top: 6px; }
    `;
    document.head.appendChild(style);
  }

  function getCachedUser() {
    try { return JSON.parse(localStorage.getItem('archive_user') || 'null') || {}; }
    catch { return {}; }
  }

  function initialsFor(user) {
    if (user.avatar_initials) return user.avatar_initials;
    const f = (user.first_name || '')[0] || '';
    const l = (user.last_name  || '')[0] || '';
    return (f + l).toUpperCase() || '—';
  }

  function render() {
    const path = window.location.pathname;
    const user = getCachedUser();
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Admin';
    const initials = initialsFor(user);

    const nav = ITEMS.map(it => {
      if (it.section) return `<div class="nav-section">${it.section}</div>`;
      const active = path === it.href ? ' active' : '';
      return `<a href="${it.href}" class="nav-item${active}">${SVG_TPL(it.icon)}${it.label}</a>`;
    }).join('');

    return `
      <div class="sidebar-brand">
        <div class="brand-monogram">TFR</div>
        <div class="brand-title">The Foundation Room</div>
        <div class="brand-sub">Admin Console</div>
      </div>
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-footer">
        <div class="sidebar-user" onclick="(window.logout||function(){localStorage.clear();location.href='/index.html';})()">
          <div class="sidebar-avatar" id="sb-avatar">${initials}</div>
          <div class="sidebar-user-info">
            <div class="user-name" id="sb-name">${name}</div>
            <div class="user-role">Admin</div>
          </div>
        </div>
      </div>
    `;
  }

  function mount() {
    const el = document.getElementById('sidebar') || document.querySelector('aside.sidebar');
    if (!el) return;
    ensureStyles();
    el.innerHTML = render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
  document.addEventListener('userLoaded', mount);
})();
