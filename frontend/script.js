// /* =====================================================
//    EduManage Pro — script.js
//    Fully refactored & debugged.
//    - All duplicate functions removed (kept last/best version)
//    - alert() replaced with showToast()
//    - toggleNotif unified into one function using CSS .open class
//    - loadNotifications unified into one function
//    - window.onload / window.addEventListener('load') merged
//    - Enter-key listener attached once
//    - Proper error boundary so one bad render won't crash app
// ===================================================== */

// /* =====================================================
//    GLOBAL ERROR BOUNDARY
// ===================================================== */
// window.onerror = function(message, source, line) {
//   console.error('JS Error:', message, 'at', source, 'line', line);
//   const page = document.getElementById('page-content');
//   if (page) {
//     page.innerHTML = `
//       <div class="empty-state">
//         <div class="empty-icon">⚠️</div>
//         <p><strong>Something went wrong</strong></p>
//         <p style="margin-top:8px;font-size:0.8rem;color:var(--danger);">${message}</p>
//       </div>`;
//   }
// };

// /* =====================================================
//    OTP STATE
// ===================================================== */
// let generatedOTP = '';

// /* =====================================================
//    APPLICATION STATE
// ===================================================== */
// const state = {
//   user: null,
//   role: 'admin',
//   page: 'dashboard',
//   darkMode: false,
//   sidebarCollapsed: false,

//   /* Demo data — all app data lives here */
//   data: {
//     students: [
//       {id:1,usn:'21BCA001',name:'Rahul Sharma',  email:'rahul@student.edu', phone:'9901001001',course:'BCA',semester:6,gender:'Male',  dob:'2003-04-15',parent:'Ramesh Sharma',  parent_phone:'9800001001',address:'123 MG Road, Bangalore',     admission:'2021-09-01',status:'active'},
//       {id:2,usn:'21BCA002',name:'Priya Reddy',   email:'priya@student.edu', phone:'9901002002',course:'BCA',semester:6,gender:'Female',dob:'2003-07-22',parent:'Ravi Reddy',     parent_phone:'9800002002',address:'456 JP Nagar, Bangalore',   admission:'2021-09-01',status:'active'},
//       {id:3,usn:'21BCA003',name:'Amit Patel',    email:'amit@student.edu',  phone:'9901003003',course:'BCA',semester:6,gender:'Male',  dob:'2002-12-10',parent:'Suresh Patel',   parent_phone:'9800003003',address:'789 Koramangala, Bangalore', admission:'2021-09-01',status:'active'},
//       {id:4,usn:'21BCA004',name:'Sneha Nair',    email:'sneha@student.edu', phone:'9901004004',course:'BCA',semester:6,gender:'Female',dob:'2003-02-28',parent:'Krishna Nair',   parent_phone:'9800004004',address:'321 Whitefield, Bangalore',  admission:'2021-09-01',status:'active'},
//       {id:5,usn:'21BCA005',name:'Vikram Singh',  email:'vikram@student.edu',phone:'9901005005',course:'BCA',semester:6,gender:'Male',  dob:'2003-09-05',parent:'Baldev Singh',   parent_phone:'9800005005',address:'654 Marathahalli, Bangalore',admission:'2021-09-01',status:'active'},
//       {id:6,usn:'22BCA001',name:'Divya Menon',   email:'divya@student.edu', phone:'9902001001',course:'BCA',semester:4,gender:'Female',dob:'2004-01-18',parent:'Prakash Menon',  parent_phone:'9800006006',address:'111 HSR Layout, Bangalore',  admission:'2022-09-01',status:'active'},
//       {id:7,usn:'22BCA002',name:'Arjun Kumar',   email:'arjun@student.edu', phone:'9902002002',course:'BCA',semester:4,gender:'Male',  dob:'2004-06-30',parent:'Sunil Kumar',    parent_phone:'9800007007',address:'222 Indiranagar, Bangalore', admission:'2022-09-01',status:'active'},
//       {id:8,usn:'23BCA001',name:'Ananya Joshi',  email:'ananya@student.edu',phone:'9903001001',course:'BCA',semester:2,gender:'Female',dob:'2005-03-14',parent:'Mohan Joshi',    parent_phone:'9800008008',address:'333 Banashankari, Bangalore',admission:'2023-09-01',status:'active'},
//     ],
//     teachers: [
//       {id:1,name:'Dr. Rajesh Kumar', email:'rajesh.kumar@college.edu',phone:'9845001234',dept:'Computer Science',qual:'Ph.D. CS',     exp:15,gender:'Male',  joining:'2009-06-01',subjects:['C Programming','Data Structures','Java']},
//       {id:2,name:'Prof. Meena Sharma',email:'meena.sharma@college.edu',phone:'9845002345',dept:'Mathematics',     qual:'M.Sc. Maths', exp:10,gender:'Female',joining:'2014-07-15',subjects:['Mathematics Foundation']},
//       {id:3,name:'Mr. Suresh Nair',  email:'suresh.nair@college.edu', phone:'9845003456',dept:'Computer Science',qual:'M.Tech CS',   exp:8, gender:'Male',  joining:'2016-06-01',subjects:['OOP C++','Python']},
//       {id:4,name:'Ms. Priya Patel',  email:'priya.patel@college.edu', phone:'9845004567',dept:'IT',              qual:'MCA',         exp:6, gender:'Female',joining:'2018-07-01',subjects:['Web Technologies','React JS']},
//       {id:5,name:'Dr. Anil Verma',   email:'anil.verma@college.edu',  phone:'9845005678',dept:'Electronics',     qual:'Ph.D. Electronics',exp:12,gender:'Male',joining:'2012-06-01',subjects:['Digital Electronics']},
//     ],
//     staff: [
//       {id:1,name:'Mrs. Lakshmi Devi',email:'lakshmi@college.edu',phone:'9876001001',designation:'Office Superintendent',dept:'Administration',gender:'Female',joining:'2005-01-10'},
//       {id:2,name:'Mr. Ganesh Rao',   email:'ganesh@college.edu', phone:'9876002002',designation:'Clerk',                dept:'Administration',gender:'Male',  joining:'2010-03-15'},
//       {id:3,name:'Ms. Kavitha Bhat', email:'kavitha@college.edu',phone:'9876003003',designation:'Librarian',           dept:'Library',       gender:'Female',joining:'2012-07-01'},
//     ],
//     courses: [
//       {id:1,code:'BCA',   name:'Bachelor of Computer Applications',  duration:3,students:45},
//       {id:2,code:'BSC-CS',name:'Bachelor of Science - CS',           duration:3,students:30},
//       {id:3,code:'MCA',   name:'Master of Computer Applications',    duration:2,students:20},
//     ],
//     subjects: [
//       {id:1, code:'BCA101',name:'Mathematics Foundation',  course:'BCA',sem:1,credits:4,lab:false},
//       {id:2, code:'BCA102',name:'Computer Fundamentals',   course:'BCA',sem:1,credits:4,lab:false},
//       {id:3, code:'BCA103',name:'C Programming',           course:'BCA',sem:1,credits:4,lab:true},
//       {id:4, code:'BCA201',name:'Data Structures',         course:'BCA',sem:2,credits:4,lab:true},
//       {id:5, code:'BCA202',name:'OOP with C++',            course:'BCA',sem:2,credits:4,lab:true},
//       {id:6, code:'BCA203',name:'DBMS',                    course:'BCA',sem:2,credits:4,lab:true},
//       {id:7, code:'BCA301',name:'Java Programming',        course:'BCA',sem:3,credits:4,lab:true},
//       {id:8, code:'BCA302',name:'Operating Systems',       course:'BCA',sem:3,credits:4,lab:false},
//       {id:9, code:'BCA401',name:'Advanced Java',           course:'BCA',sem:4,credits:4,lab:true},
//       {id:10,code:'BCA501',name:'Machine Learning',        course:'BCA',sem:5,credits:4,lab:true},
//       {id:11,code:'BCA601',name:'Final Year Project',      course:'BCA',sem:6,credits:8,lab:true},
//       {id:12,code:'BCA602',name:'Professional Ethics',     course:'BCA',sem:6,credits:2,lab:false},
//     ],
//     attendance: {
//       '21BCA001': {'BCA601':88,'BCA602':92,'BCA501':76,'BCA401':95,'BCA302':82},
//       '21BCA002': {'BCA601':72,'BCA602':88,'BCA501':80,'BCA401':91,'BCA302':78},
//       '21BCA003': {'BCA601':95,'BCA602':100,'BCA501':88,'BCA401':97,'BCA302':90},
//       '21BCA004': {'BCA601':65,'BCA602':72,'BCA501':68,'BCA401':80,'BCA302':70},
//       '21BCA005': {'BCA601':58,'BCA602':64,'BCA501':70,'BCA401':75,'BCA302':62},
//     },
//     marks: {
//       '21BCA001': [
//         {sub:'Final Year Project',code:'BCA601',internal:42,final:78, lab_int:45,lab_ext:47},
//         {sub:'Professional Ethics',code:'BCA602',internal:40,final:80, lab_int:null,lab_ext:null},
//         {sub:'Machine Learning',  code:'BCA501',internal:38,final:74, lab_int:44,lab_ext:46},
//       ],
//       '21BCA002': [
//         {sub:'Final Year Project',code:'BCA601',internal:38,final:72, lab_int:40,lab_ext:44},
//         {sub:'Professional Ethics',code:'BCA602',internal:44,final:82, lab_int:null,lab_ext:null},
//         {sub:'Machine Learning',  code:'BCA501',internal:35,final:68, lab_int:42,lab_ext:43},
//       ],
//       '21BCA003': [
//         {sub:'Final Year Project',code:'BCA601',internal:45,final:85, lab_int:48,lab_ext:49},
//         {sub:'Professional Ethics',code:'BCA602',internal:46,final:88, lab_int:null,lab_ext:null},
//         {sub:'Machine Learning',  code:'BCA501',internal:44,final:82, lab_int:47,lab_ext:48},
//       ],
//     },
//     notices: [
//       {id:1,title:'Semester Exam Schedule Released',body:'Final semester examination schedule has been released. Exams begin from March 15, 2024.',by:'Admin',date:'2024-02-01',target:'all'},
//       {id:2,title:'Workshop on AI & Machine Learning',body:'A two-day workshop on AI will be conducted on February 20–21. Final year students must attend.',by:'Admin',date:'2024-01-28',target:'all'},
//       {id:3,title:'Library Book Return Reminder',body:'All students who borrowed library books must return them before February 25, 2024.',by:'Staff',date:'2024-01-25',target:'student'},
//       {id:4,title:'College Annual Day Celebration',body:'Annual Day will be held on March 5, 2024. Students are requested to participate in cultural events.',by:'Staff',date:'2024-01-20',target:'all'},
//     ],
//     exams: [
//       {id:1,name:'Internal Assessment-I', type:'Internal',subject:'Final Year Project',  course:'BCA',sem:6,date:'2024-02-15',time:'09:00',room:'Room 101'},
//       {id:2,name:'Final Examination',     type:'Final',   subject:'Final Year Project',  course:'BCA',sem:6,date:'2024-03-15',time:'10:00',room:'Exam Hall A'},
//       {id:3,name:'Lab Practical',         type:'Lab',     subject:'Final Year Project',  course:'BCA',sem:6,date:'2024-03-18',time:'09:00',room:'Lab 1'},
//       {id:4,name:'Internal Assessment-I', type:'Internal',subject:'Professional Ethics', course:'BCA',sem:6,date:'2024-02-16',time:'09:00',room:'Room 102'},
//     ],
//     events: [
//       {id:1,title:'Annual Sports Day',  desc:'Various indoor & outdoor games for all students and staff.',                                            date:'2024-02-10',type:'Sports'},
//       {id:2,title:'Techfest 2024',      desc:'Annual technology festival with coding competitions, hackathons, and project exhibitions.',             date:'2024-03-01',type:'Academic'},
//       {id:3,title:'College Annual Day', desc:'Annual day celebration with cultural programs and prize distribution.',                                 date:'2024-03-05',type:'Cultural'},
//     ],
//     /* Persisted teacher-entered data — loaded from localStorage */
//     savedAttendance: {},
//     savedInternal:   {},
//     savedFinal:      {},
//     savedLab:        {},
//   }
// };

// /* =====================================================
//    LOCAL STORAGE — Load persisted data on startup
// ===================================================== */
// (function loadPersistedData() {
//   try { state.data.savedAttendance = JSON.parse(localStorage.getItem('attendanceData')) || {}; } catch(e){}
//   try { state.data.savedInternal   = JSON.parse(localStorage.getItem('internalMarks'))  || {}; } catch(e){}
//   try { state.data.savedFinal      = JSON.parse(localStorage.getItem('finalMarks'))     || {}; } catch(e){}
//   try { state.data.savedLab        = JSON.parse(localStorage.getItem('labMarks'))       || {}; } catch(e){}
// })();

// /* =====================================================
//    NAVIGATION CONFIG
// ===================================================== */
// const navConfig = {
//   admin: [
//     { section:'Main', items:[
//       {id:'dashboard',         icon:'📊',label:'Dashboard'},
//       {id:'students',          icon:'🎓',label:'Students'},
//       {id:'teachers',          icon:'👨‍🏫',label:'Teachers'},
//       {id:'staff',             icon:'👥',label:'Staff'},
//     ]},
//     { section:'Academics', items:[
//       {id:'courses',           icon:'📚',label:'Courses'},
//       {id:'subjects',          icon:'📖',label:'Subjects'},
//       {id:'exams',             icon:'📝',label:'Exam Schedule'},
//     ]},
//     { section:'Reports', items:[
//       {id:'attendance-report', icon:'📅',label:'Attendance Report'},
//       {id:'marks-report',      icon:'📈',label:'Marks Report'},
//       {id:'notices',           icon:'📢',label:'Notices'},
//     ]},
//   ],
//   teacher: [
//     { section:'Main', items:[
//       {id:'dashboard',         icon:'📊',label:'Dashboard'},
//       {id:'my-students',       icon:'🎓',label:'My Students'},
//     ]},
//     { section:'Management', items:[
//       {id:'upload-attendance', icon:'📅',label:'Upload Attendance'},
//       {id:'internal-marks',    icon:'📝',label:'Internal Marks'},
//       {id:'final-marks',       icon:'📈',label:'Final Marks'},
//       {id:'lab-marks',         icon:'💻',label:'Lab Marks'},
//       {id:'assignments',       icon:'📋',label:'Assignments'},
//     ]},
//     { section:'Info', items:[
//       {id:'notices',           icon:'📢',label:'Notices'},
//     ]},
//   ],
//   student: [
//     { section:'Main', items:[
//       {id:'dashboard',         icon:'📊',label:'Dashboard'},
//       {id:'profile',           icon:'👤',label:'My Profile'},
//     ]},
//     { section:'Academics', items:[
//       {id:'my-attendance',     icon:'📅',label:'Attendance'},
//       {id:'my-marks',          icon:'📈',label:'My Marks'},
//       {id:'my-lab-marks',      icon:'💻',label:'Lab Marks'},
//       {id:'course-details',    icon:'📚',label:'Course Details'},
//     ]},
//     { section:'Info', items:[
//       {id:'notices',           icon:'📢',label:'Notices'},
//       {id:'change-password',   icon:'🔑',label:'Change Password'},
//     ]},
//   ],
//   staff: [
//     { section:'Main', items:[
//       {id:'dashboard',         icon:'📊',label:'Dashboard'},
//       {id:'notices',           icon:'📢',label:'Upload Notices'},
//       {id:'events',            icon:'🎉',label:'Events & Circulars'},
//     ]},
//     { section:'Info', items:[
//       {id:'student-info',      icon:'🎓',label:'Student Details'},
//     ]},
//   ],
// };

