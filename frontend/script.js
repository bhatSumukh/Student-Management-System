

const API_BASE = 'http://localhost:5500/api';
// ── Global error boundary ──────────────────────────
window.onerror = (message, source, line) => {
  console.error('JS Error:', message, 'at', line);
  const p = document.getElementById('page-content');
  if (p) p.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${message}</p></div>`;
};

// ── OTP ────────────────────────────────────────────
let generatedOTP = '';

// ── App State ──────────────────────────────────────
const state = {
  user:  null,
  token: null,
  role:  'admin',
  page:  'dashboard',

  data: {
    courses: [
      { id: 1, code: 'BCA',    name: 'Bachelor of Computer Applications', duration: 3 },
      { id: 2, code: 'BSC-CS', name: 'Bachelor of Science — CS',          duration: 3 },
      { id: 3, code: 'MCA',    name: 'Master of Computer Applications',   duration: 2 },
    ],
    subjects: [
      { id: 1,  code: 'BCA101', name: 'Mathematics Foundation', course: 'BCA', sem: 1, credits: 4, lab: false },
      { id: 2,  code: 'BCA102', name: 'Computer Fundamentals',  course: 'BCA', sem: 1, credits: 4, lab: false },
      { id: 3,  code: 'BCA103', name: 'C Programming',          course: 'BCA', sem: 1, credits: 4, lab: true  },
      { id: 4,  code: 'BCA201', name: 'Data Structures',        course: 'BCA', sem: 2, credits: 4, lab: true  },
      { id: 5,  code: 'BCA202', name: 'OOP with C++',           course: 'BCA', sem: 2, credits: 4, lab: true  },
      { id: 6,  code: 'BCA203', name: 'DBMS',                   course: 'BCA', sem: 2, credits: 4, lab: true  },
      { id: 7,  code: 'BCA301', name: 'Java Programming',       course: 'BCA', sem: 3, credits: 4, lab: true  },
      { id: 8,  code: 'BCA302', name: 'Operating Systems',      course: 'BCA', sem: 3, credits: 4, lab: false },
      { id: 9,  code: 'BCA401', name: 'Advanced Java',          course: 'BCA', sem: 4, credits: 4, lab: true  },
      { id: 10, code: 'BCA501', name: 'Machine Learning',       course: 'BCA', sem: 5, credits: 4, lab: true  },
      { id: 11, code: 'BCA601', name: 'Final Year Project',     course: 'BCA', sem: 6, credits: 8, lab: true  },
      { id: 12, code: 'BCA602', name: 'Professional Ethics',    course: 'BCA', sem: 6, credits: 2, lab: false },
    ],
    notices: [
      { id: 1, title: 'Semester Exam Schedule Released', body: 'Final semester examination schedule has been released. Exams begin from March 15, 2024.', by: 'Admin', date: '2024-02-01', target: 'all' },
      { id: 2, title: 'Workshop on AI & Machine Learning', body: 'A two-day workshop on AI will be conducted on February 20–21. Final year students must attend.', by: 'Admin', date: '2024-01-28', target: 'all' },
      { id: 3, title: 'Library Book Return Reminder', body: 'All students who borrowed library books must return them before February 25, 2024.', by: 'Staff', date: '2024-01-25', target: 'student' },
      { id: 4, title: 'College Annual Day Celebration', body: 'Annual Day will be held on March 5, 2024. Students are requested to participate in cultural events.', by: 'Staff', date: '2024-01-20', target: 'all' },
    ],
    exams: [
      { id: 1, name: 'Internal Assessment-I', type: 'Internal', subject: 'Final Year Project', course: 'BCA', sem: 6, date: '2024-02-15', time: '09:00', room: 'Room 101' },
      { id: 2, name: 'Final Examination',     type: 'Final',    subject: 'Final Year Project', course: 'BCA', sem: 6, date: '2024-03-15', time: '10:00', room: 'Exam Hall A' },
      { id: 3, name: 'Lab Practical',         type: 'Lab',      subject: 'Final Year Project', course: 'BCA', sem: 6, date: '2024-03-18', time: '09:00', room: 'Lab 1' },
    ],
    events: [
      { id: 1, title: 'Annual Sports Day',  desc: 'Various indoor & outdoor games for all students and staff.',                                               date: '2024-02-10', type: 'Sports'   },
      { id: 2, title: 'Techfest 2024',      desc: 'Annual technology festival with coding competitions, hackathons, and project exhibitions.',                 date: '2024-03-01', type: 'Academic' },
      { id: 3, title: 'College Annual Day', desc: 'Annual day celebration with cultural programs and prize distribution.',                                      date: '2024-03-05', type: 'Cultural' },
    ],

    // Populated live from API
    students: [],
    teachers: [],
    staff:    [],
  }
};

// ── API helper ─────────────────────────────────────
// const API_BASE = 'https://student-management-system-o308.onrender.com/api';

async function api(path, options = {}) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (state.token) {
      headers['Authorization'] = `Bearer ${state.token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non JSON Response:', text);
      throw new Error('Backend server returned invalid response. Check Render deployment.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;

  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ── Toast ──────────────────────────────────────────
function showToast(message, type = 'success') {
  const icons     = { success: '✅', error: '❌', info: 'ℹ️' };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '📢'}</span><span class="toast-msg">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3500);
}

// ── Theme ──────────────────────────────────────────
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (!isDark) document.documentElement.setAttribute('data-theme', 'dark');
  else         document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// ── Login helpers ──────────────────────────────────
let selectedRole = 'admin';

function setRole(r) {
  selectedRole = r;
  document.querySelectorAll('.login-tab').forEach((t, i) => {
    t.classList.toggle('active', ['admin', 'teacher', 'student', 'staff'][i] === r);
  });
}

function fillCreds(u, p, r) {
  setRole(r);
  document.getElementById('login-user').value = u;
  document.getElementById('login-pass').value = p;
}

function togglePass() {
  const el = document.getElementById('login-pass');
  el.type  = el.type === 'password' ? 'text' : 'password';
  document.getElementById('pass-toggle').textContent = el.type === 'password' ? '👁️' : '🙈';
}

// ── Login ──────────────────────────────────────────
async function doLogin() {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  if (!username || !password) { showToast('Please enter username and password', 'error'); return; }

  const btn = document.getElementById('login-btn');
  const txt = document.getElementById('login-btn-text');
  btn.disabled    = true;
  txt.textContent = 'Signing in…';

  try {
    const data  = await api('/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    state.user  = data.user;
    state.token = data.token;
    state.role  = data.user.role;

    localStorage.setItem('token',      data.token);
    localStorage.setItem('loggedUser', JSON.stringify(data.user));

    await launchApp();
  } catch (err) {
    showToast(err.message || 'Login failed', 'error');
  } finally {
    btn.disabled    = false;
    txt.textContent = 'Sign In →';
  }
}

async function launchApp() {
  document.getElementById('login-page').style.display = 'none';
  const app = document.getElementById('app');
  app.style.display = 'flex';
  app.classList.add('active');

  const initials = state.user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('sidebar-avatar').textContent = initials;
  document.getElementById('sidebar-name').textContent   = state.user.name;
  document.getElementById('sidebar-role').textContent   = state.user.role.charAt(0).toUpperCase() + state.user.role.slice(1);

  const roleColors = { admin: '#dc2626', teacher: '#2563a8', student: '#16a34a', staff: '#d97706' };
  document.getElementById('sidebar-avatar').style.background = roleColors[state.user.role] || '#64748b';

  buildNav();
  loadNotifications();

  // Pre-load live users for admin
  if (state.role === 'admin') await loadAllUsers();

  navigateTo('dashboard');
  showToast(`Welcome back, ${state.user.name.split(' ')[0]}! 🎉`, 'success');
}

function doLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('loggedUser');
  document.getElementById('app').style.display = 'none';
  document.getElementById('app').classList.remove('active');
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('notif-panel').classList.remove('open');
  state.user  = null;
  state.token = null;
  state.data.students = [];
  state.data.teachers = [];
  state.data.staff    = [];
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  showToast('Logged out successfully', 'info');
}

// ── BUG FIX #5: Load users now works correctly because the backend
// GET /api/users?role=X is fixed to actually filter by role.
// Each call now returns only the correct role's users.
async function loadAllUsers() {
  try {
    const [students, teachers, staff] = await Promise.all([
      api('/users?role=student'),
      api('/users?role=teacher'),
      api('/users?role=staff'),
    ]);
    state.data.students = students;
    state.data.teachers = teachers;
    state.data.staff    = staff;
  } catch (err) {
    console.error('Failed to load users:', err.message);
  }
}

// ── Forgot password / OTP ──────────────────────────
function showForgot() {
  document.getElementById('login-form-section').style.display = 'none';
  document.getElementById('forgot-section').style.display = 'block';
}

function showLogin() {
  document.getElementById('forgot-section').style.display   = 'none';
  document.getElementById('login-form-section').style.display = 'block';
  document.getElementById('fp-step1').style.display = 'block';
  document.getElementById('fp-step2').style.display = 'none';
  document.getElementById('fp-step3').style.display = 'none';
  ['o1', 'o2', 'o3', 'o4', 'o5', 'o6'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  generatedOTP = '';
}

function sendOTP() {
  const email = document.getElementById('fp-email').value.trim();
  if (!email) { showToast('Please enter your email', 'error'); return; }
  generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
  if (typeof emailjs !== 'undefined') {
    emailjs.send('service_czx0ed8', 'template_jkudzio', { email, otp: generatedOTP })
      .then(() => { showToast('OTP sent to ' + email, 'success'); showOTPStep(); })
      .catch(() => { showToast('OTP: ' + generatedOTP + ' (demo mode)', 'info'); showOTPStep(); });
  } else {
    showToast('OTP: ' + generatedOTP + ' (demo mode)', 'info');
    showOTPStep();
  }
}

function showOTPStep() {
  document.getElementById('fp-step1').style.display = 'none';
  document.getElementById('fp-step2').style.display = 'block';
  setTimeout(() => { const el = document.getElementById('o1'); if (el) el.focus(); }, 100);
}

function otpNext(el, nextId) {
  el.value = el.value.replace(/\D/g, '');
  if (el.value.length === 1 && nextId) { const n = document.getElementById(nextId); if (n) n.focus(); }
}

function verifyOTP() {
  const otp = ['o1', 'o2', 'o3', 'o4', 'o5', 'o6'].map(id => document.getElementById(id)?.value || '').join('');
  if (otp === generatedOTP) {
    showToast('OTP verified!', 'success');
    document.getElementById('fp-step2').style.display = 'none';
    document.getElementById('fp-step3').style.display = 'block';
  } else {
    showToast('Invalid OTP', 'error');
  }
}

function resetPassword() {
  const np = document.getElementById('fp-newpass').value;
  if (!np || np.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
  showToast('Password reset! Please login.', 'success');
  setTimeout(showLogin, 1500);
}

// ── Nav config ─────────────────────────────────────
const navConfig = {
  admin: [
    { section: 'Main', items: [
      { id: 'dashboard',         icon: '📊', label: 'Dashboard' },
      { id: 'students',          icon: '🎓', label: 'Students' },
      { id: 'teachers',          icon: '👨‍🏫', label: 'Teachers' },
      { id: 'staff',             icon: '👥', label: 'Staff' },
    ]},
    { section: 'Academics', items: [
      { id: 'courses',           icon: '📚', label: 'Courses' },
      { id: 'subjects',          icon: '📖', label: 'Subjects' },
      { id: 'exams',             icon: '📝', label: 'Exam Schedule' },
    ]},
    { section: 'Reports', items: [
      { id: 'attendance-report', icon: '📅', label: 'Attendance Report' },
      { id: 'marks-report',      icon: '📈', label: 'Marks Report' },
      { id: 'notices',           icon: '📢', label: 'Notices' },
    ]},
  ],
  teacher: [
    { section: 'Main', items: [
      { id: 'dashboard',          icon: '📊', label: 'Dashboard' },
      { id: 'my-students',        icon: '🎓', label: 'My Students' },
    ]},
    { section: 'Management', items: [
      { id: 'upload-attendance',  icon: '📅', label: 'Upload Attendance' },
      { id: 'internal-marks',     icon: '📝', label: 'Internal Marks' },
      { id: 'final-marks',        icon: '📈', label: 'Final Marks' },
      { id: 'lab-marks',          icon: '💻', label: 'Lab Marks' },
      { id: 'assignments',        icon: '📋', label: 'Assignments' },
    ]},
    { section: 'Info', items: [
      { id: 'notices',            icon: '📢', label: 'Notices' },
    ]},
  ],
  student: [
    { section: 'Main', items: [
      { id: 'dashboard',          icon: '📊', label: 'Dashboard' },
      { id: 'profile',            icon: '👤', label: 'My Profile' },
    ]},
    { section: 'Academics', items: [
      { id: 'my-attendance',      icon: '📅', label: 'Attendance' },
      { id: 'my-marks',           icon: '📈', label: 'My Marks' },
      { id: 'my-lab-marks',       icon: '💻', label: 'Lab Marks' },
      { id: 'course-details',     icon: '📚', label: 'Course Details' },
    ]},
    { section: 'Info', items: [
      { id: 'notices',            icon: '📢', label: 'Notices' },
      { id: 'change-password',    icon: '🔑', label: 'Change Password' },
    ]},
  ],
  staff: [
    { section: 'Main', items: [
      { id: 'dashboard',          icon: '📊', label: 'Dashboard' },
      { id: 'notices',            icon: '📢', label: 'Upload Notices' },
      { id: 'events',             icon: '🎉', label: 'Events & Circulars' },
    ]},
    { section: 'Info', items: [
      { id: 'student-info',       icon: '🎓', label: 'Student Details' },
    ]},
  ],
};

// ── Navigation ─────────────────────────────────────
function buildNav() {
  const menu = document.getElementById('nav-menu');
  menu.innerHTML = '';
  (navConfig[state.role] || []).forEach(section => {
    const label = document.createElement('div');
    label.className   = 'nav-section-label';
    label.textContent = section.section;
    menu.appendChild(label);
    section.items.forEach(item => {
      const btn = document.createElement('button');
      btn.className    = 'nav-item';
      btn.dataset.page = item.id;
      btn.type         = 'button';
      btn.innerHTML    = `<span class="nav-icon">${item.icon}</span><span class="nav-label">${item.label}</span>`;
      btn.onclick      = () => navigateTo(item.id);
      menu.appendChild(btn);
    });
  });
}

// ── BUG FIX #6: navigateTo was declared twice.
// The second declaration overrode the first via a pattern that referenced
// a variable (_origNavigateTo) that was never actually called — dead code.
// Now there is ONE clean navigateTo function that handles both routing
// and admin header button injection without duplication.
function navigateTo(page) {
  state.page = page;
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('active', el.dataset.page === page)
  );
  document.getElementById('page-title').textContent  = findNavLabel(page);
  document.getElementById('page-content').innerHTML  = '<div style="text-align:center;padding:60px;"><span style="font-size:2.5rem;">⏳</span></div>';
  if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('mobile-open');

  // Inject admin action buttons into page header
  if (state.role === 'admin') renderAdminHeaderButtons(page);

  setTimeout(() => renderPage(page), 120);
}

function findNavLabel(page) {
  for (const s of navConfig[state.role] || []) {
    const item = s.items.find(x => x.id === page);
    if (item) return item.label;
  }
  return page.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (window.innerWidth <= 768) sb.classList.toggle('mobile-open');
  else sb.classList.toggle('collapsed');
}

// ── Notifications ──────────────────────────────────
function loadNotifications() {
  const body = document.getElementById('notif-body');
  const dot  = document.getElementById('notif-dot');
  if (!body) return;
  body.innerHTML = state.data.notices.map(n => `
    <div class="notif-item">
      <p><strong>${n.title}</strong></p>
      <p>${n.body.slice(0, 80)}…</p>
      <small>${n.date} &bull; ${n.by}</small>
    </div>`).join('');
  if (dot) dot.style.display = state.data.notices.length ? 'block' : 'none';
}

function toggleNotifPanel() {
  document.getElementById('notif-panel').classList.toggle('open');
}

// ── Page renderer ──────────────────────────────────
function renderPage(page) {
  const c = document.getElementById('page-content');
  if (!c) return;

  const map = {
    dashboard:           'renderDashboard',
    students:            'renderStudents',
    teachers:            'renderTeachers',
    staff:               'renderStaff',
    courses:             'renderCourses',
    subjects:            'renderSubjects',
    exams:               'renderExams',
    'attendance-report': 'renderAttendanceReport',
    'marks-report':      'renderMarksReport',
    notices:             'renderNotices',
    'my-students':       'renderMyStudents',
    'upload-attendance': 'renderUploadAttendance',
    'internal-marks':    'renderInternalMarks',
    'final-marks':       'renderFinalMarks',
    'lab-marks':         'renderLabMarks',
    assignments:         'renderAssignments',
    profile:             'renderStudentProfile',
    'my-attendance':     'renderMyAttendance',
    'my-marks':          'renderMyMarks',
    'my-lab-marks':      'renderMyLabMarks',
    'course-details':    'renderCourseDetails',
    'change-password':   'renderChangePassword',
    events:              'renderEvents',
    'student-info':      'renderStudentInfo',
  };

  const fnName = map[page];
  if (fnName && typeof window[fnName] === 'function') {
    try { window[fnName](c); }
    catch (err) {
      console.error('Render error:', err);
      c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Failed to render <strong>${page}</strong>: ${err.message}</p></div>`;
    }
  } else {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">🚧</div><p>Module under development.</p></div>`;
  }
}

// ── Dashboard dispatcher ───────────────────────────
function renderDashboard(c) {
  if      (state.role === 'admin')   renderAdminDashboard(c);
  else if (state.role === 'teacher') renderTeacherDashboard(c);
  else if (state.role === 'student') renderStudentDashboard(c);
  else                               renderStaffDashboard(c);
}

// ══════════════════════════════════════════════════
//  ADMIN DASHBOARD
// ══════════════════════════════════════════════════
function renderAdminDashboard(c) {
  const s = state.data;
  c.innerHTML = `
  <div class="stats-grid stagger">
    <div class="stat-card"><div class="stat-icon" style="background:rgba(37,99,168,0.1)">🎓</div><div class="stat-info"><h3>${s.students.length}</h3><p>Total Students</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">👨‍🏫</div><div class="stat-info"><h3>${s.teachers.length}</h3><p>Total Teachers</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">👥</div><div class="stat-info"><h3>${s.staff.length}</h3><p>Staff Members</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(139,92,246,0.1)">📚</div><div class="stat-info"><h3>${s.courses.length}</h3><p>Courses Active</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(8,145,178,0.1)">📖</div><div class="stat-info"><h3>${s.subjects.length}</h3><p>Subjects</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(220,38,38,0.1)">📢</div><div class="stat-info"><h3>${s.notices.length}</h3><p>Active Notices</p></div></div>
  </div>
  <div class="charts-row">
    <div class="section-card">
      <div class="section-header"><span class="section-title">📊 Enrollment by Course</span></div>
      <div class="section-body"><div class="chart-container"><canvas id="courseChart"></canvas></div></div>
    </div>
    <div class="section-card">
      <div class="section-header"><span class="section-title">📅 Semester Distribution</span></div>
      <div class="section-body"><div class="chart-container"><canvas id="semChart"></canvas></div></div>
    </div>
  </div>
  <div class="charts-row">
    <div class="section-card">
      <div class="section-header"><span class="section-title">📢 Recent Notices</span><button class="btn btn-primary btn-sm" onclick="navigateTo('notices')">View All</button></div>
      <div class="section-body">${s.notices.slice(0, 3).map(n => `
        <div class="notice-card"><div class="notice-title">${n.title}</div><div class="notice-body">${n.body.slice(0, 80)}…</div>
        <div class="notice-meta"><span>📅 ${n.date}</span><span>👤 ${n.by}</span></div></div>`).join('')}
      </div>
    </div>
    <div class="section-card">
      <div class="section-header"><span class="section-title">📝 Upcoming Exams</span><button class="btn btn-primary btn-sm" onclick="navigateTo('exams')">View All</button></div>
      <div class="section-body"><div class="table-wrap"><table>
        <thead><tr><th>Exam</th><th>Type</th><th>Date</th><th>Room</th></tr></thead>
        <tbody>${s.exams.map(e => `<tr>
          <td>${e.name}</td>
          <td><span class="badge ${e.type === 'Internal' ? 'badge-warning' : e.type === 'Lab' ? 'badge-info' : 'badge-primary'}">${e.type}</span></td>
          <td>${e.date}</td><td>${e.room}</td></tr>`).join('')}</tbody>
      </table></div></div>
    </div>
  </div>`;

  setTimeout(() => {
    if (typeof Chart === 'undefined') return;
    const courseMap = {};
    s.students.forEach(st => { courseMap[st.course || 'Unknown'] = (courseMap[st.course || 'Unknown'] || 0) + 1; });
    const cLabels = Object.keys(courseMap);
    const cData   = Object.values(courseMap);
    new Chart(document.getElementById('courseChart'), {
      type: 'doughnut',
      data: { labels: cLabels.length ? cLabels : ['No students yet'], datasets: [{ data: cData.length ? cData : [1], backgroundColor: ['#2563a8', '#16a34a', '#f0a500', '#8b5cf6'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
    const semMap = {};
    s.students.forEach(st => { const k = 'Sem ' + (st.semester || '?'); semMap[k] = (semMap[k] || 0) + 1; });
    const sLabels = Object.keys(semMap).sort();
    const sData   = sLabels.map(l => semMap[l]);
    new Chart(document.getElementById('semChart'), {
      type: 'bar',
      data: { labels: sLabels.length ? sLabels : ['No data'], datasets: [{ label: 'Students', data: sData.length ? sData : [0], backgroundColor: 'rgba(37,99,168,0.7)', borderRadius: 8 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }, 150);
}

// ── Admin header buttons ───────────────────────────
function renderAdminHeaderButtons(page) {
  const headerRight = document.getElementById('header-right');
  if (!headerRight) return;
  headerRight.querySelectorAll('.admin-action-btn').forEach(el => el.remove());
  if (page === 'students') {
    headerRight.insertAdjacentHTML('afterbegin', `<button class="btn btn-primary admin-action-btn" onclick="openModal('student')">➕ Add Student</button>`);
  } else if (page === 'teachers') {
    headerRight.insertAdjacentHTML('afterbegin', `<button class="btn btn-primary admin-action-btn" onclick="openModal('teacher')">➕ Add Teacher</button>`);
  } else if (page === 'staff') {
    headerRight.insertAdjacentHTML('afterbegin', `<button class="btn btn-primary admin-action-btn" onclick="openModal('staff')">➕ Add Staff</button>`);
  } else if (page === 'dashboard') {
    headerRight.insertAdjacentHTML('afterbegin', `
      <button class="btn btn-primary admin-action-btn" onclick="openModal('student')">➕ Student</button>
      <button class="btn btn-primary admin-action-btn" onclick="openModal('teacher')">➕ Teacher</button>
      <button class="btn btn-primary admin-action-btn" onclick="openModal('staff')">➕ Staff</button>`);
  }
}

// ══════════════════════════════════════════════════
//  MODAL SYSTEM
// ══════════════════════════════════════════════════
function openModal(role, userData = null) {
  const isEdit = !!userData;
  const title  = isEdit ? `Edit ${capitalize(role)}` : `Add New ${capitalize(role)}`;

  const commonFields = `
    <div class="form-grid">
      <div>
        <label class="inp-label">Full Name *</label>
        <input class="inp" id="m-name" type="text" placeholder="e.g. Rahul Sharma" value="${userData?.name || ''}">
      </div>
      <div>
        <label class="inp-label">Username *</label>
        <input class="inp" id="m-username" type="text" placeholder="e.g. rahul01" value="${userData?.username || ''}" ${isEdit ? 'readonly' : ''}>
      </div>
      <div>
        <label class="inp-label">${isEdit ? 'New Password (leave blank to keep)' : 'Password *'}</label>
        <input class="inp" id="m-password" type="password" placeholder="${isEdit ? 'Leave blank to keep current' : 'Min 6 characters'}">
      </div>
      <div>
        <label class="inp-label">Email *</label>
        <input class="inp" id="m-email" type="email" placeholder="user@college.edu" value="${userData?.email || ''}">
      </div>
      <div>
        <label class="inp-label">Phone</label>
        <input class="inp" id="m-phone" type="tel" placeholder="10-digit mobile" value="${userData?.phone || ''}">
      </div>
    </div>`;

  const studentExtra = `
    <hr style="margin:16px 0;border-color:var(--border)">
    <p style="font-weight:700;font-size:0.85rem;margin-bottom:12px;color:var(--text2);">STUDENT DETAILS</p>
    <div class="form-grid">
      <div>
        <label class="inp-label">USN</label>
        <input class="inp" id="m-usn" type="text" placeholder="e.g. 21BCA001" value="${userData?.usn || ''}">
      </div>
      <div>
        <label class="inp-label">Course</label>
        <select class="inp" id="m-course">
          ${state.data.courses.map(c => `<option value="${c.code}" ${userData?.course === c.code ? 'selected' : ''}>${c.code} — ${c.name}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="inp-label">Semester</label>
        <select class="inp" id="m-semester">
          ${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}" ${userData?.semester == n ? 'selected' : ''}>${n}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="inp-label">Gender</label>
        <select class="inp" id="m-gender">
          <option value="Male"   ${userData?.gender === 'Male'   ? 'selected' : ''}>Male</option>
          <option value="Female" ${userData?.gender === 'Female' ? 'selected' : ''}>Female</option>
          <option value="Other"  ${userData?.gender === 'Other'  ? 'selected' : ''}>Other</option>
        </select>
      </div>
      <div>
        <label class="inp-label">Date of Birth</label>
        <input class="inp" id="m-dob" type="date" value="${userData?.dob || ''}">
      </div>
      <div>
        <label class="inp-label">Admission Date</label>
        <input class="inp" id="m-admissionDate" type="date" value="${userData?.admissionDate || ''}">
      </div>
      <div>
        <label class="inp-label">Parent Name</label>
        <input class="inp" id="m-parentName" type="text" placeholder="Parent / Guardian" value="${userData?.parentName || ''}">
      </div>
      <div>
        <label class="inp-label">Parent Phone</label>
        <input class="inp" id="m-parentPhone" type="tel" value="${userData?.parentPhone || ''}">
      </div>
      <div class="form-col-full">
        <label class="inp-label">Address</label>
        <input class="inp" id="m-address" type="text" placeholder="Full address" value="${userData?.address || ''}">
      </div>
    </div>`;

  const teacherExtra = `
    <hr style="margin:16px 0;border-color:var(--border)">
    <p style="font-weight:700;font-size:0.85rem;margin-bottom:12px;color:var(--text2);">TEACHER DETAILS</p>
    <div class="form-grid">
      <div>
        <label class="inp-label">Department</label>
        <input class="inp" id="m-department" type="text" placeholder="e.g. Computer Science" value="${userData?.department || ''}">
      </div>
      <div>
        <label class="inp-label">Qualification</label>
        <input class="inp" id="m-qualification" type="text" placeholder="e.g. Ph.D. CS" value="${userData?.qualification || ''}">
      </div>
      <div>
        <label class="inp-label">Experience (years)</label>
        <input class="inp" id="m-experience" type="number" min="0" value="${userData?.experience || ''}">
      </div>
      <div>
        <label class="inp-label">Gender</label>
        <select class="inp" id="m-gender">
          <option value="Male"   ${userData?.gender === 'Male'   ? 'selected' : ''}>Male</option>
          <option value="Female" ${userData?.gender === 'Female' ? 'selected' : ''}>Female</option>
          <option value="Other"  ${userData?.gender === 'Other'  ? 'selected' : ''}>Other</option>
        </select>
      </div>
      <div>
        <label class="inp-label">Joining Date</label>
        <input class="inp" id="m-joiningDate" type="date" value="${userData?.joiningDate || ''}">
      </div>
      <div class="form-col-full">
        <label class="inp-label">Subjects (comma-separated)</label>
        <input class="inp" id="m-subjects" type="text" placeholder="Java, Data Structures, Python" value="${(userData?.subjects || []).join(', ')}">
      </div>
    </div>`;

  const staffExtra = `
    <hr style="margin:16px 0;border-color:var(--border)">
    <p style="font-weight:700;font-size:0.85rem;margin-bottom:12px;color:var(--text2);">STAFF DETAILS</p>
    <div class="form-grid">
      <div>
        <label class="inp-label">Designation</label>
        <input class="inp" id="m-designation" type="text" placeholder="e.g. Office Superintendent" value="${userData?.designation || ''}">
      </div>
      <div>
        <label class="inp-label">Department</label>
        <input class="inp" id="m-department" type="text" placeholder="e.g. Administration" value="${userData?.department || ''}">
      </div>
      <div>
        <label class="inp-label">Gender</label>
        <select class="inp" id="m-gender">
          <option value="Male"   ${userData?.gender === 'Male'   ? 'selected' : ''}>Male</option>
          <option value="Female" ${userData?.gender === 'Female' ? 'selected' : ''}>Female</option>
          <option value="Other"  ${userData?.gender === 'Other'  ? 'selected' : ''}>Other</option>
        </select>
      </div>
      <div>
        <label class="inp-label">Joining Date</label>
        <input class="inp" id="m-joiningDate" type="date" value="${userData?.joiningDate || ''}">
      </div>
    </div>`;

  const extraFields = { student: studentExtra, teacher: teacherExtra, staff: staffExtra }[role] || '';

  const modalHTML = `
  <div class="modal-overlay" id="user-modal" onclick="closeModalOnOverlay(event)">
    <div class="modal-box">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        ${commonFields}
        ${extraFields}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="submitUserForm('${role}', '${userData?._id || ''}')">
          ${isEdit ? '💾 Update' : '➕ Create Account'}
        </button>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('m-name')?.focus(), 100);
}

function closeModal() {
  const modal = document.getElementById('user-modal');
  if (modal) modal.remove();
  document.body.style.overflow = '';
}

function closeModalOnOverlay(e) {
  if (e.target.id === 'user-modal') closeModal();
}

// ── BUG FIX #10: subjects is now sent as a comma-separated string.
// The backend (server.js) handles the conversion to array.
// Previously the payload sent the raw string directly — backend now
// splits it correctly into String[] before saving to MongoDB.
async function submitUserForm(role, editId = '') {
  const name     = document.getElementById('m-name')?.value.trim();
  const username = document.getElementById('m-username')?.value.trim();
  const password = document.getElementById('m-password')?.value;
  const email    = document.getElementById('m-email')?.value.trim();
  const phone    = document.getElementById('m-phone')?.value.trim();

  if (!name || !username || !email) { showToast('Name, username and email are required.', 'error'); return; }
  if (!editId && !password)          { showToast('Password is required.', 'error'); return; }
  if (!editId && password.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }

  const payload = {
    name, username, email, role,
    ...(phone    ? { phone }    : {}),
    ...(password ? { password } : {}),
    // Student fields
    ...(document.getElementById('m-usn')          ? { usn:           document.getElementById('m-usn').value.trim() }           : {}),
    ...(document.getElementById('m-course')       ? { course:        document.getElementById('m-course').value }                : {}),
    ...(document.getElementById('m-semester')     ? { semester:      document.getElementById('m-semester').value }              : {}),
    ...(document.getElementById('m-gender')       ? { gender:        document.getElementById('m-gender').value }                : {}),
    ...(document.getElementById('m-dob')          ? { dob:           document.getElementById('m-dob').value }                   : {}),
    ...(document.getElementById('m-admissionDate')? { admissionDate: document.getElementById('m-admissionDate').value }         : {}),
    ...(document.getElementById('m-parentName')   ? { parentName:    document.getElementById('m-parentName').value.trim() }     : {}),
    ...(document.getElementById('m-parentPhone')  ? { parentPhone:   document.getElementById('m-parentPhone').value.trim() }    : {}),
    ...(document.getElementById('m-address')      ? { address:       document.getElementById('m-address').value.trim() }        : {}),
    // Teacher fields
    ...(document.getElementById('m-department')   ? { department:    document.getElementById('m-department').value.trim() }     : {}),
    ...(document.getElementById('m-qualification')? { qualification: document.getElementById('m-qualification').value.trim() }  : {}),
    ...(document.getElementById('m-experience')   ? { experience:    document.getElementById('m-experience').value }            : {}),
    // subjects sent as raw string; backend converts to array
    ...(document.getElementById('m-subjects')     ? { subjects:      document.getElementById('m-subjects').value }              : {}),
    ...(document.getElementById('m-joiningDate')  ? { joiningDate:   document.getElementById('m-joiningDate').value }           : {}),
    // Staff fields
    ...(document.getElementById('m-designation')  ? { designation:   document.getElementById('m-designation').value.trim() }   : {}),
  };

  try {
    let result;
    if (editId) {
      result = await api(`/users/${editId}`, { method: 'PUT',  body: JSON.stringify(payload) });
    } else {
      result = await api('/users',           { method: 'POST', body: JSON.stringify(payload) });
    }

    showToast(result.message, 'success');
    closeModal();

    // Refresh live data and re-render current page
    await loadAllUsers();
    renderPage(state.page);

  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteUser(userId, role) {
  if (!confirm(`Are you sure you want to delete this ${role}? This cannot be undone.`)) return;
  try {
    const result = await api(`/users/${userId}`, { method: 'DELETE' });
    showToast(result.message, 'success');
    await loadAllUsers();
    renderPage(state.page);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── BUG FIX #7: toggleUserStatus now hits the correct backend route.
// Previously called /api/users/:id/status which didn't exist → 404.
// Backend now has PATCH /api/users/:id/status to handle this.
async function toggleUserStatus(userId) {
  try {
    const result = await api(`/users/${userId}/status`, { method: 'PATCH' });
    showToast(result.message, 'success');
    await loadAllUsers();
    renderPage(state.page);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ══════════════════════════════════════════════════
//  ADMIN MODULES
// ══════════════════════════════════════════════════
function renderStudents(c) {
  const list = state.data.students;
  c.innerHTML = `
  <div class="section-card">
    <div class="section-header">
      <span class="section-title">🎓 Students (${list.length})</span>
      <button class="btn btn-primary btn-sm" onclick="openModal('student')">➕ Add Student</button>
    </div>
    <div class="section-body">
      ${list.length === 0
        ? `<div class="empty-state"><div class="empty-icon">📭</div><p>No students yet. Click <strong>Add Student</strong> to create the first one!</p></div>`
        : `<div class="table-wrap"><table>
            <thead><tr><th>USN</th><th>Name</th><th>Email</th><th>Course</th><th>Sem</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${list.map(s => `<tr>
              <td><strong>${s.usn || '—'}</strong></td>
              <td>${s.name}</td>
              <td>${s.email}</td>
              <td>${s.course || '—'}</td>
              <td>${s.semester ? 'Sem ' + s.semester : '—'}</td>
              <td><span class="badge ${s.status === 'active' ? 'badge-success' : 'badge-danger'}">${s.status}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="openModal('student', ${JSON.stringify(s).replace(/"/g, '&quot;')})">✏️</button>
                <button class="btn btn-sm btn-secondary" onclick="toggleUserStatus('${s._id}')">${s.status === 'active' ? '🔒' : '🔓'}</button>
                <button class="btn btn-sm btn-danger"    onclick="deleteUser('${s._id}','student')">🗑️</button>
              </td>
            </tr>`).join('')}</tbody>
          </table></div>`}
    </div>
  </div>`;
}

function renderTeachers(c) {
  const list = state.data.teachers;
  c.innerHTML = `
  <div class="section-card">
    <div class="section-header">
      <span class="section-title">👨‍🏫 Teachers (${list.length})</span>
      <button class="btn btn-primary btn-sm" onclick="openModal('teacher')">➕ Add Teacher</button>
    </div>
    <div class="section-body">
      ${list.length === 0
        ? `<div class="empty-state"><div class="empty-icon">📭</div><p>No teachers yet. Click <strong>Add Teacher</strong> to add one.</p></div>`
        : `<div class="table-wrap"><table>
            <thead><tr><th>Name</th><th>Email</th><th>Dept</th><th>Qualification</th><th>Exp</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${list.map(t => `<tr>
              <td><strong>${t.name}</strong></td>
              <td>${t.email}</td>
              <td>${t.department || '—'}</td>
              <td>${t.qualification || '—'}</td>
              <td>${t.experience != null ? t.experience + ' yrs' : '—'}</td>
              <td><span class="badge ${t.status === 'active' ? 'badge-success' : 'badge-danger'}">${t.status}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="openModal('teacher', ${JSON.stringify(t).replace(/"/g, '&quot;')})">✏️</button>
                <button class="btn btn-sm btn-secondary" onclick="toggleUserStatus('${t._id}')">${t.status === 'active' ? '🔒' : '🔓'}</button>
                <button class="btn btn-sm btn-danger"    onclick="deleteUser('${t._id}','teacher')">🗑️</button>
              </td>
            </tr>`).join('')}</tbody>
          </table></div>`}
    </div>
  </div>`;
}

function renderStaff(c) {
  const list = state.data.staff;
  c.innerHTML = `
  <div class="section-card">
    <div class="section-header">
      <span class="section-title">👥 Staff (${list.length})</span>
      <button class="btn btn-primary btn-sm" onclick="openModal('staff')">➕ Add Staff</button>
    </div>
    <div class="section-body">
      ${list.length === 0
        ? `<div class="empty-state"><div class="empty-icon">📭</div><p>No staff yet. Click <strong>Add Staff</strong> to add one.</p></div>`
        : `<div class="table-wrap"><table>
            <thead><tr><th>Name</th><th>Email</th><th>Designation</th><th>Dept</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${list.map(s => `<tr>
              <td><strong>${s.name}</strong></td>
              <td>${s.email}</td>
              <td>${s.designation || '—'}</td>
              <td>${s.department || '—'}</td>
              <td><span class="badge ${s.status === 'active' ? 'badge-success' : 'badge-danger'}">${s.status}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="openModal('staff', ${JSON.stringify(s).replace(/"/g, '&quot;')})">✏️</button>
                <button class="btn btn-sm btn-secondary" onclick="toggleUserStatus('${s._id}')">${s.status === 'active' ? '🔒' : '🔓'}</button>
                <button class="btn btn-sm btn-danger"    onclick="deleteUser('${s._id}','staff')">🗑️</button>
              </td>
            </tr>`).join('')}</tbody>
          </table></div>`}
    </div>
  </div>`;
}

function renderCourses(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">📚 Courses</span></div><div class="section-body">
    <div class="stats-grid">${state.data.courses.map(course => `
      <div class="stat-card" style="flex-direction:column;align-items:flex-start;gap:8px;">
        <div style="font-weight:800;font-size:1.1rem;">${course.code}</div>
        <div style="font-size:0.85rem;color:var(--text2);">${course.name}</div>
        <div style="font-size:0.8rem;color:var(--text2);">⏱ ${course.duration} Years
          &nbsp; 🎓 ${state.data.students.filter(s => s.course === course.code).length} Students</div>
      </div>`).join('')}
    </div>
  </div></div>`;
}

function renderSubjects(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">📖 Subjects</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>Code</th><th>Subject</th><th>Course</th><th>Sem</th><th>Credits</th><th>Lab</th></tr></thead>
    <tbody>${state.data.subjects.map(sub => `<tr>
      <td><code>${sub.code}</code></td><td>${sub.name}</td><td>${sub.course}</td><td>Sem ${sub.sem}</td><td>${sub.credits}</td>
      <td>${sub.lab ? '<span class="badge badge-info">Yes</span>' : '—'}</td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

function renderExams(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">📝 Exam Schedule</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>Exam</th><th>Type</th><th>Subject</th><th>Date</th><th>Time</th><th>Room</th></tr></thead>
    <tbody>${state.data.exams.map(e => `<tr>
      <td><strong>${e.name}</strong></td>
      <td><span class="badge ${e.type === 'Internal' ? 'badge-warning' : e.type === 'Lab' ? 'badge-info' : 'badge-primary'}">${e.type}</span></td>
      <td>${e.subject}</td><td>${e.date}</td><td>${e.time}</td><td>${e.room}</td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

async function renderAttendanceReport(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading from database…</div>';
  try {
    const grouped = await api('/attendance/all');
    const usnList = Object.keys(grouped);
    if (usnList.length === 0) {
      c.innerHTML = `<div class="section-card"><div class="section-body"><div class="empty-state"><div class="empty-icon">📭</div><p>No attendance data yet.</p></div></div></div>`;
      return;
    }
    const allSubjects = [...new Set(usnList.flatMap(usn => Object.keys(grouped[usn])))].sort();
    c.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">📅 Attendance Report <span style="font-size:0.75rem;color:var(--success);font-weight:600;">● Live from MongoDB</span></span>
      </div>
      <div class="section-body"><div class="table-wrap"><table>
        <thead><tr><th>USN</th><th>Name</th>${allSubjects.map(s => `<th>${s}</th>`).join('')}<th>Avg</th></tr></thead>
        <tbody>${usnList.map(usn => {
          const student = state.data.students.find(s => s.usn === usn) || {};
          const vals    = Object.values(grouped[usn]);
          const avg     = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
          return `<tr>
            <td><strong>${usn}</strong></td>
            <td>${student.name || '—'}</td>
            ${allSubjects.map(sub => {
              const v = grouped[usn][sub];
              return v !== undefined
                ? `<td><span class="badge ${v >= 75 ? 'badge-success' : v >= 60 ? 'badge-warning' : 'badge-danger'}">${v}%</span></td>`
                : '<td>—</td>';
            }).join('')}
            <td><strong>${avg}%</strong></td></tr>`;
        }).join('')}</tbody>
      </table></div></div>
    </div>`;
  } catch (err) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

async function renderMarksReport(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading from database…</div>';
  try {
    const grouped = await api('/marks/all');
    const usnList = Object.keys(grouped);
    if (usnList.length === 0) {
      c.innerHTML = `<div class="section-card"><div class="section-body"><div class="empty-state"><div class="empty-icon">📭</div><p>No marks data yet.</p></div></div></div>`;
      return;
    }
    c.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">📈 Marks Report <span style="font-size:0.75rem;color:var(--success);font-weight:600;">● Live from MongoDB</span></span>
      </div>
      <div class="section-body"><div class="table-wrap"><table>
        <thead><tr><th>USN</th><th>Name</th><th>Subject</th><th>Internal</th><th>Final</th><th>Lab Int</th><th>Lab Ext</th></tr></thead>
        <tbody>${usnList.flatMap(usn => {
          const student = state.data.students.find(s => s.usn === usn) || {};
          return Object.entries(grouped[usn]).map(([subCode, data]) => `
            <tr>
              <td>${usn}</td><td>${student.name || '—'}</td>
              <td>${data.subjectName || subCode}</td>
              <td>${data.internal ?? '—'}</td><td>${data.final ?? '—'}</td>
              <td>${data.lab_internal ?? '—'}</td><td>${data.lab_external ?? '—'}</td>
            </tr>`);
        }).join('')}
        </tbody>
      </table></div></div>
    </div>`;
  } catch (err) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

function renderNotices(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">📢 Notices</span></div><div class="section-body">
    ${state.data.notices.map(n => `<div class="notice-card">
      <div class="notice-title">${n.title}</div><div class="notice-body">${n.body}</div>
      <div class="notice-meta"><span>📅 ${n.date}</span><span>👤 ${n.by}</span><span class="badge badge-info">${n.target}</span></div>
    </div>`).join('')}
  </div></div>`;
}

// ══════════════════════════════════════════════════
//  TEACHER MODULES
// ══════════════════════════════════════════════════
function renderTeacherDashboard(c) {
  const initials = state.user.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  c.innerHTML = `
  <div class="profile-header" style="margin-bottom:24px;">
    <div class="profile-avatar">${initials}</div>
    <div class="profile-info">
      <h2>${state.user.name}</h2>
      <p>${state.user.department || 'Computer Science'} Department</p>
      <div class="profile-badges">
        <span class="profile-badge">👨‍🏫 Faculty</span>
        ${state.user.subjects?.length ? `<span class="profile-badge">📚 ${state.user.subjects.length} Subjects</span>` : ''}
        ${state.user.experience      ? `<span class="profile-badge">⏱ ${state.user.experience} yrs exp</span>` : ''}
      </div>
    </div>
  </div>
  <div class="stats-grid stagger">
    <div class="stat-card"><div class="stat-icon" style="background:rgba(37,99,168,0.1)">🎓</div><div class="stat-info"><h3 id="t-student-count">…</h3><p>Total Students</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">📖</div><div class="stat-info"><h3>${state.user.subjects?.length || '—'}</h3><p>Subjects</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">📢</div><div class="stat-info"><h3>${state.data.notices.length}</h3><p>Active Notices</p></div></div>
  </div>
  <div class="section-card">
    <div class="section-header"><span class="section-title">📅 Attendance Overview</span></div>
    <div class="section-body"><div class="chart-container"><canvas id="tchart"></canvas></div></div>
  </div>`;

  api('/users?role=student').then(students => {
    const el = document.getElementById('t-student-count');
    if (el) el.textContent = students.length;

    if (typeof Chart !== 'undefined') {
      const canvas = document.getElementById('tchart');
      if (!canvas) return;
      const labels   = students.slice(0, 8).map(s => s.name.split(' ')[0]);
      const fakeData = labels.map(() => Math.floor(Math.random() * 40) + 60);
      new Chart(canvas, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Attendance %', data: fakeData, backgroundColor: 'rgba(37,99,168,0.7)', borderRadius: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
      });
    }
  }).catch(() => {});
}

function renderMyStudents(c) {
  const list = state.data.students;
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">🎓 Students</span></div><div class="section-body">
    ${list.length === 0
      ? `<div class="empty-state"><div class="empty-icon">📭</div><p>No students found.</p></div>`
      : `<div class="table-wrap"><table>
          <thead><tr><th>USN</th><th>Name</th><th>Course</th><th>Sem</th><th>Phone</th></tr></thead>
          <tbody>${list.map(s => `<tr>
            <td><strong>${s.usn || '—'}</strong></td><td>${s.name}</td>
            <td>${s.course || '—'}</td><td>${s.semester ? 'Sem ' + s.semester : '—'}</td><td>${s.phone || '—'}</td>
          </tr>`).join('')}</tbody>
        </table></div>`}
  </div></div>`;
}

async function renderUploadAttendance(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading…</div>';
  let grouped  = {};
  try { grouped = await api('/attendance/all'); } catch(e) {}

  let students = state.data.students;
  try { students = await api('/users?role=student'); state.data.students = students; } catch(e) {}

  const defaultSubject = state.data.subjects[0]?.code || 'BCA101';
  c.innerHTML = `
  <div class="section-card">
    <div class="section-header">
      <span class="section-title">📅 Upload Attendance</span>
      <div style="display:flex;align-items:center;gap:10px;">
        <label class="inp-label" style="margin:0;">Subject:</label>
        <select class="inp" id="att-subject" style="width:220px;" onchange="refreshAttendanceInputs()">
          ${state.data.subjects.filter(s => s.course === 'BCA').map(s =>
            `<option value="${s.code}">${s.code} — ${s.name}</option>`
          ).join('')}
        </select>
      </div>
    </div>
    <div class="section-body">
      <div class="table-wrap"><table>
        <thead><tr><th>USN</th><th>Name</th><th>Semester</th><th>Attendance % (0–100)</th></tr></thead>
        <tbody id="att-tbody">${students.map(s => `<tr>
          <td><strong>${s.usn || '—'}</strong></td><td>${s.name}</td><td>${s.semester ? 'Sem ' + s.semester : '—'}</td>
          <td><input class="marks-input" type="number" min="0" max="100" id="att-${s.usn}"
            value="${grouped[s.usn]?.[defaultSubject] ?? ''}" placeholder="0–100"></td>
        </tr>`).join('')}</tbody>
      </table></div>
      <br>
      <button class="btn btn-primary" onclick="saveAttendance()">💾 Save to MongoDB</button>
      <span id="att-status" style="margin-left:12px;font-size:0.85rem;color:var(--text2);"></span>
    </div>
  </div>`;
}

// ── BUG FIX #8/#9: Refresh input values when the subject dropdown changes.
// Previously inputs always showed values for hardcoded 'BCA601'.
// Now re-populates based on the selected subject.
function refreshAttendanceInputs() {
  const subject  = document.getElementById('att-subject')?.value;
  const students = state.data.students;
  if (!subject || !students.length) return;

  api('/attendance/all').then(grouped => {
    students.forEach(s => {
      const el = document.getElementById(`att-${s.usn}`);
      if (el) el.value = grouped[s.usn]?.[subject] ?? '';
    });
  }).catch(() => {});
}

async function saveAttendance() {
  const subjectEl = document.getElementById('att-subject');
  const subject   = subjectEl ? subjectEl.value : 'BCA101';
  const students  = state.data.students;

  const records = students.map(s => {
    const el = document.getElementById(`att-${s.usn}`);
    return el && el.value !== '' && s.usn ? { usn: s.usn, subject, percentage: Number(el.value) } : null;
  }).filter(Boolean);

  if (records.length === 0) { showToast('No values to save', 'error'); return; }
  const statusEl = document.getElementById('att-status');
  if (statusEl) statusEl.textContent = 'Saving…';
  try {
    const res = await api('/attendance', { method: 'POST', body: JSON.stringify(records) });
    showToast(`✅ ${res.message}`, 'success');
    if (statusEl) statusEl.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
  } catch(err) {
    showToast('Save failed: ' + err.message, 'error');
    if (statusEl) statusEl.textContent = 'Save failed';
  }
}

async function renderInternalMarks(c) { await renderMarksPage(c, 'internal', 'Internal Marks', '📝', 50); }
async function renderFinalMarks(c)    { await renderMarksPage(c, 'final',    'Final Marks',    '📈', 100); }

// ── BUG FIX #8: renderMarksPage previously hard-coded 'BCA601' for
// existing-value lookups. Now uses the first option as the default and
// refreshes inputs when the subject dropdown changes.
async function renderMarksPage(c, type, title, icon, max) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading…</div>';
  let grouped  = {};
  try { grouped = await api('/marks/all'); } catch(e) {}

  let students = state.data.students;
  try { students = await api('/users?role=student'); state.data.students = students; } catch(e) {}

  const availableSubjects = state.data.subjects.filter(s => s.course === 'BCA');
  const defaultSubCode    = availableSubjects[0]?.code || 'BCA101';

  c.innerHTML = `
  <div class="section-card">
    <div class="section-header">
      <span class="section-title">${icon} ${title}</span>
      <div style="display:flex;align-items:center;gap:10px;">
        <label class="inp-label" style="margin:0;">Subject:</label>
        <select class="inp" id="${type}-subject" style="width:220px;" onchange="refreshMarksInputs('${type}')">
          ${availableSubjects.map(s => `<option value="${s.code}|${s.name}">${s.code} — ${s.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="section-body">
      <div class="table-wrap"><table>
        <thead><tr><th>USN</th><th>Name</th><th>${title} (0–${max})</th></tr></thead>
        <tbody>${students.map(s => `<tr>
          <td><strong>${s.usn || '—'}</strong></td><td>${s.name}</td>
          <td><input class="marks-input" type="number" min="0" max="${max}" id="${type}-${s.usn}"
            value="${grouped[s.usn]?.[defaultSubCode]?.[type] ?? ''}" placeholder="0–${max}"></td>
        </tr>`).join('')}</tbody>
      </table></div>
      <br>
      <button class="btn btn-primary" onclick="saveMarks('${type}',${max})">💾 Save to MongoDB</button>
      <span id="${type}-status" style="margin-left:12px;font-size:0.85rem;color:var(--text2);"></span>
    </div>
  </div>`;
}

// Refresh marks inputs when subject changes
function refreshMarksInputs(type) {
  const selectEl = document.getElementById(`${type}-subject`);
  if (!selectEl) return;
  const [subCode] = selectEl.value.split('|');
  const students  = state.data.students;

  api('/marks/all').then(grouped => {
    students.forEach(s => {
      const el = document.getElementById(`${type}-${s.usn}`);
      if (el) el.value = grouped[s.usn]?.[subCode]?.[type] ?? '';
    });
  }).catch(() => {});
}

async function saveMarks(type, max) {
  const subjectEl = document.getElementById(`${type}-subject`);
  const [subjectCode, subjectName] = subjectEl ? subjectEl.value.split('|') : ['BCA101', 'Mathematics Foundation'];
  const students  = state.data.students;

  const records = students.map(s => {
    const el = document.getElementById(`${type}-${s.usn}`);
    return el && el.value !== '' && s.usn
      ? { usn: s.usn, subject: subjectCode, subjectName, type, marks: Number(el.value), maxMarks: max }
      : null;
  }).filter(Boolean);

  if (records.length === 0) { showToast('No values to save', 'error'); return; }
  const statusEl = document.getElementById(`${type}-status`);
  if (statusEl) statusEl.textContent = 'Saving…';
  try {
    const res = await api('/marks', { method: 'POST', body: JSON.stringify(records) });
    showToast(`✅ ${res.message}`, 'success');
    if (statusEl) statusEl.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
  } catch(err) {
    showToast('Save failed: ' + err.message, 'error');
    if (statusEl) statusEl.textContent = 'Save failed';
  }
}

// ── BUG FIX #9: renderLabMarks previously used hardcoded 'BCA601'
// for looking up existing lab marks. Now uses the selected subject dynamically.
async function renderLabMarks(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading…</div>';
  let grouped  = {};
  try { grouped = await api('/marks/all'); } catch(e) {}

  let students = state.data.students;
  try { students = await api('/users?role=student'); state.data.students = students; } catch(e) {}

  const labSubjects    = state.data.subjects.filter(s => s.lab && s.course === 'BCA');
  const defaultSubCode = labSubjects[0]?.code || 'BCA103';

  c.innerHTML = `
  <div class="section-card">
    <div class="section-header">
      <span class="section-title">💻 Lab Marks</span>
      <div style="display:flex;align-items:center;gap:10px;">
        <label class="inp-label" style="margin:0;">Subject:</label>
        <select class="inp" id="lab-subject" style="width:220px;" onchange="refreshLabInputs()">
          ${labSubjects.map(s => `<option value="${s.code}|${s.name}">${s.code} — ${s.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="section-body">
      <div class="table-wrap"><table>
        <thead><tr><th>USN</th><th>Name</th><th>Lab Internal (0–50)</th><th>Lab External (0–50)</th></tr></thead>
        <tbody>${students.map(s => `<tr>
          <td><strong>${s.usn || '—'}</strong></td><td>${s.name}</td>
          <td><input class="marks-input" type="number" min="0" max="50" id="labint-${s.usn}"
            value="${grouped[s.usn]?.[defaultSubCode]?.lab_internal ?? ''}" placeholder="0–50"></td>
          <td><input class="marks-input" type="number" min="0" max="50" id="labext-${s.usn}"
            value="${grouped[s.usn]?.[defaultSubCode]?.lab_external ?? ''}" placeholder="0–50"></td>
        </tr>`).join('')}</tbody>
      </table></div>
      <br>
      <button class="btn btn-primary" onclick="saveLabMarks()">💾 Save to MongoDB</button>
      <span id="lab-status" style="margin-left:12px;font-size:0.85rem;color:var(--text2);"></span>
    </div>
  </div>`;
}

function refreshLabInputs() {
  const selectEl = document.getElementById('lab-subject');
  if (!selectEl) return;
  const [subCode] = selectEl.value.split('|');
  const students  = state.data.students;

  api('/marks/all').then(grouped => {
    students.forEach(s => {
      const intEl = document.getElementById(`labint-${s.usn}`);
      const extEl = document.getElementById(`labext-${s.usn}`);
      if (intEl) intEl.value = grouped[s.usn]?.[subCode]?.lab_internal ?? '';
      if (extEl) extEl.value = grouped[s.usn]?.[subCode]?.lab_external ?? '';
    });
  }).catch(() => {});
}

async function saveLabMarks() {
  const subjectEl = document.getElementById('lab-subject');
  const [subjectCode, subjectName] = subjectEl ? subjectEl.value.split('|') : ['BCA103', 'C Programming'];
  const students  = state.data.students;
  const records   = [];

  students.forEach(s => {
    if (!s.usn) return;
    const intEl = document.getElementById(`labint-${s.usn}`);
    const extEl = document.getElementById(`labext-${s.usn}`);
    if (intEl && intEl.value !== '') records.push({ usn: s.usn, subject: subjectCode, subjectName, type: 'lab_internal', marks: Number(intEl.value), maxMarks: 50 });
    if (extEl && extEl.value !== '') records.push({ usn: s.usn, subject: subjectCode, subjectName, type: 'lab_external', marks: Number(extEl.value), maxMarks: 50 });
  });

  if (records.length === 0) { showToast('No values to save', 'error'); return; }
  const statusEl = document.getElementById('lab-status');
  if (statusEl) statusEl.textContent = 'Saving…';
  try {
    const res = await api('/marks', { method: 'POST', body: JSON.stringify(records) });
    showToast(`✅ ${res.message}`, 'success');
    if (statusEl) statusEl.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
  } catch(err) {
    showToast('Save failed: ' + err.message, 'error');
    if (statusEl) statusEl.textContent = 'Save failed';
  }
}

function renderAssignments(c) {
  const assignments = [
    { title: 'Java Programming Assignment', subject: 'Java',   due: '2024-05-20', status: 'Pending'   },
    { title: 'DBMS ER Diagram',             subject: 'DBMS',   due: '2024-05-25', status: 'Pending'   },
    { title: 'Python Data Analysis',        subject: 'Python', due: '2024-05-30', status: 'Submitted' },
  ];
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">📋 Assignments</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>Title</th><th>Subject</th><th>Due</th><th>Status</th></tr></thead>
    <tbody>${assignments.map(a => `<tr>
      <td><strong>${a.title}</strong></td><td>${a.subject}</td><td>${a.due}</td>
      <td><span class="badge ${a.status === 'Pending' ? 'badge-warning' : 'badge-success'}">${a.status}</span></td>
    </tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

// ══════════════════════════════════════════════════
//  STUDENT MODULES
// ══════════════════════════════════════════════════
async function renderStudentDashboard(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;font-size:1.5rem;">⏳ Loading your data…</div>';
  try {
    const { attendance, marks } = await api('/student/summary');
    const vals   = Object.values(attendance);
    const avgAtt = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    c.innerHTML = `
    <div class="profile-header" style="margin-bottom:24px;">
      <div class="profile-avatar">${state.user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
      <div class="profile-info">
        <h2>${state.user.name}</h2>
        <p>USN: ${state.user.usn || '—'} &nbsp;|&nbsp; ${state.user.course || 'BCA'} — Semester ${state.user.semester || '?'}</p>
        <div class="profile-badges">
          <span class="profile-badge">📚 ${state.user.course || 'BCA'}</span>
          <span class="profile-badge">📅 Semester ${state.user.semester || '?'}</span>
          <span class="profile-badge" style="background:rgba(255,165,0,0.2)">🔄 Live from DB</span>
        </div>
      </div>
    </div>
    <div class="stats-grid stagger">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(37,99,168,0.1)">📅</div>
        <div class="stat-info"><h3>${avgAtt}%</h3><p>Overall Attendance</p>
          <span class="stat-change ${avgAtt >= 75 ? 'change-up' : 'change-down'}">${avgAtt >= 75 ? '✓ Good Standing' : '⚠️ Below 75%'}</span>
        </div>
      </div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">📖</div><div class="stat-info"><h3>${Object.keys(attendance).length}</h3><p>Subjects Tracked</p></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">📈</div><div class="stat-info"><h3>${marks.length}</h3><p>Subjects with Marks</p></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(8,145,178,0.1)">📢</div><div class="stat-info"><h3>${state.data.notices.length}</h3><p>Notices</p></div></div>
    </div>
    <div class="charts-row">
      <div class="section-card">
        <div class="section-header"><span class="section-title">📅 Subject-wise Attendance <span style="font-size:0.75rem;color:var(--success);font-weight:600;">● Live</span></span></div>
        <div class="section-body">
          ${Object.keys(attendance).length === 0
            ? '<p style="color:var(--text2);">No attendance data yet. Ask your teacher to upload.</p>'
            : Object.entries(attendance).map(([code, pct]) => `
              <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                  <span style="font-size:0.85rem;font-weight:600;">${code}</span>
                  <span style="font-size:0.85rem;font-weight:700;color:${pct >= 75 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)'}">${pct}%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill ${pct >= 75 ? 'progress-good' : pct >= 60 ? 'progress-warn' : 'progress-bad'}" style="width:${pct}%"></div></div>
              </div>`).join('')}
        </div>
      </div>
      <div class="section-card">
        <div class="section-header"><span class="section-title">📢 Latest Notices</span></div>
        <div class="section-body">${state.data.notices.slice(0, 3).map(n => `
          <div class="notice-card"><div class="notice-title">${n.title}</div>
          <div class="notice-body">${n.body.slice(0, 70)}…</div>
          <div class="notice-meta"><span>${n.date}</span></div></div>`).join('')}
        </div>
      </div>
    </div>`;
  } catch (err) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load data: ${err.message}</p></div>`;
  }
}

function renderStudentProfile(c) {
  const u        = state.user;
  const initials = u.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  c.innerHTML = `
  <div class="section-card"><div class="section-header"><span class="section-title">👤 My Profile</span></div><div class="section-body">
    <div class="profile-header">
      <div class="profile-avatar">${initials}</div>
      <div class="profile-info">
        <h2>${u.name}</h2>
        <p>USN: ${u.usn || '—'}</p><p>Email: ${u.email}</p>
        <div class="profile-badges">
          <span class="profile-badge">📚 ${u.course || 'BCA'}</span>
          <span class="profile-badge">📅 Semester ${u.semester || '?'}</span>
        </div>
      </div>
    </div>
    <div class="form-grid" style="margin-top:20px;">
      <div><div class="inp-label">Phone</div><div class="inp">${u.phone || '—'}</div></div>
      <div><div class="inp-label">Date of Birth</div><div class="inp">${u.dob || '—'}</div></div>
      <div><div class="inp-label">Gender</div><div class="inp">${u.gender || '—'}</div></div>
      <div><div class="inp-label">Admission Date</div><div class="inp">${u.admissionDate || '—'}</div></div>
      <div><div class="inp-label">Parent Name</div><div class="inp">${u.parentName || '—'}</div></div>
      <div><div class="inp-label">Parent Phone</div><div class="inp">${u.parentPhone || '—'}</div></div>
      <div class="form-col-full"><div class="inp-label">Address</div><div class="inp">${u.address || '—'}</div></div>
    </div>
  </div></div>`;
}

async function renderMyAttendance(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading from database…</div>';
  try {
    const { attendance } = await api('/student/summary');
    c.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">📅 My Attendance <span style="font-size:0.75rem;color:var(--success);font-weight:600;">● Live from MongoDB</span></span>
      </div>
      <div class="section-body">
        ${Object.keys(attendance).length === 0
          ? '<div class="empty-state"><div class="empty-icon">📭</div><p>No attendance uploaded yet.</p></div>'
          : Object.entries(attendance).map(([code, pct]) => {
              const subName = state.data.subjects.find(s => s.code === code)?.name || code;
              return `<div style="margin-bottom:18px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                  <span style="font-weight:600;">${code} — ${subName}</span>
                  <strong style="color:${pct >= 75 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)'}">${pct}%</strong>
                </div>
                <div class="progress-bar"><div class="progress-fill ${pct >= 75 ? 'progress-good' : pct >= 60 ? 'progress-warn' : 'progress-bad'}" style="width:${pct}%"></div></div>
                <div style="font-size:0.75rem;color:var(--text2);margin-top:3px;">${pct >= 75 ? '✓ Eligible' : '⚠️ Below 75% — shortage'}</div>
              </div>`;
            }).join('')}
      </div>
    </div>`;
  } catch(err) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

async function renderMyMarks(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading from database…</div>';
  try {
    const { marks } = await api('/student/summary');
    c.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">📈 My Marks <span style="font-size:0.75rem;color:var(--success);font-weight:600;">● Live from MongoDB</span></span>
      </div>
      <div class="section-body">
        ${marks.length === 0
          ? '<div class="empty-state"><div class="empty-icon">📭</div><p>No marks entered yet.</p></div>'
          : `<div class="table-wrap"><table>
              <thead><tr><th>Subject</th><th>Code</th><th>Internal /50</th><th>Final /100</th><th>Total</th><th>Grade</th></tr></thead>
              <tbody>${marks.map(m => {
                const internal = m.internal ?? 0;
                const final    = m.final    ?? 0;
                const total    = internal + final;
                const pct      = Math.round(total / 150 * 100);
                const grade    = pct >= 90 ? 'O' : pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : 'F';
                return `<tr>
                  <td>${m.sub || m.code}</td><td>${m.code}</td>
                  <td>${m.internal ?? '—'}</td><td>${m.final ?? '—'}</td>
                  <td><strong>${total}</strong></td>
                  <td><span class="badge ${grade === 'F' ? 'badge-danger' : grade === 'B' || grade === 'B+' ? 'badge-warning' : 'badge-success'}">${grade}</span></td>
                </tr>`;
              }).join('')}</tbody>
            </table></div>`}
      </div>
    </div>`;
  } catch(err) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

async function renderMyLabMarks(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading from database…</div>';
  try {
    const { marks } = await api('/student/summary');
    const labMarks  = marks.filter(m => m.lab_int != null || m.lab_ext != null);
    c.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">💻 Lab Marks <span style="font-size:0.75rem;color:var(--success);font-weight:600;">● Live from MongoDB</span></span>
      </div>
      <div class="section-body">
        ${labMarks.length === 0
          ? '<div class="empty-state"><div class="empty-icon">📭</div><p>No lab marks entered yet.</p></div>'
          : `<div class="table-wrap"><table>
              <thead><tr><th>Subject</th><th>Code</th><th>Lab Internal /50</th><th>Lab External /50</th><th>Total /100</th></tr></thead>
              <tbody>${labMarks.map(m => `<tr>
                <td>${m.sub || m.code}</td><td>${m.code}</td>
                <td>${m.lab_int ?? '—'}</td><td>${m.lab_ext ?? '—'}</td>
                <td><strong>${(m.lab_int ?? 0) + (m.lab_ext ?? 0)}</strong></td>
              </tr>`).join('')}</tbody>
            </table></div>`}
      </div>
    </div>`;
  } catch(err) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

function renderCourseDetails(c) {
  const course = state.user.course || 'BCA';
  const subs   = state.data.subjects.filter(s => s.course === course);
  c.innerHTML  = `<div class="section-card"><div class="section-header"><span class="section-title">📚 Course Details — ${course}</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>Code</th><th>Subject</th><th>Sem</th><th>Credits</th><th>Lab</th></tr></thead>
    <tbody>${subs.map(sub => `<tr>
      <td><code>${sub.code}</code></td><td>${sub.name}</td><td>Sem ${sub.sem}</td><td>${sub.credits}</td>
      <td>${sub.lab ? '<span class="badge badge-info">Yes</span>' : '—'}</td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

async function renderChangePassword(c) {
  c.innerHTML = `
  <div class="section-card"><div class="section-header"><span class="section-title">🔑 Change Password</span></div><div class="section-body">
    <div style="max-width:420px;">
      <div style="margin-bottom:16px;"><label class="inp-label">Current Password</label>
        <input type="password" class="inp" id="cp-current" placeholder="Enter current password"></div>
      <div style="margin-bottom:16px;"><label class="inp-label">New Password</label>
        <input type="password" class="inp" id="cp-new" placeholder="Min 6 characters"></div>
      <div style="margin-bottom:20px;"><label class="inp-label">Confirm New Password</label>
        <input type="password" class="inp" id="cp-confirm" placeholder="Confirm new password"></div>
      <button class="btn btn-primary" onclick="doChangePassword()">🔐 Update Password</button>
    </div>
  </div></div>`;
}

async function doChangePassword() {
  const currentPassword = document.getElementById('cp-current').value;
  const newPassword     = document.getElementById('cp-new').value;
  const confirm         = document.getElementById('cp-confirm').value;
  if (!currentPassword || !newPassword || !confirm) { showToast('Please fill all fields', 'error'); return; }
  if (newPassword.length < 6) { showToast('New password must be ≥ 6 characters', 'error'); return; }
  if (newPassword !== confirm) { showToast('Passwords do not match', 'error'); return; }
  try {
    const res = await api('/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) });
    showToast(res.message, 'success');
    ['cp-current', 'cp-new', 'cp-confirm'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  } catch(err) {
    showToast(err.message, 'error');
  }
}

// ══════════════════════════════════════════════════
//  STAFF MODULES
// ══════════════════════════════════════════════════
function renderStaffDashboard(c) {
  const initials = state.user.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  c.innerHTML = `
  <div class="profile-header" style="margin-bottom:24px;">
    <div class="profile-avatar">${initials}</div>
    <div class="profile-info">
      <h2>${state.user.name}</h2>
      <p>${state.user.designation || 'Staff'} — ${state.user.department || 'Administration'}</p>
      <div class="profile-badges"><span class="profile-badge">🏢 ${state.user.department || 'Administration'}</span></div>
    </div>
  </div>
  <div class="stats-grid stagger">
    <div class="stat-card"><div class="stat-icon" style="background:rgba(37,99,168,0.1)">📢</div><div class="stat-info"><h3>${state.data.notices.length}</h3><p>Active Notices</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">🎉</div><div class="stat-info"><h3>${state.data.events.length}</h3><p>Upcoming Events</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">🎓</div><div class="stat-info"><h3 id="staff-student-count">…</h3><p>Students</p></div></div>
  </div>
  <div class="section-card">
    <div class="section-header"><span class="section-title">🎉 Upcoming Events</span><button class="btn btn-primary btn-sm" onclick="navigateTo('events')">Manage</button></div>
    <div class="section-body">${state.data.events.map(e => `
      <div class="notice-card" style="border-left-color:var(--accent)">
        <div class="notice-title">${e.title}</div><div class="notice-body">${e.desc}</div>
        <div class="notice-meta"><span>📅 ${e.date}</span><span class="badge badge-info">${e.type}</span></div>
      </div>`).join('')}
    </div>
  </div>`;

  api('/users?role=student')
    .then(list => { const el = document.getElementById('staff-student-count'); if (el) el.textContent = list.length; })
    .catch(() => {});
}

function renderEvents(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">🎉 Events & Circulars</span></div><div class="section-body">
    ${state.data.events.map(e => `<div class="notice-card" style="border-left-color:var(--accent)">
      <div class="notice-title">${e.title}</div><div class="notice-body">${e.desc}</div>
      <div class="notice-meta"><span>📅 ${e.date}</span><span class="badge badge-info">${e.type}</span></div>
    </div>`).join('')}
  </div></div>`;
}

async function renderStudentInfo(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading…</div>';
  try {
    const students = await api('/users?role=student');
    c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">🎓 Student Details</span></div><div class="section-body">
      ${students.length === 0
        ? `<div class="empty-state"><div class="empty-icon">📭</div><p>No students found.</p></div>`
        : `<div class="table-wrap"><table>
            <thead><tr><th>USN</th><th>Name</th><th>Course</th><th>Sem</th><th>Phone</th><th>Parent</th><th>Status</th></tr></thead>
            <tbody>${students.map(s => `<tr>
              <td><strong>${s.usn || '—'}</strong></td><td>${s.name}</td>
              <td>${s.course || '—'}</td><td>${s.semester ? 'Sem ' + s.semester : '—'}</td>
              <td>${s.phone || '—'}</td><td>${s.parentName || '—'}</td>
              <td><span class="badge ${s.status === 'active' ? 'badge-success' : 'badge-danger'}">${s.status}</span></td>
            </tr>`).join('')}</tbody>
          </table></div>`}
    </div></div>`;
  } catch(err) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

// ── Utility ────────────────────────────────────────
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ══════════════════════════════════════════════════
//  MODAL CSS
// ══════════════════════════════════════════════════
(function injectModalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.55);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; padding: 20px;
      animation: fadeIn 0.18s ease;
    }
    .modal-box {
      background: var(--card); border-radius: 16px; width: 100%; max-width: 640px;
      max-height: 90vh; display: flex; flex-direction: column;
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.22s cubic-bezier(.16,1,.3,1);
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px; border-bottom: 1px solid var(--border);
    }
    .modal-title { font-size: 1.1rem; font-weight: 700; }
    .modal-close {
      background: none; border: none; font-size: 1.2rem; cursor: pointer;
      color: var(--text2); padding: 4px 8px; border-radius: 6px;
    }
    .modal-close:hover { background: var(--hover); }
    .modal-body  { padding: 20px 24px; overflow-y: auto; flex: 1; }
    .modal-footer {
      padding: 16px 24px; border-top: 1px solid var(--border);
      display: flex; justify-content: flex-end; gap: 10px;
    }
    .btn-danger       { background: var(--danger); color: #fff; }
    .btn-danger:hover { opacity: 0.85; }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  `;
  document.head.appendChild(style);
})();

// ══════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════
window.addEventListener('load', async function () {
  // Restore theme
  const savedTheme = localStorage.getItem('theme');
  const check      = document.getElementById('theme-check');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (check) check.checked = true;
  }

  // Auto-login from saved token
  try {
    const token     = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (token && savedUser?.role) {
      state.token = token;
      state.user  = savedUser;
      state.role  = savedUser.role;
      await launchApp();
    }
  } catch (e) {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');
  }
});

// Enter key → login
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const lp = document.getElementById('login-page');
    if (lp && lp.style.display !== 'none') doLogin();
  }
});