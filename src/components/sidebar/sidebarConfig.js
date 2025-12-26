export const sidebarMenus = {
  // Admin with school_type = 'both' (Superadmin access)
  admin_both: [
    {
      title: "Dashboard",
      icon: "home",
      link: "/admin/dashboard",
      dataPage: "dashboard"
    },

    {
      title: "Admission Cycles",
      icon: "calendar",
      link: "/admin/admission-cycles",
      dataPage: "admission-cycles"
    },

    {
      title: "Registration Data",
      icon: "clipboard",
      link: "#",
      submenu: [
        {
          title: "All Registrations",
          link: "/admin/registrations",
          dataPage: "registrations-all"
        },
        {
          title: "Needs Action",
          link: "/admin/registrations/needs-action",
          dataPage: "registrations-needs-action"
        },
        {
          title: "Confirm Cash Payment",
          link: "/admin/registrations/confirm-cash",
          dataPage: "registrations-confirm-cash"
        },
        {
          title: "Export Data",
          link: "/admin/registrations/export",
          dataPage: "registrations-export"
        }
      ]
    },
    {
      title: "Announcements",
      icon: "megaphone",
      link: "/admin/announcements",
      dataPage: "announcements-list"
    },
    {
      title: "Reports",
      icon: "document",
      link: "#",
      submenu: [
        {
          title: "Summary Report",
          link: "/admin/reports/summary",
          dataPage: "reports-summary"
        },
        {
          title: "By Program/Major",
          link: "/admin/reports/by-major",
          dataPage: "reports-by-major"
        },
        {
          title: "Payment Methods",
          link: "/admin/reports/payment-methods",
          dataPage: "reports-payment-methods"
        },
        {
          title: "Form Sold",
          link: "/admin/reports/forms-sold",
          dataPage: "reports-forms-sold"
        },
        {
          title: "Pending Cash",
          link: "/admin/reports/pending-cash",
          dataPage: "reports-pending-cash"
        },
        {
          title: "Validation Status",
          link: "/admin/reports/validation",
          dataPage: "reports-validation"
        },
        {
          title: "Test Readiness",
          link: "/admin/reports/test-readiness",
          dataPage: "reports-test-readiness"
        },
        {
          title: "Overview (All Schools)",
          link: "/admin/reports/superadmin/overview",
          dataPage: "reports-superadmin-overview"
        },
        {
          title: "Trends & Analytics",
          link: "/admin/reports/superadmin/trends",
          dataPage: "reports-superadmin-trends"
        },
        {
          title: "School Comparison",
          link: "/admin/reports/superadmin/comparison",
          dataPage: "reports-superadmin-comparison"
        }
      ]
    },
    {
      title: "Users Management",
      icon: "users",
      link: "#",
      submenu: [
        {
          title: "Manage Admins",
          link: "/admin/admins/manage",
          dataPage: "admins-management"
        },
        {
          title: "Manage Validators",
          link: "/admin/validators/manage",
          dataPage: "validators-management"
        }
      ]
    },
    {
      title: "Logs",
      icon: "logs",
      link: "#",
      submenu: [
        {
          title: "Activity",
          link: "/admin/logs/activity",
          dataPage: "log-activity"
        },
        {
          title: "Login (All Users)",
          link: "/admin/logs/login",
          dataPage: "log-login"
        }
      ]
    },

    {
      title: "Settings",
      icon: "settings",
      link: "/admin/settings",
      dataPage: "settings"
    }
  ],


  admin: [
    {
      title: "Dashboard",
      icon: "home",
      link: "/admin/dashboard",
      dataPage: "dashboard"
    },
    {
      title: "Registration",
      icon: "clipboard",
      link: "#",
      submenu: [
        {
          title: "All Registrations",
          link: "/admin/registrations",
          dataPage: "registrations-all"
        },
        {
          title: "Needs Action",
          link: "/admin/registrations/needs-action",
          dataPage: "registrations-needs-action"
        },
        {
          title: "Confirm Cash Payment",
          link: "/admin/registrations/confirm-cash",
          dataPage: "registrations-confirm-cash"
        }
      ]
    },
    {
      title: "Announcements",
      icon: "megaphone",
      link: "/admin/announcements",
      dataPage: "announcements-list"
    },
    {
      title: "Reports",
      icon: "chart",
      link: "#",
      submenu: [
        {
          title: "Summary Report",
          link: "/admin/reports/summary",
          dataPage: "reports-summary"
        },
        {
          title: "By Program/Major",
          link: "/admin/reports/by-major",
          dataPage: "reports-by-major"
        },
        {
          title: "Payment Methods",
          link: "/admin/reports/payment-methods",
          dataPage: "reports-payment-methods"
        },
        {
          title: "Form Sold",
          link: "/admin/reports/forms-sold",
          dataPage: "reports-forms-sold"
        },
        {
          title: "Pending Cash",
          link: "/admin/reports/pending-cash",
          dataPage: "reports-pending-cash"
        },
        {
          title: "Validation Status",
          link: "/admin/reports/validation",
          dataPage: "reports-validation"
        },
        {
          title: "Test Readiness",
          link: "/admin/reports/test-readiness",
          dataPage: "reports-test-readiness"
        },
        {
          title: "Program Analytics",
          link: "/admin/reports/programs",
          dataPage: "reports-programs"
        }
      ]
    },
      {
      title: "Content",
      icon: "document",
      link: "#",
      submenu: [
        {
          title: "Highlights",
          link: "/admin/content/highlights",
          dataPage: "content-highlights"
        },
        {
          title: "FAQ",
          link: "/admin/content/faq",
          dataPage: "content-faq"
        },
    
      ]
    },
    {
      title: "Settings",
      icon: "settings",
      link: "/admin/settings",
      dataPage: "settings"
    }
  ],

  // Validator menu - for document validation
  validator: [
    {
      title: "Dashboard",
      icon: "home",
      link: "/validator/dashboard",
      dataPage: "dashboard"
    },
      {
      title: "Registrations",
      icon: "users",
      link: "#",
      submenu: [
        {
          title: "All Registrations",
          link: "/validator/registrations",
          dataPage: "registrations-all"
        },

        {
          title: "Needs Revision",
          link: "/validator/registrations/revision",
          dataPage: "registrations-revision"
        }
      ]
    },
  
  
  ]
};

// Helper function to get menu based on role and school_type
export function getMenuForUser(user) {
  if (!user) return [];
  
  if (user.role === 'validator') {
    return sidebarMenus.validator;
  }
  
  if (user.role === 'admin') {
    // Check school_type for admin
    const schoolType = user.school_type || user.admin_permission?.school_type;
    
    if (schoolType === 'both') {
      return sidebarMenus.admin_both; // Superadmin access
    }
    
    return sidebarMenus.admin; // Limited admin access (SMA or SMK)
  }
  
  return [];
}

// Icon mapping untuk SVG
export const iconSvgs = {
  home: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>`,
  clipboard: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>`,
  document: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`,
  book: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>`,
  chart: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`,
  users: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>`,
  settings: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`,
  user: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>`,
  form: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`,
  file: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>`,
  calendar: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`,
  star: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>`,
  chat: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>`,
  megaphone: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>`,
  help: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  logs: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>`
};