// /* =====================================================
//    TOAST NOTIFICATIONS  (single implementation)
// ===================================================== */
// function showToast(message, type = 'success') {
//   const icons = { success:'✅', error:'❌', info:'ℹ️' };
//   const container = document.getElementById('toast-container');
//   if (!container) return;

//   const toast = document.createElement('div');
//   toast.className = `toast toast-${type}`;
//   toast.innerHTML = `<span class="toast-icon">${icons[type] || '📢'}</span><span class="toast-msg">${message}</span>`;
//   container.appendChild(toast);

//   setTimeout(() => {
//     toast.classList.add('out');
//     toast.addEventListener('animationend', () => toast.remove(), { once:true });
//   }, 3000);
// }

// /* =====================================================
//    THEME
// ===================================================== */
// function toggleTheme() {
//   const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
//   if (isDark) {
//     document.documentElement.removeAttribute('data-theme');
//     localStorage.setItem('theme', 'light');
//   } else {
//     document.documentElement.setAttribute('data-theme', 'dark');
//     localStorage.setItem('theme', 'dark');
//   }
// }

// /* =====================================================
//    LOGIN — role tab, fill, toggle password visibility
// ===================================================== */
// let selectedRole = 'admin';

// function setRole(r) {
//   selectedRole = r;
//   document.querySelectorAll('.login-tab').forEach((t, i) => {
//     t.classList.toggle('active', ['admin','teacher','student','staff'][i] === r);
//   });
// }

// function fillCreds(u, p, r) {
//   setRole(r);
//   document.getElementById('login-user').value = u;
//   document.getElementById('login-pass').value = p;
// }

// function togglePass() {
//   const el = document.getElementById('login-pass');
//   el.type = el.type === 'password' ? 'text' : 'password';
//   document.getElementById('pass-toggle').textContent = el.type === 'password' ? '👁️' : '🙈';
// }

// /* =====================================================
//    LOGIN — main logic
// ===================================================== */
// function doLogin() {
//   const user = document.getElementById('login-user').value.trim();
//   const pass = document.getElementById('login-pass').value;
//   if (!user || !pass) { showToast('Please enter username and password', 'error'); return; }

//   const btn  = document.getElementById('login-btn');
//   const txt  = document.getElementById('login-btn-text');
//   btn.disabled = true;
//   txt.textContent = 'Signing in…';

//   // Simulate async API call
//   setTimeout(() => {
//     btn.disabled = false;
//     txt.textContent = 'Sign In →';

//     // Load or initialise credentials store
//     let creds;
//     try { creds = JSON.parse(localStorage.getItem('creds')); } catch(e) { creds = null; }
//     if (!creds) {
//       creds = {
//         'admin':        { role:'admin',   name:'Super Admin',       email:'adminppc01@gmail.com',       password:'password123' },
//         'rajesh.kumar': { role:'teacher', name:'Dr. Rajesh Kumar',  email:'rajesh.kumar@college.edu',   password:'password123' },
//         '21BCA001':     { role:'student', name:'Rahul Sharma',      usn:'21BCA001', email:'rahul@student.edu', password:'password123' },
//         'lakshmi.devi': { role:'staff',   name:'Mrs. Lakshmi Devi', email:'lakshmi@college.edu',        password:'password123' },
//       };
//       localStorage.setItem('creds', JSON.stringify(creds));
//     }

//     const u = creds[user];
//     if (!u || pass !== u.password) {
//       showToast('Invalid username or password', 'error');
//       return;
//     }

//     state.user = { ...u, username: user };
//     state.role = u.role;
//     localStorage.setItem('loggedUser', JSON.stringify(state.user));
//     launchApp();
//   }, 800);
// }

// /* Launch main app after successful login */
// function launchApp() {
//   document.getElementById('login-page').style.display = 'none';
//   const app = document.getElementById('app');
//   app.style.display = 'flex';
//   app.classList.add('active');

//   // Populate sidebar user info
//   const initials = state.user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
//   document.getElementById('sidebar-avatar').textContent = initials;
//   document.getElementById('sidebar-name').textContent   = state.user.name;
//   document.getElementById('sidebar-role').textContent   = state.user.role.charAt(0).toUpperCase() + state.user.role.slice(1);
//   const roleColors = { admin:'#dc2626', teacher:'#2563a8', student:'#16a34a', staff:'#d97706' };
//   document.getElementById('sidebar-avatar').style.background = roleColors[state.user.role] || '#64748b';

//   buildNav();
//   loadNotifications();
//   navigateTo('dashboard');
//   showToast(`Welcome back, ${state.user.name.split(' ')[0]}! 🎉`, 'success');
// }

// function doLogout() {
//   localStorage.removeItem('loggedUser');
//   const app = document.getElementById('app');
//   app.style.display = 'none';
//   app.classList.remove('active');
//   document.getElementById('login-page').style.display = 'flex';
//   // Close notif panel if open
//   document.getElementById('notif-panel').classList.remove('open');
//   state.user = null;
//   document.getElementById('login-user').value = '';
//   document.getElementById('login-pass').value = '';
//   showToast('Logged out successfully', 'info');
// }

// /* =====================================================
//    FORGOT PASSWORD / OTP FLOW
// ===================================================== */
// function showForgot() {
//   document.getElementById('login-form-section').style.display = 'none';
//   document.getElementById('forgot-section').style.display = 'block';
// }

// function showLogin() {
//   document.getElementById('forgot-section').style.display = 'none';
//   document.getElementById('login-form-section').style.display = 'block';
//   // Reset all steps
//   document.getElementById('fp-step1').style.display = 'block';
//   document.getElementById('fp-step2').style.display = 'none';
//   document.getElementById('fp-step3').style.display = 'none';
//   // Clear OTP fields
//   ['o1','o2','o3','o4','o5','o6'].forEach(id => {
//     const el = document.getElementById(id);
//     if (el) el.value = '';
//   });
//   generatedOTP = '';
// }

// function sendOTP() {
//   const email = document.getElementById('fp-email').value.trim();
//   if (!email) { showToast('Please enter your email', 'error'); return; }

//   generatedOTP = String(Math.floor(100000 + Math.random() * 900000));

//   // Attempt EmailJS send; fall back gracefully if it fails
//   if (typeof emailjs !== 'undefined') {
//     emailjs.send('service_czx0ed8', 'template_jkudzio', { email, otp: generatedOTP })
//       .then(() => {
//         showToast('OTP sent successfully to ' + email, 'success');
//         showOTPStep();
//       })
//       .catch(err => {
//         console.error('EmailJS error:', err);
//         // Still advance in demo mode
//         showToast('OTP: ' + generatedOTP + ' (demo mode)', 'info');
//         showOTPStep();
//       });
//   } else {
//     showToast('OTP: ' + generatedOTP + ' (demo mode)', 'info');
//     showOTPStep();
//   }
// }

// function showOTPStep() {
//   document.getElementById('fp-step1').style.display = 'none';
//   document.getElementById('fp-step2').style.display = 'block';
//   setTimeout(() => { const el = document.getElementById('o1'); if(el) el.focus(); }, 100);
// }

// function otpNext(el, nextId) {
//   // Allow only digits
//   el.value = el.value.replace(/\D/g, '');
//   if (el.value.length === 1 && nextId) {
//     const next = document.getElementById(nextId);
//     if (next) next.focus();
//   }
// }

// function verifyOTP() {
//   const otp = ['o1','o2','o3','o4','o5','o6'].map(id => {
//     const el = document.getElementById(id);
//     return el ? el.value : '';
//   }).join('');

//   if (otp === generatedOTP) {
//     showToast('OTP verified successfully', 'success');
//     document.getElementById('fp-step2').style.display = 'none';
//     document.getElementById('fp-step3').style.display = 'block';
//   } else {
//     showToast('Invalid OTP. Please try again.', 'error');
//   }
// }

// function resetPassword() {
//   const np = document.getElementById('fp-newpass').value;
//   if (!np || np.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
//   showToast('Password reset successfully! Please login.', 'success');
//   setTimeout(showLogin, 1500);
// }

// /* =====================================================
//    NAVIGATION
// ===================================================== */
// function buildNav() {
//   const menu = document.getElementById('nav-menu');
//   menu.innerHTML = '';
//   (navConfig[state.role] || []).forEach(section => {
//     const label = document.createElement('div');
//     label.className = 'nav-section-label';
//     label.textContent = section.section;
//     menu.appendChild(label);

//     section.items.forEach(item => {
//       const btn = document.createElement('button');
//       btn.className = 'nav-item';
//       btn.dataset.page = item.id;
//       btn.type = 'button';
//       btn.innerHTML = `<span class="nav-icon">${item.icon}</span><span class="nav-label">${item.label}</span>`;
//       btn.onclick = () => navigateTo(item.id);
//       menu.appendChild(btn);
//     });
//   });
// }

// function navigateTo(page) {
//   state.page = page;
//   // Highlight active nav item
//   document.querySelectorAll('.nav-item').forEach(el => {
//     el.classList.toggle('active', el.dataset.page === page);
//   });
//   // Update page title
//   document.getElementById('page-title').textContent = findNavLabel(page);
//   // Show loading spinner
//   document.getElementById('page-content').innerHTML = '<div style="text-align:center;padding:60px;"><span style="font-size:2.5rem;">⏳</span></div>';
//   // Close mobile sidebar
//   if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('mobile-open');
//   // Render after brief tick (allows spinner to show)
//   setTimeout(() => renderPage(page), 120);
// }

// function findNavLabel(page) {
//   for (const s of navConfig[state.role] || []) {
//     const item = s.items.find(x => x.id === page);
//     if (item) return item.label;
//   }
//   return page.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
// }

// function toggleSidebar() {
//   const sb = document.getElementById('sidebar');
//   if (window.innerWidth <= 768) {
//     sb.classList.toggle('mobile-open');
//   } else {
//     sb.classList.toggle('collapsed');
//     state.sidebarCollapsed = sb.classList.contains('collapsed');
//   }
// }

// /* =====================================================
//    NOTIFICATIONS  (single unified implementation)
// ===================================================== */
// function loadNotifications() {
//   /* Populate the slide-in panel body */
//   const body = document.getElementById('notif-body');
//   const dot  = document.getElementById('notif-dot');
//   if (!body) return;

//   if (!state.data.notices.length) {
//     body.innerHTML = '<div class="notif-item"><p>No new notifications</p></div>';
//     if (dot) dot.style.display = 'none';
//     return;
//   }

//   body.innerHTML = state.data.notices.map(n => `
//     <div class="notif-item">
//       <p><strong>${n.title}</strong></p>
//       <p>${n.body.slice(0, 80)}…</p>
//       <small>${n.date} &bull; ${n.by}</small>
//     </div>
//   `).join('');

//   if (dot) dot.style.display = 'block';
// }

// /* Toggle the slide-in panel using the CSS .open class */
// function toggleNotifPanel() {
//   document.getElementById('notif-panel').classList.toggle('open');
// }

// /* =====================================================
//    PAGE RENDERER — dispatch table
// ===================================================== */
// function renderPage(page) {
//   const c = document.getElementById('page-content');
//   if (!c) return;

//   const renders = {
//     /* Shared */
//     dashboard:          renderDashboard,
//     notices:            renderNotices,
//     /* Admin */
//     students:           renderStudents,
//     teachers:           renderTeachers,
//     staff:              renderStaff,
//     courses:            renderCourses,
//     subjects:           renderSubjects,
//     exams:              renderExams,
//     'attendance-report':renderAttendanceReport,
//     'marks-report':     renderMarksReport,
//     /* Teacher */
//     'my-students':      renderMyStudents,
//     'upload-attendance':renderUploadAttendance,
//     'internal-marks':   renderInternalMarks,
//     'final-marks':      renderFinalMarks,
//     'lab-marks':        renderLabMarks,
//     assignments:        renderAssignments,
//     /* Student */
//     profile:            renderStudentProfile,
//     'my-attendance':    renderMyAttendance,
//     'my-marks':         renderMyMarks,
//     'my-lab-marks':     renderMyLabMarks,
//     'course-details':   renderCourseDetails,
//     'change-password':  renderChangePassword,
//     /* Staff */
//     events:             renderEvents,
//     'student-info':     renderStudentInfo,
//   };

//   const fn = renders[page];
//   if (fn) {
//     try { fn(c); } catch(err) {
//       console.error('Render error for page', page, err);
//       c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Failed to render <strong>${page}</strong>. See console for details.</p></div>`;
//     }
//   } else {
//     c.innerHTML = `<div class="empty-state"><div class="empty-icon">🚧</div><p>This module is under development.</p></div>`;
//   }
// }

// /* =====================================================
//    DASHBOARD — role-based dispatch
// ===================================================== */
// function renderDashboard(c) {
//   switch (state.role) {
//     case 'admin':   renderAdminDashboard(c);   break;
//     case 'teacher': renderTeacherDashboard(c); break;
//     case 'student': renderStudentDashboard(c); break;
//     default:        renderStaffDashboard(c);   break;
//   }
// }

// /* ---- Admin Dashboard ---- */
// function renderAdminDashboard(c) {
//   c.innerHTML = `
//   <div class="stats-grid stagger">
//     <div class="stat-card">
//       <div class="stat-icon" style="background:rgba(37,99,168,0.1)">🎓</div>
//       <div class="stat-info"><h3>8</h3><p>Total Students</p><span class="stat-change change-up">↑ 3 this month</span></div>
//     </div>
//     <div class="stat-card">
//       <div class="stat-icon" style="background:rgba(22,163,74,0.1)">👨‍🏫</div>
//       <div class="stat-info"><h3>5</h3><p>Total Teachers</p><span class="stat-change change-up">↑ 1 new</span></div>
//     </div>
//     <div class="stat-card">
//       <div class="stat-icon" style="background:rgba(240,165,0,0.1)">👥</div>
//       <div class="stat-info"><h3>3</h3><p>Staff Members</p></div>
//     </div>
//     <div class="stat-card">
//       <div class="stat-icon" style="background:rgba(139,92,246,0.1)">📚</div>
//       <div class="stat-info"><h3>3</h3><p>Courses Active</p></div>
//     </div>
//     <div class="stat-card">
//       <div class="stat-icon" style="background:rgba(8,145,178,0.1)">📖</div>
//       <div class="stat-info"><h3>12</h3><p>Subjects</p></div>
//     </div>
//     <div class="stat-card">
//       <div class="stat-icon" style="background:rgba(220,38,38,0.1)">📢</div>
//       <div class="stat-info"><h3>4</h3><p>Active Notices</p></div>
//     </div>
//   </div>

//   <div class="charts-row">
//     <div class="section-card">
//       <div class="section-header"><span class="section-title">📊 Enrollment by Course</span></div>
//       <div class="section-body"><div class="chart-container"><canvas id="courseChart"></canvas></div></div>
//     </div>
//     <div class="section-card">
//       <div class="section-header"><span class="section-title">📅 Attendance Overview</span></div>
//       <div class="section-body"><div class="chart-container"><canvas id="attChart"></canvas></div></div>
//     </div>
//   </div>

//   <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;" class="charts-row">
//     <div class="section-card">
//       <div class="section-header">
//         <span class="section-title">📢 Recent Notices</span>
//         <button class="btn btn-primary btn-sm" onclick="navigateTo('notices')">View All</button>
//       </div>
//       <div class="section-body">
//         ${state.data.notices.slice(0,3).map(n => `
//           <div class="notice-card">
//             <div class="notice-title">${n.title}</div>
//             <div class="notice-body">${n.body.slice(0,80)}…</div>
//             <div class="notice-meta"><span>📅 ${n.date}</span><span>👤 ${n.by}</span></div>
//           </div>`).join('')}
//       </div>
//     </div>
//     <div class="section-card">
//       <div class="section-header">
//         <span class="section-title">📝 Upcoming Exams</span>
//         <button class="btn btn-primary btn-sm" onclick="navigateTo('exams')">View All</button>
//       </div>
//       <div class="section-body">
//         <div class="table-wrap"><table>
//           <thead><tr><th>Exam</th><th>Type</th><th>Date</th><th>Room</th></tr></thead>
//           <tbody>${state.data.exams.map(e => `
//             <tr>
//               <td>${e.name}</td>
//               <td><span class="badge ${e.type==='Internal'?'badge-warning':e.type==='Lab'?'badge-info':'badge-primary'}">${e.type}</span></td>
//               <td>${e.date}</td>
//               <td>${e.room}</td>
//             </tr>`).join('')}
//           </tbody>
//         </table></div>
//       </div>
//     </div>
//   </div>`;

//   /* Render charts after DOM is painted */
//   setTimeout(() => {
//     if (typeof Chart === 'undefined') return;
//     new Chart(document.getElementById('courseChart'), {
//       type: 'doughnut',
//       data: {
//         labels: ['BCA','BSC-CS','MCA'],
//         datasets: [{ data:[45,30,20], backgroundColor:['#2563a8','#16a34a','#f0a500'], borderWidth:0 }]
//       },
//       options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } } }
//     });
//     new Chart(document.getElementById('attChart'), {
//       type: 'bar',
//       data: {
//         labels: ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6'],
//         datasets: [{ label:'Avg Attendance %', data:[88,82,85,79,83,81], backgroundColor:'rgba(37,99,168,0.7)', borderRadius:8 }]
//       },
//       options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ y:{ beginAtZero:true, max:100 } } }
//     });
//   }, 150);
// }

// /* ---- Teacher Dashboard ---- */
// function renderTeacherDashboard(c) {
//   const initials = state.user.name.split(' ').map(w => w[0]).join('').slice(0,2);
//   c.innerHTML = `
//   <div class="profile-header" style="margin-bottom:24px;">
//     <div class="profile-avatar">${initials}</div>
//     <div class="profile-info">
//       <h2>${state.user.name}</h2>
//       <p>Computer Science Department</p>
//       <div class="profile-badges">
//         <span class="profile-badge">👨‍🏫 Senior Faculty</span>
//         <span class="profile-badge">📚 3 Subjects Assigned</span>
//         <span class="profile-badge">🎓 Sem 6 Coordinator</span>
//       </div>
//     </div>
//   </div>
//   <div class="stats-grid stagger">
//     <div class="stat-card"><div class="stat-icon" style="background:rgba(37,99,168,0.1)">🎓</div><div class="stat-info"><h3>8</h3><p>My Students</p></div></div>
//     <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">📖</div><div class="stat-info"><h3>3</h3><p>Subjects</p></div></div>
//     <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">📅</div><div class="stat-info"><h3>82%</h3><p>Avg Attendance</p></div></div>
//     <div class="stat-card"><div class="stat-icon" style="background:rgba(139,92,246,0.1)">📋</div><div class="stat-info"><h3>2</h3><p>Assignments Pending</p></div></div>
//   </div>
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📊 Class Attendance Overview</span></div>
//     <div class="section-body"><div class="chart-container"><canvas id="tchart"></canvas></div></div>
//   </div>`;

//   setTimeout(() => {
//     if (typeof Chart === 'undefined') return;
//     new Chart(document.getElementById('tchart'), {
//       type: 'bar',
//       data: {
//         labels: state.data.students.slice(0,5).map(s => s.name.split(' ')[0]),
//         datasets: [{
//           label:'Attendance %',
//           data:[88,72,95,65,58],
//           backgroundColor:['#16a34a','#f59e0b','#16a34a','#dc2626','#dc2626'],
//           borderRadius:8
//         }]
//       },
//       options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true,max:100}} }
//     });
//   }, 150);
// }

// /* ---- Student Dashboard ---- */
// function renderStudentDashboard(c) {
//   const usn    = state.user.usn || '21BCA001';
//   const att    = state.data.attendance[usn] || {};
//   const vals   = Object.values(att);
//   const avgAtt = vals.length ? Math.round(vals.reduce((a,b) => a+b, 0) / vals.length) : 0;

//   c.innerHTML = `
//   <div class="profile-header" style="margin-bottom:24px;">
//     <div class="profile-avatar">${state.user.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
//     <div class="profile-info">
//       <h2>${state.user.name}</h2>
//       <p>USN: ${usn} &nbsp;|&nbsp; BCA — Semester 6</p>
//       <div class="profile-badges">
//         <span class="profile-badge">📚 BCA</span>
//         <span class="profile-badge">📅 Semester 6</span>
//         <span class="profile-badge">🏫 2021–2024 Batch</span>
//       </div>
//     </div>
//   </div>
//   <div class="stats-grid stagger">
//     <div class="stat-card">
//       <div class="stat-icon" style="background:rgba(37,99,168,0.1)">📅</div>
//       <div class="stat-info">
//         <h3>${avgAtt}%</h3><p>Overall Attendance</p>
//         <span class="stat-change ${avgAtt>=75?'change-up':'change-down'}">${avgAtt>=75?'✓ Good Standing':'⚠️ Below Required'}</span>
//       </div>
//     </div>
//     <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">📈</div><div class="stat-info"><h3>76%</h3><p>Avg Percentage</p><span class="stat-change change-up">↑ Grade B+</span></div></div>
//     <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">📖</div><div class="stat-info"><h3>5</h3><p>Subjects This Sem</p></div></div>
//     <div class="stat-card"><div class="stat-icon" style="background:rgba(8,145,178,0.1)">📢</div><div class="stat-info"><h3>4</h3><p>Notices</p></div></div>
//   </div>
//   <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;" class="charts-row">
//     <div class="section-card">
//       <div class="section-header"><span class="section-title">📅 Subject-wise Attendance</span></div>
//       <div class="section-body">
//         ${Object.entries(att).map(([code,pct]) => `
//           <div style="margin-bottom:14px;">
//             <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
//               <span style="font-size:0.85rem;font-weight:600;">${code}</span>
//               <span style="font-size:0.85rem;font-weight:700;color:${pct>=75?'var(--success)':pct>=60?'var(--warning)':'var(--danger)'}">${pct}%</span>
//             </div>
//             <div class="progress-bar">
//               <div class="progress-fill ${pct>=75?'progress-good':pct>=60?'progress-warn':'progress-bad'}" style="width:${pct}%"></div>
//             </div>
//           </div>`).join('')}
//       </div>
//     </div>
//     <div class="section-card">
//       <div class="section-header"><span class="section-title">📢 Latest Notices</span></div>
//       <div class="section-body">
//         ${state.data.notices.slice(0,3).map(n => `
//           <div class="notice-card">
//             <div class="notice-title">${n.title}</div>
//             <div class="notice-body">${n.body.slice(0,70)}…</div>
//             <div class="notice-meta"><span>${n.date}</span></div>
//           </div>`).join('')}
//       </div>
//     </div>
//   </div>`;
// }

// /* ---- Staff Dashboard ---- */
// function renderStaffDashboard(c) {
//   const initials = state.user.name.split(' ').map(w=>w[0]).join('').slice(0,2);
//   c.innerHTML = `
//   <div class="profile-header" style="margin-bottom:24px;">
//     <div class="profile-avatar">${initials}</div>
//     <div class="profile-info">
//       <h2>${state.user.name}</h2>
//       <p>Office Superintendent — Administration</p>
//       <div class="profile-badges">
//         <span class="profile-badge">🏢 Administration</span>
//         <span class="profile-badge">📅 Since 2005</span>
//       </div>
//     </div>
//   </div>
//   <div class="stats-grid stagger">
//     <div class="stat-card"><div class="stat-icon" style="background:rgba(37,99,168,0.1)">📢</div><div class="stat-info"><h3>4</h3><p>Active Notices</p></div></div>
//     <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">🎉</div><div class="stat-info"><h3>3</h3><p>Upcoming Events</p></div></div>
//     <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">🎓</div><div class="stat-info"><h3>8</h3><p>Students</p></div></div>
//   </div>
//   <div class="section-card">
//     <div class="section-header">
//       <span class="section-title">🎉 Upcoming Events</span>
//       <button class="btn btn-primary btn-sm" onclick="navigateTo('events')">Manage Events</button>
//     </div>
//     <div class="section-body">
//       ${state.data.events.map(e => `
//         <div class="notice-card" style="border-left-color:var(--accent)">
//           <div class="notice-title">${e.title}</div>
//           <div class="notice-body">${e.desc}</div>
//           <div class="notice-meta"><span>📅 ${e.date}</span><span class="badge badge-info">${e.type}</span></div>
//         </div>`).join('')}
//     </div>
//   </div>`;
// }

// /* =====================================================
//    ADMIN MODULES
// ===================================================== */
// function renderStudents(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header">
//       <span class="section-title">🎓 Students (${state.data.students.length})</span>
//     </div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead>
//             <tr><th>USN</th><th>Name</th><th>Email</th><th>Course</th><th>Semester</th><th>Status</th></tr>
//           </thead>
//           <tbody>
//             ${state.data.students.map(s => `
//               <tr>
//                 <td><strong>${s.usn}</strong></td>
//                 <td>${s.name}</td>
//                 <td>${s.email}</td>
//                 <td>${s.course}</td>
//                 <td>Sem ${s.semester}</td>
//                 <td><span class="badge badge-success">Active</span></td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// function renderTeachers(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">👨‍🏫 Teachers (${state.data.teachers.length})</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Qualification</th><th>Experience</th></tr></thead>
//           <tbody>
//             ${state.data.teachers.map(t => `
//               <tr>
//                 <td><strong>${t.name}</strong></td>
//                 <td>${t.email}</td>
//                 <td>${t.dept}</td>
//                 <td>${t.qual}</td>
//                 <td>${t.exp} yrs</td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// function renderStaff(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">👥 Staff (${state.data.staff.length})</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>Name</th><th>Email</th><th>Designation</th><th>Department</th><th>Joined</th></tr></thead>
//           <tbody>
//             ${state.data.staff.map(s => `
//               <tr>
//                 <td><strong>${s.name}</strong></td>
//                 <td>${s.email}</td>
//                 <td>${s.designation}</td>
//                 <td>${s.dept}</td>
//                 <td>${s.joining}</td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// function renderCourses(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📚 Courses</span></div>
//     <div class="section-body">
//       <div class="stats-grid">
//         ${state.data.courses.map(course => `
//           <div class="stat-card" style="flex-direction:column;align-items:flex-start;gap:8px;">
//             <div style="display:flex;align-items:center;gap:12px;">
//               <div class="stat-icon" style="background:rgba(37,99,168,0.1);width:48px;height:48px;">📚</div>
//               <div>
//                 <div style="font-weight:800;font-size:1.1rem;">${course.code}</div>
//                 <div style="font-size:0.8rem;color:var(--text2);">${course.name}</div>
//               </div>
//             </div>
//             <div style="display:flex;gap:16px;font-size:0.82rem;color:var(--text2);">
//               <span>⏱ ${course.duration} Years</span>
//               <span>🎓 ${course.students} Students</span>
//             </div>
//           </div>`).join('')}
//       </div>
//     </div>
//   </div>`;
// }

// function renderSubjects(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📖 Subjects (${state.data.subjects.length})</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>Code</th><th>Subject</th><th>Course</th><th>Semester</th><th>Credits</th><th>Lab</th></tr></thead>
//           <tbody>
//             ${state.data.subjects.map(sub => `
//               <tr>
//                 <td><code>${sub.code}</code></td>
//                 <td>${sub.name}</td>
//                 <td>${sub.course}</td>
//                 <td>Sem ${sub.sem}</td>
//                 <td>${sub.credits}</td>
//                 <td>${sub.lab ? '<span class="badge badge-info">Yes</span>' : '<span class="badge">No</span>'}</td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// function renderExams(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📝 Exam Schedule</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>Exam Name</th><th>Type</th><th>Subject</th><th>Date</th><th>Time</th><th>Room</th></tr></thead>
//           <tbody>
//             ${state.data.exams.map(exam => `
//               <tr>
//                 <td><strong>${exam.name}</strong></td>
//                 <td><span class="badge ${exam.type==='Internal'?'badge-warning':exam.type==='Lab'?'badge-info':'badge-primary'}">${exam.type}</span></td>
//                 <td>${exam.subject}</td>
//                 <td>${exam.date}</td>
//                 <td>${exam.time}</td>
//                 <td>${exam.room}</td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// function renderAttendanceReport(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📅 Attendance Report</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead>
//             <tr>
//               <th>USN</th><th>Name</th>
//               ${Object.keys(Object.values(state.data.attendance)[0]||{}).map(k=>`<th>${k}</th>`).join('')}
//               <th>Average</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${Object.entries(state.data.attendance).map(([usn, subjects]) => {
//               const student = state.data.students.find(s => s.usn === usn) || {};
//               const vals    = Object.values(subjects);
//               const avg     = vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : 0;
//               return `
//                 <tr>
//                   <td><strong>${usn}</strong></td>
//                   <td>${student.name || '—'}</td>
//                   ${Object.values(subjects).map(v=>`<td><span class="badge ${v>=75?'badge-success':v>=60?'badge-warning':'badge-danger'}">${v}%</span></td>`).join('')}
//                   <td><strong>${avg}%</strong></td>
//                 </tr>`;
//             }).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// function renderMarksReport(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📈 Marks Report</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>USN</th><th>Name</th><th>Subject</th><th>Internal</th><th>Final</th><th>Total</th></tr></thead>
//           <tbody>
//             ${Object.entries(state.data.marks).flatMap(([usn, marksArr]) => {
//               const student = state.data.students.find(s => s.usn === usn) || {};
//               return marksArr.map(m => `
//                 <tr>
//                   <td>${usn}</td>
//                   <td>${student.name || '—'}</td>
//                   <td>${m.sub}</td>
//                   <td>${m.internal}</td>
//                   <td>${m.final}</td>
//                   <td><strong>${m.internal + m.final}</strong></td>
//                 </tr>`);
//             }).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// function renderNotices(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📢 Notices</span></div>
//     <div class="section-body">
//       ${state.data.notices.map(notice => `
//         <div class="notice-card">
//           <div class="notice-title">${notice.title}</div>
//           <div class="notice-body">${notice.body}</div>
//           <div class="notice-meta">
//             <span>📅 ${notice.date}</span>
//             <span>👤 ${notice.by}</span>
//             <span class="badge badge-info">${notice.target}</span>
//           </div>
//         </div>`).join('')}
//     </div>
//   </div>`;
// }

// /* =====================================================
//    TEACHER MODULES
// ===================================================== */
// function renderMyStudents(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">🎓 My Students</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>USN</th><th>Name</th><th>Course</th><th>Semester</th><th>Phone</th></tr></thead>
//           <tbody>
//             ${state.data.students.map(s => `
//               <tr>
//                 <td><strong>${s.usn}</strong></td>
//                 <td>${s.name}</td>
//                 <td>${s.course}</td>
//                 <td>Sem ${s.semester}</td>
//                 <td>${s.phone}</td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// function renderUploadAttendance(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📅 Upload Attendance</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>USN</th><th>Name</th><th>Attendance %</th></tr></thead>
//           <tbody>
//             ${state.data.students.map(s => `
//               <tr>
//                 <td>${s.usn}</td>
//                 <td>${s.name}</td>
//                 <td>
//                   <input
//                     class="marks-input"
//                     type="number" min="0" max="100"
//                     value="${state.data.savedAttendance[s.usn] ?? ''}"
//                     id="att-${s.usn}"
//                     placeholder="0–100">
//                 </td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//       <br>
//       <button class="btn btn-primary" onclick="saveAttendance()">💾 Save Attendance</button>
//     </div>
//   </div>`;
// }

// function saveAttendance() {
//   state.data.students.forEach(s => {
//     const el = document.getElementById(`att-${s.usn}`);
//     if (el) state.data.savedAttendance[s.usn] = Number(el.value);
//   });
//   try { localStorage.setItem('attendanceData', JSON.stringify(state.data.savedAttendance)); } catch(e){}
//   showToast('Attendance saved successfully!', 'success');
// }

// function renderInternalMarks(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📝 Internal Marks</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>USN</th><th>Name</th><th>Internal Marks (out of 50)</th></tr></thead>
//           <tbody>
//             ${state.data.students.map(s => `
//               <tr>
//                 <td>${s.usn}</td>
//                 <td>${s.name}</td>
//                 <td>
//                   <input
//                     class="marks-input"
//                     type="number" min="0" max="50"
//                     value="${state.data.savedInternal[s.usn] ?? ''}"
//                     id="internal-${s.usn}"
//                     placeholder="0–50">
//                 </td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//       <br>
//       <button class="btn btn-primary" onclick="saveInternalMarks()">💾 Save Internal Marks</button>
//     </div>
//   </div>`;
// }

// function saveInternalMarks() {
//   state.data.students.forEach(s => {
//     const el = document.getElementById(`internal-${s.usn}`);
//     if (el) state.data.savedInternal[s.usn] = Number(el.value);
//   });
//   try { localStorage.setItem('internalMarks', JSON.stringify(state.data.savedInternal)); } catch(e){}
//   showToast('Internal marks saved successfully!', 'success');
// }

// function renderFinalMarks(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📈 Final Marks</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>USN</th><th>Name</th><th>Final Marks (out of 100)</th></tr></thead>
//           <tbody>
//             ${state.data.students.map(s => `
//               <tr>
//                 <td>${s.usn}</td>
//                 <td>${s.name}</td>
//                 <td>
//                   <input
//                     class="marks-input"
//                     type="number" min="0" max="100"
//                     value="${state.data.savedFinal[s.usn] ?? ''}"
//                     id="final-${s.usn}"
//                     placeholder="0–100">
//                 </td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//       <br>
//       <button class="btn btn-primary" onclick="saveFinalMarks()">💾 Save Final Marks</button>
//     </div>
//   </div>`;
// }

// function saveFinalMarks() {
//   state.data.students.forEach(s => {
//     const el = document.getElementById(`final-${s.usn}`);
//     if (el) state.data.savedFinal[s.usn] = Number(el.value);
//   });
//   try { localStorage.setItem('finalMarks', JSON.stringify(state.data.savedFinal)); } catch(e){}
//   showToast('Final marks saved successfully!', 'success');
// }

// function renderLabMarks(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">💻 Lab Marks</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>USN</th><th>Name</th><th>Lab Marks (out of 50)</th></tr></thead>
//           <tbody>
//             ${state.data.students.map(s => `
//               <tr>
//                 <td>${s.usn}</td>
//                 <td>${s.name}</td>
//                 <td>
//                   <input
//                     class="marks-input"
//                     type="number" min="0" max="50"
//                     value="${state.data.savedLab[s.usn] ?? ''}"
//                     id="lab-${s.usn}"
//                     placeholder="0–50">
//                 </td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//       <br>
//       <button class="btn btn-primary" onclick="saveLabMarks()">💾 Save Lab Marks</button>
//     </div>
//   </div>`;
// }

// function saveLabMarks() {
//   state.data.students.forEach(s => {
//     const el = document.getElementById(`lab-${s.usn}`);
//     if (el) state.data.savedLab[s.usn] = Number(el.value);
//   });
//   try { localStorage.setItem('labMarks', JSON.stringify(state.data.savedLab)); } catch(e){}
//   showToast('Lab marks saved successfully!', 'success');
// }

// function renderAssignments(c) {
//   const assignments = [
//     {title:'Java Programming Assignment',      subject:'Java',  due:'2024-05-20',status:'Pending'},
//     {title:'DBMS ER Diagram Assignment',        subject:'DBMS',  due:'2024-05-25',status:'Pending'},
//     {title:'Python Data Analysis Assignment',   subject:'Python',due:'2024-05-30',status:'Submitted'},
//   ];
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📋 Assignments</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>Title</th><th>Subject</th><th>Due Date</th><th>Status</th></tr></thead>
//           <tbody>
//             ${assignments.map(a => `
//               <tr>
//                 <td><strong>${a.title}</strong></td>
//                 <td>${a.subject}</td>
//                 <td>${a.due}</td>
//                 <td><span class="badge ${a.status==='Pending'?'badge-warning':'badge-success'}">${a.status}</span></td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// /* =====================================================
//    STUDENT MODULES
// ===================================================== */
// function renderStudentProfile(c) {
//   const student = state.data.students.find(s => s.usn === state.user.usn) || {};
//   const initials = state.user.name.split(' ').map(w=>w[0]).join('').slice(0,2);
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">👤 My Profile</span></div>
//     <div class="section-body">
//       <div class="profile-header">
//         <div class="profile-avatar">${initials}</div>
//         <div class="profile-info">
//           <h2>${state.user.name}</h2>
//           <p>USN: ${state.user.usn || '—'}</p>
//           <p>Email: ${state.user.email}</p>
//           <div class="profile-badges">
//             <span class="profile-badge">📚 BCA</span>
//             <span class="profile-badge">📅 Semester 6</span>
//             <span class="profile-badge">🏫 2021–2024 Batch</span>
//           </div>
//         </div>
//       </div>
//       ${student.name ? `
//       <div class="form-grid" style="margin-top:24px;">
//         <div><div class="inp-label">Phone</div><div class="inp" style="pointer-events:none;">${student.phone}</div></div>
//         <div><div class="inp-label">Date of Birth</div><div class="inp" style="pointer-events:none;">${student.dob}</div></div>
//         <div><div class="inp-label">Gender</div><div class="inp" style="pointer-events:none;">${student.gender}</div></div>
//         <div><div class="inp-label">Admission Date</div><div class="inp" style="pointer-events:none;">${student.admission}</div></div>
//         <div><div class="inp-label">Parent / Guardian</div><div class="inp" style="pointer-events:none;">${student.parent}</div></div>
//         <div><div class="inp-label">Parent Phone</div><div class="inp" style="pointer-events:none;">${student.parent_phone}</div></div>
//         <div class="form-col-full"><div class="inp-label">Address</div><div class="inp" style="pointer-events:none;">${student.address}</div></div>
//       </div>` : ''}
//     </div>
//   </div>`;
// }

// function renderMyAttendance(c) {
//   const usn = state.user.usn || '21BCA001';
//   const att = state.data.attendance[usn] || {};
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📅 My Attendance</span></div>
//     <div class="section-body">
//       ${Object.keys(att).length === 0 ? '<p style="color:var(--text2);">No attendance data available.</p>' :
//         Object.entries(att).map(([code, pct]) => `
//           <div style="margin-bottom:18px;">
//             <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
//               <span style="font-weight:600;">${code}</span>
//               <strong style="color:${pct>=75?'var(--success)':pct>=60?'var(--warning)':'var(--danger)'}">${pct}%</strong>
//             </div>
//             <div class="progress-bar">
//               <div class="progress-fill ${pct>=75?'progress-good':pct>=60?'progress-warn':'progress-bad'}" style="width:${pct}%"></div>
//             </div>
//             <div style="font-size:0.76rem;color:var(--text2);margin-top:4px;">
//               ${pct>=75?'✓ Attendance eligible':'⚠️ Below 75% — attendance shortage'}
//             </div>
//           </div>`).join('')}
//     </div>
//   </div>`;
// }

// function renderMyMarks(c) {
//   const usn   = state.user.usn || '21BCA001';
//   const marks = state.data.marks[usn] || [];
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📈 My Marks</span></div>
//     <div class="section-body">
//       ${marks.length === 0 ? '<p style="color:var(--text2);">No marks data available.</p>' : `
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>Subject</th><th>Code</th><th>Internal (50)</th><th>Final (100)</th><th>Total</th><th>Grade</th></tr></thead>
//           <tbody>
//             ${marks.map(m => {
//               const total = m.internal + m.final;
//               const pct   = Math.round(total / 150 * 100);
//               const grade = pct >= 90 ? 'O' : pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : 'F';
//               return `
//                 <tr>
//                   <td><strong>${m.sub}</strong></td>
//                   <td>${m.code}</td>
//                   <td>${m.internal}</td>
//                   <td>${m.final}</td>
//                   <td><strong>${total}</strong></td>
//                   <td><span class="badge ${grade==='F'?'badge-danger':grade==='B'||grade==='B+'?'badge-warning':'badge-success'}">${grade}</span></td>
//                 </tr>`;
//             }).join('')}
//           </tbody>
//         </table>
//       </div>`}
//     </div>
//   </div>`;
// }

// function renderMyLabMarks(c) {
//   const usn   = state.user.usn || '21BCA001';
//   const marks = (state.data.marks[usn] || []).filter(m => m.lab_int !== null);
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">💻 Lab Marks</span></div>
//     <div class="section-body">
//       ${marks.length === 0 ? '<p style="color:var(--text2);">No lab marks available.</p>' : `
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>Subject</th><th>Code</th><th>Lab Internal (50)</th><th>Lab External (50)</th><th>Total (100)</th></tr></thead>
//           <tbody>
//             ${marks.map(m => `
//               <tr>
//                 <td><strong>${m.sub}</strong></td>
//                 <td>${m.code}</td>
//                 <td>${m.lab_int}</td>
//                 <td>${m.lab_ext}</td>
//                 <td><strong>${m.lab_int + m.lab_ext}</strong></td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>`}
//     </div>
//   </div>`;
// }

// function renderCourseDetails(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">📚 Course Details — BCA Semester 6</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>Code</th><th>Subject</th><th>Credits</th><th>Has Lab</th></tr></thead>
//           <tbody>
//             ${state.data.subjects.filter(s => s.course === 'BCA').map(sub => `
//               <tr>
//                 <td><code>${sub.code}</code></td>
//                 <td>${sub.name}</td>
//                 <td>${sub.credits}</td>
//                 <td>${sub.lab ? '<span class="badge badge-info">Yes</span>' : '—'}</td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// function renderChangePassword(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">🔑 Change Password</span></div>
//     <div class="section-body">
//       <div style="max-width:420px;">
//         <div class="form-group" style="margin-bottom:16px;">
//           <label class="inp-label">Current Password</label>
//           <input type="password" class="form-control inp" id="cp-current" placeholder="Enter current password">
//         </div>
//         <div class="form-group" style="margin-bottom:16px;">
//           <label class="inp-label">New Password</label>
//           <input type="password" class="form-control inp" id="cp-new" placeholder="Enter new password (min 6 chars)">
//         </div>
//         <div class="form-group" style="margin-bottom:20px;">
//           <label class="inp-label">Confirm New Password</label>
//           <input type="password" class="form-control inp" id="cp-confirm" placeholder="Confirm new password">
//         </div>
//         <button class="btn btn-primary" onclick="doChangePassword()">🔐 Update Password</button>
//       </div>
//     </div>
//   </div>`;
// }

// function doChangePassword() {
//   const cur  = document.getElementById('cp-current').value;
//   const np   = document.getElementById('cp-new').value;
//   const conf = document.getElementById('cp-confirm').value;
//   if (!cur || !np || !conf) { showToast('Please fill all fields', 'error'); return; }
//   if (np.length < 6)        { showToast('New password must be at least 6 characters', 'error'); return; }
//   if (np !== conf)          { showToast('New passwords do not match', 'error'); return; }

//   // Update in creds store
//   try {
//     const creds = JSON.parse(localStorage.getItem('creds')) || {};
//     const key   = state.user.username;
//     if (creds[key] && creds[key].password !== cur) {
//       showToast('Current password is incorrect', 'error'); return;
//     }
//     if (creds[key]) creds[key].password = np;
//     localStorage.setItem('creds', JSON.stringify(creds));
//     // Persist updated user session
//     state.user = { ...state.user };
//     localStorage.setItem('loggedUser', JSON.stringify(state.user));
//   } catch(e){}
//   showToast('Password updated successfully!', 'success');
//   // Clear fields
//   ['cp-current','cp-new','cp-confirm'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
// }

// /* =====================================================
//    STAFF MODULES
// ===================================================== */
// function renderEvents(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">🎉 Events & Circulars</span></div>
//     <div class="section-body">
//       ${state.data.events.map(event => `
//         <div class="notice-card" style="border-left-color:var(--accent)">
//           <div class="notice-title">${event.title}</div>
//           <div class="notice-body">${event.desc}</div>
//           <div class="notice-meta">
//             <span>📅 ${event.date}</span>
//             <span class="badge badge-info">${event.type}</span>
//           </div>
//         </div>`).join('')}
//     </div>
//   </div>`;
// }

// function renderStudentInfo(c) {
//   c.innerHTML = `
//   <div class="section-card">
//     <div class="section-header"><span class="section-title">🎓 Student Details</span></div>
//     <div class="section-body">
//       <div class="table-wrap">
//         <table>
//           <thead><tr><th>USN</th><th>Name</th><th>Course</th><th>Semester</th><th>Phone</th><th>Parent</th><th>Status</th></tr></thead>
//           <tbody>
//             ${state.data.students.map(s => `
//               <tr>
//                 <td><strong>${s.usn}</strong></td>
//                 <td>${s.name}</td>
//                 <td>${s.course}</td>
//                 <td>Sem ${s.semester}</td>
//                 <td>${s.phone}</td>
//                 <td>${s.parent}</td>
//                 <td><span class="badge badge-success">Active</span></td>
//               </tr>`).join('')}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>`;
// }

// /* =====================================================
//    INITIALISATION — runs once when DOM is fully loaded
// ===================================================== */
// window.addEventListener('load', function() {
//   /* Restore saved theme */
//   const savedTheme = localStorage.getItem('theme');
//   const check = document.getElementById('theme-check');
//   if (savedTheme === 'dark') {
//     document.documentElement.setAttribute('data-theme', 'dark');
//     if (check) check.checked = true;
//   }

//   /* Auto-login if session exists */
//   try {
//     const savedUser = JSON.parse(localStorage.getItem('loggedUser'));
//     if (savedUser && savedUser.role) {
//       state.user = savedUser;
//       state.role = savedUser.role;
//       launchApp();
//     }
//   } catch(e) {
//     localStorage.removeItem('loggedUser');
//   }
// });

// /* Enter key triggers login — attached once */
// document.addEventListener('keydown', function(e) {
//   if (e.key === 'Enter') {
//     const loginPage = document.getElementById('login-page');
//     if (loginPage && loginPage.style.display !== 'none') {
//       doLogin();
//     }
//   }
// });


/* =====================================================
   EduManage Pro — script.js
   Frontend with MongoDB backend integration.
   API base: http://localhost:5500/api
   All teacher-saved data (attendance, marks) is stored
   in MongoDB and available on any device when logged in.
===================================================== */

// =====================================================
// CONFIG — change this if your server runs elsewhere
// =====================================================
const API_BASE = 'http://localhost:5500/api';

// =====================================================
// GLOBAL ERROR BOUNDARY
// =====================================================
window.onerror = function(message, source, line) {
  console.error('JS Error:', message, 'at line', line);
  const page = document.getElementById('page-content');
  if (page) {
    page.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p><strong>Something went wrong</strong></p>
        <p style="margin-top:8px;font-size:0.8rem;color:var(--danger);">${message}</p>
      </div>`;
  }
};

// =====================================================
// OTP STATE
// =====================================================
let generatedOTP = '';

// =====================================================
// APPLICATION STATE
// =====================================================
const state = {
  user:  null,
  token: null,
  role:  'admin',
  page:  'dashboard',
  sidebarCollapsed: false,

  /* Static / seed data shown in the UI */
  data: {
    students: [
      {id:1, usn:'21BCA001',name:'Rahul Sharma',  email:'rahul@student.edu', phone:'9901001001',course:'BCA',semester:6,gender:'Male',  dob:'2003-04-15',parent:'Ramesh Sharma',  parent_phone:'9800001001',address:'123 MG Road, Bangalore',     admission:'2021-09-01',status:'active'},
      {id:2, usn:'21BCA002',name:'Priya Reddy',   email:'priya@student.edu', phone:'9901002002',course:'BCA',semester:6,gender:'Female',dob:'2003-07-22',parent:'Ravi Reddy',     parent_phone:'9800002002',address:'456 JP Nagar, Bangalore',   admission:'2021-09-01',status:'active'},
      {id:3, usn:'21BCA003',name:'Amit Patel',    email:'amit@student.edu',  phone:'9901003003',course:'BCA',semester:6,gender:'Male',  dob:'2002-12-10',parent:'Suresh Patel',   parent_phone:'9800003003',address:'789 Koramangala, Bangalore', admission:'2021-09-01',status:'active'},
      {id:4, usn:'21BCA004',name:'Sneha Nair',    email:'sneha@student.edu', phone:'9901004004',course:'BCA',semester:6,gender:'Female',dob:'2003-02-28',parent:'Krishna Nair',   parent_phone:'9800004004',address:'321 Whitefield, Bangalore',  admission:'2021-09-01',status:'active'},
      {id:5, usn:'21BCA005',name:'Vikram Singh',  email:'vikram@student.edu',phone:'9901005005',course:'BCA',semester:6,gender:'Male',  dob:'2003-09-05',parent:'Baldev Singh',   parent_phone:'9800005005',address:'654 Marathahalli, Bangalore',admission:'2021-09-01',status:'active'},
      {id:6, usn:'22BCA001',name:'Divya Menon',   email:'divya@student.edu', phone:'9902001001',course:'BCA',semester:4,gender:'Female',dob:'2004-01-18',parent:'Prakash Menon',  parent_phone:'9800006006',address:'111 HSR Layout, Bangalore',  admission:'2022-09-01',status:'active'},
      {id:7, usn:'22BCA002',name:'Arjun Kumar',   email:'arjun@student.edu', phone:'9902002002',course:'BCA',semester:4,gender:'Male',  dob:'2004-06-30',parent:'Sunil Kumar',    parent_phone:'9800007007',address:'222 Indiranagar, Bangalore', admission:'2022-09-01',status:'active'},
      {id:8, usn:'23BCA001',name:'Ananya Joshi',  email:'ananya@student.edu',phone:'9903001001',course:'BCA',semester:2,gender:'Female',dob:'2005-03-14',parent:'Mohan Joshi',    parent_phone:'9800008008',address:'333 Banashankari, Bangalore',admission:'2023-09-01',status:'active'},
    ],
    teachers: [
      {id:1,name:'Dr. Rajesh Kumar', email:'rajesh.kumar@college.edu',phone:'9845001234',dept:'Computer Science',qual:'Ph.D. CS',     exp:15,gender:'Male',  joining:'2009-06-01',subjects:['C Programming','Data Structures','Java']},
      {id:2,name:'Prof. Meena Sharma',email:'meena.sharma@college.edu',phone:'9845002345',dept:'Mathematics',     qual:'M.Sc. Maths', exp:10,gender:'Female',joining:'2014-07-15',subjects:['Mathematics Foundation']},
      {id:3,name:'Mr. Suresh Nair',  email:'suresh.nair@college.edu', phone:'9845003456',dept:'Computer Science',qual:'M.Tech CS',   exp:8, gender:'Male',  joining:'2016-06-01',subjects:['OOP C++','Python']},
      {id:4,name:'Ms. Priya Patel',  email:'priya.patel@college.edu', phone:'9845004567',dept:'IT',              qual:'MCA',         exp:6, gender:'Female',joining:'2018-07-01',subjects:['Web Technologies','React JS']},
      {id:5,name:'Dr. Anil Verma',   email:'anil.verma@college.edu',  phone:'9845005678',dept:'Electronics',     qual:'Ph.D. Electronics',exp:12,gender:'Male',joining:'2012-06-01',subjects:['Digital Electronics']},
    ],
    staff: [
      {id:1,name:'Mrs. Lakshmi Devi',email:'lakshmi@college.edu',phone:'9876001001',designation:'Office Superintendent',dept:'Administration',gender:'Female',joining:'2005-01-10'},
      {id:2,name:'Mr. Ganesh Rao',   email:'ganesh@college.edu', phone:'9876002002',designation:'Clerk',                dept:'Administration',gender:'Male',  joining:'2010-03-15'},
      {id:3,name:'Ms. Kavitha Bhat', email:'kavitha@college.edu',phone:'9876003003',designation:'Librarian',           dept:'Library',       gender:'Female',joining:'2012-07-01'},
    ],
    courses: [
      {id:1,code:'BCA',   name:'Bachelor of Computer Applications',  duration:3,students:45},
      {id:2,code:'BSC-CS',name:'Bachelor of Science - CS',           duration:3,students:30},
      {id:3,code:'MCA',   name:'Master of Computer Applications',    duration:2,students:20},
    ],
    subjects: [
      {id:1, code:'BCA101',name:'Mathematics Foundation',  course:'BCA',sem:1,credits:4,lab:false},
      {id:2, code:'BCA102',name:'Computer Fundamentals',   course:'BCA',sem:1,credits:4,lab:false},
      {id:3, code:'BCA103',name:'C Programming',           course:'BCA',sem:1,credits:4,lab:true},
      {id:4, code:'BCA201',name:'Data Structures',         course:'BCA',sem:2,credits:4,lab:true},
      {id:5, code:'BCA202',name:'OOP with C++',            course:'BCA',sem:2,credits:4,lab:true},
      {id:6, code:'BCA203',name:'DBMS',                    course:'BCA',sem:2,credits:4,lab:true},
      {id:7, code:'BCA301',name:'Java Programming',        course:'BCA',sem:3,credits:4,lab:true},
      {id:8, code:'BCA302',name:'Operating Systems',       course:'BCA',sem:3,credits:4,lab:false},
      {id:9, code:'BCA401',name:'Advanced Java',           course:'BCA',sem:4,credits:4,lab:true},
      {id:10,code:'BCA501',name:'Machine Learning',        course:'BCA',sem:5,credits:4,lab:true},
      {id:11,code:'BCA601',name:'Final Year Project',      course:'BCA',sem:6,credits:8,lab:true},
      {id:12,code:'BCA602',name:'Professional Ethics',     course:'BCA',sem:6,credits:2,lab:false},
    ],
    notices: [
      {id:1,title:'Semester Exam Schedule Released',body:'Final semester examination schedule has been released. Exams begin from March 15, 2024.',by:'Admin',date:'2024-02-01',target:'all'},
      {id:2,title:'Workshop on AI & Machine Learning',body:'A two-day workshop on AI will be conducted on February 20–21. Final year students must attend.',by:'Admin',date:'2024-01-28',target:'all'},
      {id:3,title:'Library Book Return Reminder',body:'All students who borrowed library books must return them before February 25, 2024.',by:'Staff',date:'2024-01-25',target:'student'},
      {id:4,title:'College Annual Day Celebration',body:'Annual Day will be held on March 5, 2024. Students are requested to participate in cultural events.',by:'Staff',date:'2024-01-20',target:'all'},
    ],
    exams: [
      {id:1,name:'Internal Assessment-I', type:'Internal',subject:'Final Year Project',  course:'BCA',sem:6,date:'2024-02-15',time:'09:00',room:'Room 101'},
      {id:2,name:'Final Examination',     type:'Final',   subject:'Final Year Project',  course:'BCA',sem:6,date:'2024-03-15',time:'10:00',room:'Exam Hall A'},
      {id:3,name:'Lab Practical',         type:'Lab',     subject:'Final Year Project',  course:'BCA',sem:6,date:'2024-03-18',time:'09:00',room:'Lab 1'},
      {id:4,name:'Internal Assessment-I', type:'Internal',subject:'Professional Ethics', course:'BCA',sem:6,date:'2024-02-16',time:'09:00',room:'Room 102'},
    ],
    events: [
      {id:1,title:'Annual Sports Day',  desc:'Various indoor & outdoor games for all students and staff.',date:'2024-02-10',type:'Sports'},
      {id:2,title:'Techfest 2024',      desc:'Annual technology festival with coding competitions, hackathons, and project exhibitions.',date:'2024-03-01',type:'Academic'},
      {id:3,title:'College Annual Day', desc:'Annual day celebration with cultural programs and prize distribution.',date:'2024-03-05',type:'Cultural'},
    ],

    /* Live data fetched from MongoDB — populated by API calls */
    dbAttendance: {},   // { usn: { subjectCode: percentage } }
    dbMarks: {},        // { usn: { subjectCode: { internal, final, lab_int, lab_ext } } }
  }
};

// =====================================================
// API HELPER — fetch wrapper with JWT
// =====================================================
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers['Authorization'] = 'Bearer ' + state.token;

  const res = await fetch(API_BASE + path, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// =====================================================
// TOAST
// =====================================================
function showToast(message, type = 'success') {
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '📢'}</span><span class="toast-msg">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove(), { once:true });
  }, 3500);
}

// =====================================================
// THEME
// =====================================================
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}

// =====================================================
// LOGIN — role tabs & helpers
// =====================================================
let selectedRole = 'admin';

function setRole(r) {
  selectedRole = r;
  document.querySelectorAll('.login-tab').forEach((t, i) => {
    t.classList.toggle('active', ['admin','teacher','student','staff'][i] === r);
  });
}

function fillCreds(u, p, r) {
  setRole(r);
  document.getElementById('login-user').value = u;
  document.getElementById('login-pass').value = p;
}

function togglePass() {
  const el = document.getElementById('login-pass');
  el.type = el.type === 'password' ? 'text' : 'password';
  document.getElementById('pass-toggle').textContent = el.type === 'password' ? '👁️' : '🙈';
}

// =====================================================
// LOGIN — calls backend /api/login
// =====================================================
async function doLogin() {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  if (!username || !password) { showToast('Please enter username and password', 'error'); return; }

  const btn = document.getElementById('login-btn');
  const txt = document.getElementById('login-btn-text');
  btn.disabled = true;
  txt.textContent = 'Signing in…';

  try {
    const data = await api('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    state.user  = data.user;
    state.token = data.token;
    state.role  = data.user.role;

    // Persist session
    localStorage.setItem('token',      data.token);
    localStorage.setItem('loggedUser', JSON.stringify(data.user));

    launchApp();
  } catch (err) {
    showToast(err.message || 'Login failed', 'error');
  } finally {
    btn.disabled = false;
    txt.textContent = 'Sign In →';
  }
}

function launchApp() {
  document.getElementById('login-page').style.display = 'none';
  const app = document.getElementById('app');
  app.style.display = 'flex';
  app.classList.add('active');

  const initials = state.user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('sidebar-avatar').textContent = initials;
  document.getElementById('sidebar-name').textContent   = state.user.name;
  document.getElementById('sidebar-role').textContent   = state.user.role.charAt(0).toUpperCase() + state.user.role.slice(1);
  const roleColors = { admin:'#dc2626', teacher:'#2563a8', student:'#16a34a', staff:'#d97706' };
  document.getElementById('sidebar-avatar').style.background = roleColors[state.user.role] || '#64748b';

  buildNav();
  loadNotifications();
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
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  showToast('Logged out successfully', 'info');
}

// =====================================================
// FORGOT PASSWORD / OTP
// =====================================================
function showForgot() {
  document.getElementById('login-form-section').style.display = 'none';
  document.getElementById('forgot-section').style.display = 'block';
}

function showLogin() {
  document.getElementById('forgot-section').style.display = 'none';
  document.getElementById('login-form-section').style.display = 'block';
  document.getElementById('fp-step1').style.display = 'block';
  document.getElementById('fp-step2').style.display = 'none';
  document.getElementById('fp-step3').style.display = 'none';
  ['o1','o2','o3','o4','o5','o6'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
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
  setTimeout(() => { const el=document.getElementById('o1'); if(el) el.focus(); }, 100);
}

function otpNext(el, nextId) {
  el.value = el.value.replace(/\D/g, '');
  if (el.value.length === 1 && nextId) {
    const next = document.getElementById(nextId);
    if (next) next.focus();
  }
}

function verifyOTP() {
  const otp = ['o1','o2','o3','o4','o5','o6'].map(id => document.getElementById(id)?.value || '').join('');
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

// =====================================================
// NAVIGATION CONFIG
// =====================================================
const navConfig = {
  admin: [
    { section:'Main', items:[
      {id:'dashboard',icon:'📊',label:'Dashboard'},{id:'students',icon:'🎓',label:'Students'},
      {id:'teachers',icon:'👨‍🏫',label:'Teachers'},{id:'staff',icon:'👥',label:'Staff'},
    ]},
    { section:'Academics', items:[
      {id:'courses',icon:'📚',label:'Courses'},{id:'subjects',icon:'📖',label:'Subjects'},{id:'exams',icon:'📝',label:'Exam Schedule'},
    ]},
    { section:'Reports', items:[
      {id:'attendance-report',icon:'📅',label:'Attendance Report'},{id:'marks-report',icon:'📈',label:'Marks Report'},{id:'notices',icon:'📢',label:'Notices'},
    ]},
  ],
  teacher: [
    { section:'Main', items:[
      {id:'dashboard',icon:'📊',label:'Dashboard'},{id:'my-students',icon:'🎓',label:'My Students'},
    ]},
    { section:'Management', items:[
      {id:'upload-attendance',icon:'📅',label:'Upload Attendance'},
      {id:'internal-marks',icon:'📝',label:'Internal Marks'},
      {id:'final-marks',icon:'📈',label:'Final Marks'},
      {id:'lab-marks',icon:'💻',label:'Lab Marks'},
      {id:'assignments',icon:'📋',label:'Assignments'},
    ]},
    { section:'Info', items:[{id:'notices',icon:'📢',label:'Notices'}]},
  ],
  student: [
    { section:'Main', items:[
      {id:'dashboard',icon:'📊',label:'Dashboard'},{id:'profile',icon:'👤',label:'My Profile'},
    ]},
    { section:'Academics', items:[
      {id:'my-attendance',icon:'📅',label:'Attendance'},{id:'my-marks',icon:'📈',label:'My Marks'},
      {id:'my-lab-marks',icon:'💻',label:'Lab Marks'},{id:'course-details',icon:'📚',label:'Course Details'},
    ]},
    { section:'Info', items:[
      {id:'notices',icon:'📢',label:'Notices'},{id:'change-password',icon:'🔑',label:'Change Password'},
    ]},
  ],
  staff: [
    { section:'Main', items:[
      {id:'dashboard',icon:'📊',label:'Dashboard'},{id:'notices',icon:'📢',label:'Upload Notices'},
      {id:'events',icon:'🎉',label:'Events & Circulars'},
    ]},
    { section:'Info', items:[{id:'student-info',icon:'🎓',label:'Student Details'}]},
  ],
};

// =====================================================
// NAVIGATION
// =====================================================
function buildNav() {
  const menu = document.getElementById('nav-menu');
  menu.innerHTML = '';
  (navConfig[state.role] || []).forEach(section => {
    const label = document.createElement('div');
    label.className = 'nav-section-label';
    label.textContent = section.section;
    menu.appendChild(label);
    section.items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'nav-item';
      btn.dataset.page = item.id;
      btn.type = 'button';
      btn.innerHTML = `<span class="nav-icon">${item.icon}</span><span class="nav-label">${item.label}</span>`;
      btn.onclick = () => navigateTo(item.id);
      menu.appendChild(btn);
    });
  });
}

function navigateTo(page) {
  state.page = page;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  document.getElementById('page-title').textContent = findNavLabel(page);
  document.getElementById('page-content').innerHTML = '<div style="text-align:center;padding:60px;"><span style="font-size:2.5rem;">⏳</span></div>';
  if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('mobile-open');
  setTimeout(() => renderPage(page), 120);
}

function findNavLabel(page) {
  for (const s of navConfig[state.role] || []) {
    const item = s.items.find(x => x.id === page);
    if (item) return item.label;
  }
  return page.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase());
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (window.innerWidth <= 768) sb.classList.toggle('mobile-open');
  else { sb.classList.toggle('collapsed'); state.sidebarCollapsed = sb.classList.contains('collapsed'); }
}

// =====================================================
// NOTIFICATIONS
// =====================================================
function loadNotifications() {
  const body = document.getElementById('notif-body');
  const dot  = document.getElementById('notif-dot');
  if (!body) return;
  body.innerHTML = state.data.notices.map(n => `
    <div class="notif-item">
      <p><strong>${n.title}</strong></p>
      <p>${n.body.slice(0,80)}…</p>
      <small>${n.date} &bull; ${n.by}</small>
    </div>`).join('');
  if (dot) dot.style.display = state.data.notices.length ? 'block' : 'none';
}

function toggleNotifPanel() {
  document.getElementById('notif-panel').classList.toggle('open');
}

// =====================================================
// PAGE RENDERER
// =====================================================
function renderPage(page) {
  const c = document.getElementById('page-content');
  if (!c) return;
  const renders = {
    dashboard:'renderDashboard', students:'renderStudents', teachers:'renderTeachers',
    staff:'renderStaff', courses:'renderCourses', subjects:'renderSubjects',
    exams:'renderExams', 'attendance-report':'renderAttendanceReport',
    'marks-report':'renderMarksReport', notices:'renderNotices',
    'my-students':'renderMyStudents', 'upload-attendance':'renderUploadAttendance',
    'internal-marks':'renderInternalMarks', 'final-marks':'renderFinalMarks',
    'lab-marks':'renderLabMarks', assignments:'renderAssignments',
    profile:'renderStudentProfile', 'my-attendance':'renderMyAttendance',
    'my-marks':'renderMyMarks', 'my-lab-marks':'renderMyLabMarks',
    'course-details':'renderCourseDetails', 'change-password':'renderChangePassword',
    events:'renderEvents', 'student-info':'renderStudentInfo',
  };
  const fnName = renders[page];
  if (fnName && typeof window[fnName] === 'function') {
    try { window[fnName](c); }
    catch(err) {
      console.error('Render error:', page, err);
      c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Failed to render <strong>${page}</strong></p></div>`;
    }
  } else {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">🚧</div><p>Module under development.</p></div>`;
  }
}

// =====================================================
// DASHBOARD — role dispatch
// =====================================================
function renderDashboard(c) {
  if (state.role === 'admin')   renderAdminDashboard(c);
  else if (state.role === 'teacher') renderTeacherDashboard(c);
  else if (state.role === 'student') renderStudentDashboard(c);
  else renderStaffDashboard(c);
}

/* ---- Admin Dashboard ---- */
function renderAdminDashboard(c) {
  c.innerHTML = `
  <div class="stats-grid stagger">
    <div class="stat-card"><div class="stat-icon" style="background:rgba(37,99,168,0.1)">🎓</div><div class="stat-info"><h3>8</h3><p>Total Students</p><span class="stat-change change-up">↑ 3 this month</span></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">👨‍🏫</div><div class="stat-info"><h3>5</h3><p>Total Teachers</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">👥</div><div class="stat-info"><h3>3</h3><p>Staff Members</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(139,92,246,0.1)">📚</div><div class="stat-info"><h3>3</h3><p>Courses Active</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(8,145,178,0.1)">📖</div><div class="stat-info"><h3>12</h3><p>Subjects</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(220,38,38,0.1)">📢</div><div class="stat-info"><h3>4</h3><p>Active Notices</p></div></div>
  </div>
  <div class="charts-row">
    <div class="section-card">
      <div class="section-header"><span class="section-title">📊 Enrollment by Course</span></div>
      <div class="section-body"><div class="chart-container"><canvas id="courseChart"></canvas></div></div>
    </div>
    <div class="section-card">
      <div class="section-header"><span class="section-title">📅 Attendance Overview</span></div>
      <div class="section-body"><div class="chart-container"><canvas id="attChart"></canvas></div></div>
    </div>
  </div>
  <div class="charts-row">
    <div class="section-card">
      <div class="section-header"><span class="section-title">📢 Recent Notices</span><button class="btn btn-primary btn-sm" onclick="navigateTo('notices')">View All</button></div>
      <div class="section-body">${state.data.notices.slice(0,3).map(n=>`
        <div class="notice-card"><div class="notice-title">${n.title}</div><div class="notice-body">${n.body.slice(0,80)}…</div><div class="notice-meta"><span>📅 ${n.date}</span><span>👤 ${n.by}</span></div></div>`).join('')}</div>
    </div>
    <div class="section-card">
      <div class="section-header"><span class="section-title">📝 Upcoming Exams</span><button class="btn btn-primary btn-sm" onclick="navigateTo('exams')">View All</button></div>
      <div class="section-body"><div class="table-wrap"><table>
        <thead><tr><th>Exam</th><th>Type</th><th>Date</th><th>Room</th></tr></thead>
        <tbody>${state.data.exams.map(e=>`<tr><td>${e.name}</td><td><span class="badge ${e.type==='Internal'?'badge-warning':e.type==='Lab'?'badge-info':'badge-primary'}">${e.type}</span></td><td>${e.date}</td><td>${e.room}</td></tr>`).join('')}</tbody>
      </table></div></div>
    </div>
  </div>`;
  setTimeout(() => {
    if (typeof Chart === 'undefined') return;
    new Chart(document.getElementById('courseChart'), {
      type:'doughnut', data:{ labels:['BCA','BSC-CS','MCA'], datasets:[{data:[45,30,20],backgroundColor:['#2563a8','#16a34a','#f0a500'],borderWidth:0}] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} }
    });
    new Chart(document.getElementById('attChart'), {
      type:'bar', data:{ labels:['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6'], datasets:[{label:'Avg Attendance %',data:[88,82,85,79,83,81],backgroundColor:'rgba(37,99,168,0.7)',borderRadius:8}] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true,max:100}} }
    });
  }, 150);
}

/* ---- Teacher Dashboard ---- */
function renderTeacherDashboard(c) {
  const initials = state.user.name.split(' ').map(w=>w[0]).join('').slice(0,2);
  c.innerHTML = `
  <div class="profile-header" style="margin-bottom:24px;">
    <div class="profile-avatar">${initials}</div>
    <div class="profile-info">
      <h2>${state.user.name}</h2>
      <p>Computer Science Department</p>
      <div class="profile-badges">
        <span class="profile-badge">👨‍🏫 Senior Faculty</span>
        <span class="profile-badge">📚 3 Subjects</span>
        <span class="profile-badge">🎓 Sem 6 Coordinator</span>
      </div>
    </div>
  </div>
  <div class="stats-grid stagger">
    <div class="stat-card"><div class="stat-icon" style="background:rgba(37,99,168,0.1)">🎓</div><div class="stat-info"><h3>8</h3><p>My Students</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">📖</div><div class="stat-info"><h3>3</h3><p>Subjects</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">📅</div><div class="stat-info"><h3>82%</h3><p>Avg Attendance</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(139,92,246,0.1)">📋</div><div class="stat-info"><h3>2</h3><p>Assignments Pending</p></div></div>
  </div>
  <div class="section-card">
    <div class="section-header"><span class="section-title">📊 Class Attendance</span></div>
    <div class="section-body"><div class="chart-container"><canvas id="tchart"></canvas></div></div>
  </div>`;
  setTimeout(() => {
    if (typeof Chart === 'undefined') return;
    new Chart(document.getElementById('tchart'), {
      type:'bar',
      data:{ labels:state.data.students.slice(0,5).map(s=>s.name.split(' ')[0]),
        datasets:[{label:'Attendance %',data:[88,72,95,65,58],backgroundColor:['#16a34a','#f59e0b','#16a34a','#dc2626','#dc2626'],borderRadius:8}] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true,max:100}} }
    });
  }, 150);
}

/* ---- Student Dashboard ---- */
function renderStudentDashboard(c) {
  c.innerHTML = `<div style="text-align:center;padding:40px;font-size:1.5rem;">⏳ Loading your data…</div>`;
  loadStudentSummary().then(({ attendance, marks }) => {
    const vals   = Object.values(attendance);
    const avgAtt = vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : 0;
    c.innerHTML = `
    <div class="profile-header" style="margin-bottom:24px;">
      <div class="profile-avatar">${state.user.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
      <div class="profile-info">
        <h2>${state.user.name}</h2>
        <p>USN: ${state.user.usn} &nbsp;|&nbsp; BCA — Semester 6</p>
        <div class="profile-badges">
          <span class="profile-badge">📚 BCA</span>
          <span class="profile-badge">📅 Semester 6</span>
          <span class="profile-badge" style="background:rgba(255,165,0,0.2)">🔄 Live from DB</span>
        </div>
      </div>
    </div>
    <div class="stats-grid stagger">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(37,99,168,0.1)">📅</div>
        <div class="stat-info"><h3>${avgAtt}%</h3><p>Overall Attendance</p>
          <span class="stat-change ${avgAtt>=75?'change-up':'change-down'}">${avgAtt>=75?'✓ Good Standing':'⚠️ Below 75%'}</span>
        </div>
      </div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">📖</div><div class="stat-info"><h3>${Object.keys(attendance).length}</h3><p>Subjects Tracked</p></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">📈</div><div class="stat-info"><h3>${marks.length}</h3><p>Subjects with Marks</p></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(8,145,178,0.1)">📢</div><div class="stat-info"><h3>4</h3><p>Notices</p></div></div>
    </div>
    <div class="charts-row">
      <div class="section-card">
        <div class="section-header"><span class="section-title">📅 Subject-wise Attendance <span style="font-size:0.75rem;color:var(--success);font-weight:600;">● Live</span></span></div>
        <div class="section-body">
          ${Object.keys(attendance).length === 0 ? '<p style="color:var(--text2);">No attendance data yet. Ask your teacher to upload.</p>' :
            Object.entries(attendance).map(([code,pct]) => `
              <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                  <span style="font-size:0.85rem;font-weight:600;">${code}</span>
                  <span style="font-size:0.85rem;font-weight:700;color:${pct>=75?'var(--success)':pct>=60?'var(--warning)':'var(--danger)'}">${pct}%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill ${pct>=75?'progress-good':pct>=60?'progress-warn':'progress-bad'}" style="width:${pct}%"></div></div>
              </div>`).join('')}
        </div>
      </div>
      <div class="section-card">
        <div class="section-header"><span class="section-title">📢 Latest Notices</span></div>
        <div class="section-body">${state.data.notices.slice(0,3).map(n=>`
          <div class="notice-card"><div class="notice-title">${n.title}</div>
          <div class="notice-body">${n.body.slice(0,70)}…</div>
          <div class="notice-meta"><span>${n.date}</span></div></div>`).join('')}
        </div>
      </div>
    </div>`;
  }).catch(() => {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load data from server. Is the backend running?</p></div>`;
  });
}

/* ---- Staff Dashboard ---- */
function renderStaffDashboard(c) {
  const initials = state.user.name.split(' ').map(w=>w[0]).join('').slice(0,2);
  c.innerHTML = `
  <div class="profile-header" style="margin-bottom:24px;">
    <div class="profile-avatar">${initials}</div>
    <div class="profile-info"><h2>${state.user.name}</h2><p>Office Superintendent — Administration</p>
      <div class="profile-badges"><span class="profile-badge">🏢 Administration</span></div>
    </div>
  </div>
  <div class="stats-grid stagger">
    <div class="stat-card"><div class="stat-icon" style="background:rgba(37,99,168,0.1)">📢</div><div class="stat-info"><h3>4</h3><p>Active Notices</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(22,163,74,0.1)">🎉</div><div class="stat-info"><h3>3</h3><p>Upcoming Events</p></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(240,165,0,0.1)">🎓</div><div class="stat-info"><h3>8</h3><p>Students</p></div></div>
  </div>
  <div class="section-card">
    <div class="section-header"><span class="section-title">🎉 Upcoming Events</span><button class="btn btn-primary btn-sm" onclick="navigateTo('events')">Manage</button></div>
    <div class="section-body">${state.data.events.map(e=>`
      <div class="notice-card" style="border-left-color:var(--accent)">
        <div class="notice-title">${e.title}</div><div class="notice-body">${e.desc}</div>
        <div class="notice-meta"><span>📅 ${e.date}</span><span class="badge badge-info">${e.type}</span></div>
      </div>`).join('')}</div>
  </div>`;
}

// =====================================================
// ADMIN MODULES
// =====================================================
function renderStudents(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">🎓 Students</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>USN</th><th>Name</th><th>Email</th><th>Course</th><th>Sem</th><th>Status</th></tr></thead>
    <tbody>${state.data.students.map(s=>`<tr><td><strong>${s.usn}</strong></td><td>${s.name}</td><td>${s.email}</td><td>${s.course}</td><td>Sem ${s.semester}</td><td><span class="badge badge-success">Active</span></td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

function renderTeachers(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">👨‍🏫 Teachers</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>Name</th><th>Email</th><th>Dept</th><th>Qualification</th><th>Exp</th></tr></thead>
    <tbody>${state.data.teachers.map(t=>`<tr><td><strong>${t.name}</strong></td><td>${t.email}</td><td>${t.dept}</td><td>${t.qual}</td><td>${t.exp} yrs</td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

function renderStaff(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">👥 Staff</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>Name</th><th>Email</th><th>Designation</th><th>Dept</th></tr></thead>
    <tbody>${state.data.staff.map(s=>`<tr><td><strong>${s.name}</strong></td><td>${s.email}</td><td>${s.designation}</td><td>${s.dept}</td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

function renderCourses(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">📚 Courses</span></div><div class="section-body"><div class="stats-grid">
    ${state.data.courses.map(course=>`<div class="stat-card" style="flex-direction:column;align-items:flex-start;gap:8px;">
      <div style="font-weight:800;font-size:1.1rem;">${course.code}</div>
      <div style="font-size:0.85rem;color:var(--text2);">${course.name}</div>
      <div style="font-size:0.8rem;color:var(--text2);">⏱ ${course.duration} Years &nbsp; 🎓 ${course.students} Students</div>
    </div>`).join('')}
  </div></div></div>`;
}

function renderSubjects(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">📖 Subjects</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>Code</th><th>Subject</th><th>Course</th><th>Sem</th><th>Credits</th><th>Lab</th></tr></thead>
    <tbody>${state.data.subjects.map(sub=>`<tr><td><code>${sub.code}</code></td><td>${sub.name}</td><td>${sub.course}</td><td>Sem ${sub.sem}</td><td>${sub.credits}</td><td>${sub.lab?'<span class="badge badge-info">Yes</span>':'—'}</td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

function renderExams(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">📝 Exam Schedule</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>Exam</th><th>Type</th><th>Subject</th><th>Date</th><th>Time</th><th>Room</th></tr></thead>
    <tbody>${state.data.exams.map(e=>`<tr><td><strong>${e.name}</strong></td><td><span class="badge ${e.type==='Internal'?'badge-warning':e.type==='Lab'?'badge-info':'badge-primary'}">${e.type}</span></td><td>${e.subject}</td><td>${e.date}</td><td>${e.time}</td><td>${e.room}</td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

// Attendance report — fetches live from MongoDB
async function renderAttendanceReport(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading from database…</div>';
  try {
    const grouped = await api('/attendance/all');
    const usnList = Object.keys(grouped);
    if (usnList.length === 0) {
      c.innerHTML = `<div class="section-card"><div class="section-body"><div class="empty-state"><div class="empty-icon">📭</div><p>No attendance data saved yet.</p></div></div></div>`;
      return;
    }
    const allSubjects = [...new Set(usnList.flatMap(usn => Object.keys(grouped[usn])))].sort();
    c.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">📅 Attendance Report <span style="font-size:0.75rem;color:var(--success);font-weight:600;">● Live from MongoDB</span></span>
      </div>
      <div class="section-body"><div class="table-wrap"><table>
        <thead><tr><th>USN</th><th>Name</th>${allSubjects.map(s=>`<th>${s}</th>`).join('')}<th>Avg</th></tr></thead>
        <tbody>
          ${usnList.map(usn => {
            const student = state.data.students.find(s => s.usn === usn) || {};
            const vals    = Object.values(grouped[usn]);
            const avg     = vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : 0;
            return `<tr>
              <td><strong>${usn}</strong></td>
              <td>${student.name || '—'}</td>
              ${allSubjects.map(sub => {
                const v = grouped[usn][sub];
                return v !== undefined
                  ? `<td><span class="badge ${v>=75?'badge-success':v>=60?'badge-warning':'badge-danger'}">${v}%</span></td>`
                  : '<td>—</td>';
              }).join('')}
              <td><strong>${avg}%</strong></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div></div>
    </div>`;
  } catch (err) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

// Marks report — fetches live from MongoDB
async function renderMarksReport(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading from database…</div>';
  try {
    const grouped = await api('/marks/all');
    const usnList = Object.keys(grouped);
    if (usnList.length === 0) {
      c.innerHTML = `<div class="section-card"><div class="section-body"><div class="empty-state"><div class="empty-icon">📭</div><p>No marks data saved yet.</p></div></div></div>`;
      return;
    }
    c.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">📈 Marks Report <span style="font-size:0.75rem;color:var(--success);font-weight:600;">● Live from MongoDB</span></span>
      </div>
      <div class="section-body"><div class="table-wrap"><table>
        <thead><tr><th>USN</th><th>Name</th><th>Subject</th><th>Internal</th><th>Final</th><th>Lab Int</th><th>Lab Ext</th></tr></thead>
        <tbody>
          ${usnList.flatMap(usn => {
            const student = state.data.students.find(s => s.usn === usn) || {};
            return Object.entries(grouped[usn]).map(([subCode, data]) => `
              <tr>
                <td>${usn}</td>
                <td>${student.name || '—'}</td>
                <td>${data.subjectName || subCode}</td>
                <td>${data.internal ?? '—'}</td>
                <td>${data.final ?? '—'}</td>
                <td>${data.lab_internal ?? '—'}</td>
                <td>${data.lab_external ?? '—'}</td>
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
    ${state.data.notices.map(n=>`<div class="notice-card">
      <div class="notice-title">${n.title}</div><div class="notice-body">${n.body}</div>
      <div class="notice-meta"><span>📅 ${n.date}</span><span>👤 ${n.by}</span><span class="badge badge-info">${n.target}</span></div>
    </div>`).join('')}
  </div></div>`;
}

// =====================================================
// TEACHER MODULES — save to MongoDB
// =====================================================
function renderMyStudents(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">🎓 My Students</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>USN</th><th>Name</th><th>Course</th><th>Sem</th><th>Phone</th></tr></thead>
    <tbody>${state.data.students.map(s=>`<tr><td><strong>${s.usn}</strong></td><td>${s.name}</td><td>${s.course}</td><td>Sem ${s.semester}</td><td>${s.phone}</td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

/* ---- Upload Attendance — loads existing from DB then saves back ---- */
async function renderUploadAttendance(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading existing attendance…</div>';

  // Default subject for attendance
  const subject = 'BCA601';
  const subjectName = 'Final Year Project';

  // Try to load existing values from DB
  let existing = {};
  try {
    const records = await api(`/attendance?usn=`); // we'll load grouped below
    const grouped = await api('/attendance/all');
    // grouped: { usn: { subject: pct } }
    state.data.students.forEach(s => {
      existing[s.usn] = grouped[s.usn]?.[subject] ?? '';
    });
  } catch(e) { /* first time — no data yet */ }

  c.innerHTML = `
  <div class="section-card">
    <div class="section-header">
      <span class="section-title">📅 Upload Attendance</span>
      <div style="display:flex;align-items:center;gap:10px;">
        <label class="inp-label" style="margin:0;">Subject:</label>
        <select class="inp" id="att-subject" style="width:220px;">
          ${state.data.subjects.filter(s=>s.course==='BCA').map(s=>`<option value="${s.code}" ${s.code===subject?'selected':''}>${s.code} — ${s.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="section-body">
      <div class="table-wrap">
        <table>
          <thead><tr><th>USN</th><th>Name</th><th>Semester</th><th>Attendance % (0–100)</th></tr></thead>
          <tbody>
            ${state.data.students.map(s=>`
              <tr>
                <td><strong>${s.usn}</strong></td>
                <td>${s.name}</td>
                <td>Sem ${s.semester}</td>
                <td><input class="marks-input" type="number" min="0" max="100" id="att-${s.usn}" value="${existing[s.usn] ?? ''}" placeholder="0–100"></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <br>
      <button class="btn btn-primary" onclick="saveAttendance()">💾 Save to MongoDB</button>
      <span id="att-status" style="margin-left:12px;font-size:0.85rem;color:var(--text2);"></span>
    </div>
  </div>`;
}

async function saveAttendance() {
  const subjectEl = document.getElementById('att-subject');
  const subject   = subjectEl ? subjectEl.value : 'BCA601';
  const subjectName = state.data.subjects.find(s=>s.code===subject)?.name || subject;

  const records = state.data.students.map(s => {
    const el = document.getElementById(`att-${s.usn}`);
    return el && el.value !== '' ? { usn:s.usn, subject, percentage:Number(el.value) } : null;
  }).filter(Boolean);

  if (records.length === 0) { showToast('No values to save', 'error'); return; }

  const statusEl = document.getElementById('att-status');
  if (statusEl) statusEl.textContent = 'Saving…';

  try {
    const res = await api('/attendance', { method:'POST', body:JSON.stringify(records) });
    showToast(`✅ ${res.message}`, 'success');
    if (statusEl) statusEl.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
  } catch(err) {
    showToast('Save failed: ' + err.message, 'error');
    if (statusEl) statusEl.textContent = 'Save failed';
  }
}

/* ---- Internal Marks ---- */
async function renderInternalMarks(c) {
  await renderMarksPage(c, 'internal', 'Internal Marks', '📝', 50);
}

async function renderFinalMarks(c) {
  await renderMarksPage(c, 'final', 'Final Marks', '📈', 100);
}

async function renderLabMarks(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading…</div>';
  let existing = {};
  try {
    const grouped = await api('/marks/all');
    state.data.students.forEach(s => {
      existing[s.usn] = {
        lab_internal: grouped[s.usn]?.['BCA601']?.lab_internal ?? '',
        lab_external: grouped[s.usn]?.['BCA601']?.lab_external ?? '',
      };
    });
  } catch(e) {}

  c.innerHTML = `
  <div class="section-card">
    <div class="section-header">
      <span class="section-title">💻 Lab Marks</span>
      <div style="display:flex;align-items:center;gap:10px;">
        <label class="inp-label" style="margin:0;">Subject:</label>
        <select class="inp" id="lab-subject" style="width:220px;">
          ${state.data.subjects.filter(s=>s.lab && s.course==='BCA').map(s=>`<option value="${s.code}">${s.code} — ${s.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="section-body">
      <div class="table-wrap">
        <table>
          <thead><tr><th>USN</th><th>Name</th><th>Lab Internal (0–50)</th><th>Lab External (0–50)</th></tr></thead>
          <tbody>
            ${state.data.students.map(s=>`
              <tr>
                <td><strong>${s.usn}</strong></td>
                <td>${s.name}</td>
                <td><input class="marks-input" type="number" min="0" max="50" id="labint-${s.usn}" value="${existing[s.usn]?.lab_internal ?? ''}" placeholder="0–50"></td>
                <td><input class="marks-input" type="number" min="0" max="50" id="labext-${s.usn}" value="${existing[s.usn]?.lab_external ?? ''}" placeholder="0–50"></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <br>
      <button class="btn btn-primary" onclick="saveLabMarks()">💾 Save to MongoDB</button>
      <span id="lab-status" style="margin-left:12px;font-size:0.85rem;color:var(--text2);"></span>
    </div>
  </div>`;
}

/* Generic marks page renderer */
async function renderMarksPage(c, type, title, icon, max) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading…</div>';
  let existing = {};
  try {
    const grouped = await api('/marks/all');
    state.data.students.forEach(s => {
      existing[s.usn] = grouped[s.usn]?.['BCA601']?.[type] ?? '';
    });
  } catch(e) {}

  c.innerHTML = `
  <div class="section-card">
    <div class="section-header">
      <span class="section-title">${icon} ${title}</span>
      <div style="display:flex;align-items:center;gap:10px;">
        <label class="inp-label" style="margin:0;">Subject:</label>
        <select class="inp" id="${type}-subject" style="width:220px;">
          ${state.data.subjects.filter(s=>s.course==='BCA').map(s=>`<option value="${s.code}|${s.name}">${s.code} — ${s.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="section-body">
      <div class="table-wrap">
        <table>
          <thead><tr><th>USN</th><th>Name</th><th>${title} (0–${max})</th></tr></thead>
          <tbody>
            ${state.data.students.map(s=>`
              <tr>
                <td><strong>${s.usn}</strong></td>
                <td>${s.name}</td>
                <td><input class="marks-input" type="number" min="0" max="${max}" id="${type}-${s.usn}" value="${existing[s.usn] ?? ''}" placeholder="0–${max}"></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <br>
      <button class="btn btn-primary" onclick="saveMarks('${type}',${max})">💾 Save to MongoDB</button>
      <span id="${type}-status" style="margin-left:12px;font-size:0.85rem;color:var(--text2);"></span>
    </div>
  </div>`;
}

async function saveMarks(type, max) {
  const subjectEl   = document.getElementById(`${type}-subject`);
  const [subjectCode, subjectName] = subjectEl ? subjectEl.value.split('|') : ['BCA601','Final Year Project'];

  const records = state.data.students.map(s => {
    const el = document.getElementById(`${type}-${s.usn}`);
    return el && el.value !== ''
      ? { usn:s.usn, subject:subjectCode, subjectName, type, marks:Number(el.value), maxMarks:max }
      : null;
  }).filter(Boolean);

  if (records.length === 0) { showToast('No values to save', 'error'); return; }

  const statusEl = document.getElementById(`${type}-status`);
  if (statusEl) statusEl.textContent = 'Saving…';

  try {
    const res = await api('/marks', { method:'POST', body:JSON.stringify(records) });
    showToast(`✅ ${res.message}`, 'success');
    if (statusEl) statusEl.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
  } catch(err) {
    showToast('Save failed: ' + err.message, 'error');
    if (statusEl) statusEl.textContent = 'Save failed';
  }
}

async function saveLabMarks() {
  const subjectEl   = document.getElementById('lab-subject');
  const [subjectCode, subjectName] = subjectEl ? subjectEl.value.split('|') : ['BCA601','Final Year Project'];

  const records = [];
  state.data.students.forEach(s => {
    const intEl = document.getElementById(`labint-${s.usn}`);
    const extEl = document.getElementById(`labext-${s.usn}`);
    if (intEl && intEl.value !== '')
      records.push({ usn:s.usn, subject:subjectCode, subjectName, type:'lab_internal', marks:Number(intEl.value), maxMarks:50 });
    if (extEl && extEl.value !== '')
      records.push({ usn:s.usn, subject:subjectCode, subjectName, type:'lab_external', marks:Number(extEl.value), maxMarks:50 });
  });

  if (records.length === 0) { showToast('No values to save', 'error'); return; }

  const statusEl = document.getElementById('lab-status');
  if (statusEl) statusEl.textContent = 'Saving…';

  try {
    const res = await api('/marks', { method:'POST', body:JSON.stringify(records) });
    showToast(`✅ ${res.message}`, 'success');
    if (statusEl) statusEl.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
  } catch(err) {
    showToast('Save failed: ' + err.message, 'error');
    if (statusEl) statusEl.textContent = 'Save failed';
  }
}

function renderAssignments(c) {
  const assignments = [
    {title:'Java Programming Assignment',subject:'Java',due:'2024-05-20',status:'Pending'},
    {title:'DBMS ER Diagram',            subject:'DBMS',due:'2024-05-25',status:'Pending'},
    {title:'Python Data Analysis',       subject:'Python',due:'2024-05-30',status:'Submitted'},
  ];
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">📋 Assignments</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>Title</th><th>Subject</th><th>Due</th><th>Status</th></tr></thead>
    <tbody>${assignments.map(a=>`<tr><td><strong>${a.title}</strong></td><td>${a.subject}</td><td>${a.due}</td><td><span class="badge ${a.status==='Pending'?'badge-warning':'badge-success'}">${a.status}</span></td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

// =====================================================
// STUDENT MODULES — reads from MongoDB
// =====================================================
async function loadStudentSummary() {
  const data = await api('/student/summary');
  return data; // { attendance: {...}, marks: [...] }
}

function renderStudentProfile(c) {
  const student = state.data.students.find(s => s.usn === state.user.usn) || {};
  const initials = state.user.name.split(' ').map(w=>w[0]).join('').slice(0,2);
  c.innerHTML = `
  <div class="section-card"><div class="section-header"><span class="section-title">👤 My Profile</span></div><div class="section-body">
    <div class="profile-header">
      <div class="profile-avatar">${initials}</div>
      <div class="profile-info">
        <h2>${state.user.name}</h2>
        <p>USN: ${state.user.usn || '—'}</p>
        <p>Email: ${state.user.email}</p>
        <div class="profile-badges"><span class="profile-badge">📚 BCA</span><span class="profile-badge">📅 Semester 6</span></div>
      </div>
    </div>
    ${student.name ? `<div class="form-grid" style="margin-top:20px;">
      <div><div class="inp-label">Phone</div><div class="inp">${student.phone}</div></div>
      <div><div class="inp-label">DOB</div><div class="inp">${student.dob}</div></div>
      <div><div class="inp-label">Gender</div><div class="inp">${student.gender}</div></div>
      <div><div class="inp-label">Admission</div><div class="inp">${student.admission}</div></div>
      <div><div class="inp-label">Parent</div><div class="inp">${student.parent}</div></div>
      <div><div class="inp-label">Parent Phone</div><div class="inp">${student.parent_phone}</div></div>
      <div class="form-col-full"><div class="inp-label">Address</div><div class="inp">${student.address}</div></div>
    </div>` : ''}
  </div></div>`;
}

async function renderMyAttendance(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading from database…</div>';
  try {
    const { attendance } = await loadStudentSummary();
    c.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">📅 My Attendance <span style="font-size:0.75rem;color:var(--success);font-weight:600;">● Live from MongoDB</span></span>
      </div>
      <div class="section-body">
        ${Object.keys(attendance).length === 0
          ? '<div class="empty-state"><div class="empty-icon">📭</div><p>No attendance data yet. Your teacher has not uploaded attendance.</p></div>'
          : Object.entries(attendance).map(([code,pct]) => {
              const subName = state.data.subjects.find(s=>s.code===code)?.name || code;
              return `<div style="margin-bottom:18px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                  <span style="font-weight:600;">${code} — ${subName}</span>
                  <strong style="color:${pct>=75?'var(--success)':pct>=60?'var(--warning)':'var(--danger)'}">${pct}%</strong>
                </div>
                <div class="progress-bar"><div class="progress-fill ${pct>=75?'progress-good':pct>=60?'progress-warn':'progress-bad'}" style="width:${pct}%"></div></div>
                <div style="font-size:0.75rem;color:var(--text2);margin-top:3px;">${pct>=75?'✓ Eligible':'⚠️ Below 75% — shortage'}</div>
              </div>`;
            }).join('')}
      </div>
    </div>`;
  } catch(err) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${err.message}</p><p style="margin-top:8px;font-size:0.8rem;">Make sure the backend server is running.</p></div>`;
  }
}

async function renderMyMarks(c) {
  c.innerHTML = '<div style="text-align:center;padding:40px;">⏳ Loading from database…</div>';
  try {
    const { marks } = await loadStudentSummary();
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
                const grade    = pct>=90?'O':pct>=80?'A+':pct>=70?'A':pct>=60?'B+':pct>=50?'B':'F';
                return `<tr>
                  <td>${m.sub || m.code}</td><td>${m.code}</td>
                  <td>${m.internal ?? '—'}</td><td>${m.final ?? '—'}</td>
                  <td><strong>${total}</strong></td>
                  <td><span class="badge ${grade==='F'?'badge-danger':grade==='B'||grade==='B+'?'badge-warning':'badge-success'}">${grade}</span></td>
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
    const { marks } = await loadStudentSummary();
    const labMarks = marks.filter(m => m.lab_int !== undefined || m.lab_ext !== undefined);
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
              <tbody>${labMarks.map(m=>`<tr>
                <td>${m.sub||m.code}</td><td>${m.code}</td>
                <td>${m.lab_int ?? '—'}</td><td>${m.lab_ext ?? '—'}</td>
                <td><strong>${(m.lab_int??0)+(m.lab_ext??0)}</strong></td>
              </tr>`).join('')}</tbody>
            </table></div>`}
      </div>
    </div>`;
  } catch(err) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

function renderCourseDetails(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">📚 Course Details — BCA</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>Code</th><th>Subject</th><th>Sem</th><th>Credits</th><th>Has Lab</th></tr></thead>
    <tbody>${state.data.subjects.filter(s=>s.course==='BCA').map(sub=>`<tr><td><code>${sub.code}</code></td><td>${sub.name}</td><td>Sem ${sub.sem}</td><td>${sub.credits}</td><td>${sub.lab?'<span class="badge badge-info">Yes</span>':'—'}</td></tr>`).join('')}</tbody>
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
      <p style="margin-top:12px;font-size:0.8rem;color:var(--text2);">Password is updated securely in the database.</p>
    </div>
  </div></div>`;
}

async function doChangePassword() {
  const currentPassword = document.getElementById('cp-current').value;
  const newPassword     = document.getElementById('cp-new').value;
  const confirm         = document.getElementById('cp-confirm').value;
  if (!currentPassword || !newPassword || !confirm) { showToast('Please fill all fields','error'); return; }
  if (newPassword.length < 6) { showToast('New password must be ≥ 6 characters','error'); return; }
  if (newPassword !== confirm) { showToast('Passwords do not match','error'); return; }
  try {
    const res = await api('/change-password', { method:'POST', body:JSON.stringify({ currentPassword, newPassword }) });
    showToast(res.message, 'success');
    ['cp-current','cp-new','cp-confirm'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  } catch(err) {
    showToast(err.message, 'error');
  }
}

// =====================================================
// STAFF MODULES
// =====================================================
function renderEvents(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">🎉 Events & Circulars</span></div><div class="section-body">
    ${state.data.events.map(e=>`<div class="notice-card" style="border-left-color:var(--accent)">
      <div class="notice-title">${e.title}</div><div class="notice-body">${e.desc}</div>
      <div class="notice-meta"><span>📅 ${e.date}</span><span class="badge badge-info">${e.type}</span></div>
    </div>`).join('')}
  </div></div>`;
}

function renderStudentInfo(c) {
  c.innerHTML = `<div class="section-card"><div class="section-header"><span class="section-title">🎓 Student Details</span></div><div class="section-body"><div class="table-wrap"><table>
    <thead><tr><th>USN</th><th>Name</th><th>Course</th><th>Sem</th><th>Phone</th><th>Parent</th><th>Status</th></tr></thead>
    <tbody>${state.data.students.map(s=>`<tr><td><strong>${s.usn}</strong></td><td>${s.name}</td><td>${s.course}</td><td>Sem ${s.semester}</td><td>${s.phone}</td><td>${s.parent}</td><td><span class="badge badge-success">Active</span></td></tr>`).join('')}</tbody>
  </table></div></div></div>`;
}

// =====================================================
// INITIALISATION
// =====================================================
window.addEventListener('load', function() {
  // Restore theme
  const savedTheme = localStorage.getItem('theme');
  const check = document.getElementById('theme-check');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (check) check.checked = true;
  }

  // Auto-login from saved token
  try {
    const token     = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (token && savedUser && savedUser.role) {
      state.token = token;
      state.user  = savedUser;
      state.role  = savedUser.role;
      launchApp();
    }
  } catch(e) {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');
  }
});

// Enter key → login (once, guarded)
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const lp = document.getElementById('login-page');
    if (lp && lp.style.display !== 'none') doLogin();
  }
});