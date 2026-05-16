// =====================================================
// EduManage Pro — Backend Server
// Node.js + Express + MongoDB (Mongoose)
// Handles: Auth, Attendance, Internal/Final/Lab Marks
// =====================================================

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5500;
const JWT_SECRET = process.env.JWT_SECRET || 'edumanage_secret_2024';
const MONGO_URI  = process.env.MONGO_URI  || 'mongodb://127.0.0.1:27017/edumanage';

// =====================================================
// MIDDLEWARE
// =====================================================
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// =====================================================
// MONGODB CONNECTION
// =====================================================
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected:', MONGO_URI))
  .catch(err => { console.error('❌ MongoDB connection failed:', err.message); process.exit(1); });

// =====================================================
// SCHEMAS & MODELS
// =====================================================

/* --- User (Admin / Teacher / Student / Staff) --- */
const userSchema = new mongoose.Schema({
  username:    { type:String, required:true, unique:true, trim:true },
  password:    { type:String, required:true },          // bcrypt hash
  role:        { type:String, enum:['admin','teacher','student','staff'], required:true },
  name:        { type:String, required:true },
  email:       { type:String, required:true },
  usn:         { type:String, default:'' },             // students only
}, { timestamps:true });

const User = mongoose.model('User', userSchema);

/* --- Attendance --- */
// Teacher saves: { usn, subject, percentage }
const attendanceSchema = new mongoose.Schema({
  usn:         { type:String, required:true },
  subject:     { type:String, required:true },
  percentage:  { type:Number, required:true, min:0, max:100 },
  updatedBy:   { type:String },                         // teacher username
}, { timestamps:true });

// Compound unique: one record per student+subject
attendanceSchema.index({ usn:1, subject:1 }, { unique:true });
const Attendance = mongoose.model('Attendance', attendanceSchema);

/* --- Marks (Internal / Final / Lab) --- */
const marksSchema = new mongoose.Schema({
  usn:         { type:String, required:true },
  subject:     { type:String, required:true },
  subjectName: { type:String, default:'' },
  type:        { type:String, enum:['internal','final','lab_internal','lab_external'], required:true },
  marks:       { type:Number, required:true, min:0 },
  maxMarks:    { type:Number, default:100 },
  updatedBy:   { type:String },
}, { timestamps:true });

marksSchema.index({ usn:1, subject:1, type:1 }, { unique:true });
const Marks = mongoose.model('Marks', marksSchema);

// =====================================================
// JWT MIDDLEWARE
// =====================================================
function auth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'No token provided' });

  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Role guard factory
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. Required role: ${roles.join(' or ')}` });
    }
    next();
  };
}

// =====================================================
// SEED DEFAULT USERS  (runs once on startup)
// =====================================================
async function seedUsers() {
  const defaults = [
    { username:'admin',        password:'password123', role:'admin',   name:'Super Admin',       email:'admin@college.edu',        usn:'' },
    { username:'rajesh.kumar', password:'password123', role:'teacher', name:'Dr. Rajesh Kumar',  email:'rajesh.kumar@college.edu', usn:'' },
    { username:'21BCA001',     password:'password123', role:'student', name:'Rahul Sharma',      email:'rahul@student.edu',        usn:'21BCA001' },
    { username:'21BCA002',     password:'password123', role:'student', name:'Priya Reddy',       email:'priya@student.edu',        usn:'21BCA002' },
    { username:'21BCA003',     password:'password123', role:'student', name:'Amit Patel',        email:'amit@student.edu',         usn:'21BCA003' },
    { username:'21BCA004',     password:'password123', role:'student', name:'Sneha Nair',        email:'sneha@student.edu',        usn:'21BCA004' },
    { username:'21BCA005',     password:'password123', role:'student', name:'Vikram Singh',      email:'vikram@student.edu',       usn:'21BCA005' },
    { username:'22BCA001',     password:'password123', role:'student', name:'Divya Menon',       email:'divya@student.edu',        usn:'22BCA001' },
    { username:'22BCA002',     password:'password123', role:'student', name:'Arjun Kumar',       email:'arjun@student.edu',        usn:'22BCA002' },
    { username:'23BCA001',     password:'password123', role:'student', name:'Ananya Joshi',      email:'ananya@student.edu',       usn:'23BCA001' },
    { username:'lakshmi.devi', password:'password123', role:'staff',   name:'Mrs. Lakshmi Devi', email:'lakshmi@college.edu',      usn:'' },
  ];

  for (const u of defaults) {
    const exists = await User.findOne({ username: u.username });
    if (!exists) {
      const hash = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hash });
      console.log(`  Seeded user: ${u.username} (${u.role})`);
    }
  }
  console.log('✅ User seed complete');
}

// =====================================================
// ROUTES — AUTH
// =====================================================

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required' });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ error: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, name: user.name, usn: user.usn },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        username:  user.username,
        name:      user.name,
        role:      user.role,
        email:     user.email,
        usn:       user.usn,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/change-password
app.post('/api/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6)
      return res.status(400).json({ error: 'Valid current and new password (min 6 chars) required' });

    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(401).json({ error: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================================================
// ROUTES — ATTENDANCE
// =====================================================

// GET /api/attendance?usn=21BCA001
// Returns all attendance records for a USN (student view)
app.get('/api/attendance', auth, async (req, res) => {
  try {
    const { usn } = req.query;

    // Students can only see their own
    if (req.user.role === 'student' && usn !== req.user.usn)
      return res.status(403).json({ error: 'Access denied' });

    const query = usn ? { usn } : {};
    const records = await Attendance.find(query).sort({ usn:1, subject:1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/attendance/all
// Admin / Teacher sees all students grouped by USN
app.get('/api/attendance/all', auth, requireRole('admin','teacher'), async (req, res) => {
  try {
    const records = await Attendance.find().sort({ usn:1, subject:1 });

    // Group: { '21BCA001': { 'BCA601': 88, ... }, ... }
    const grouped = {};
    records.forEach(r => {
      if (!grouped[r.usn]) grouped[r.usn] = {};
      grouped[r.usn][r.subject] = r.percentage;
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/attendance  — Teacher saves/updates attendance
// Body: [ { usn, subject, percentage }, ... ]
app.post('/api/attendance', auth, requireRole('admin','teacher'), async (req, res) => {
  try {
    const records = req.body; // array
    if (!Array.isArray(records) || records.length === 0)
      return res.status(400).json({ error: 'Array of records required' });

    const ops = records.map(r => ({
      updateOne: {
        filter: { usn: r.usn, subject: r.subject },
        update: { $set: { percentage: Number(r.percentage), updatedBy: req.user.username } },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(ops);
    res.json({ message: `${records.length} attendance records saved` });
  } catch (err) {
    console.error('Save attendance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================================================
// ROUTES — MARKS  (internal / final / lab)
// =====================================================

// GET /api/marks?usn=21BCA001&type=internal
app.get('/api/marks', auth, async (req, res) => {
  try {
    const { usn, type } = req.query;

    if (req.user.role === 'student' && usn !== req.user.usn)
      return res.status(403).json({ error: 'Access denied' });

    const query = {};
    if (usn)  query.usn  = usn;
    if (type) query.type = type;

    const records = await Marks.find(query).sort({ usn:1, subject:1, type:1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/marks/all  — all marks grouped by USN → subject → type
app.get('/api/marks/all', auth, requireRole('admin','teacher'), async (req, res) => {
  try {
    const records = await Marks.find().sort({ usn:1, subject:1 });

    // Group: { '21BCA001': { 'BCA601': { internal:42, final:78 }, ... } }
    const grouped = {};
    records.forEach(r => {
      if (!grouped[r.usn]) grouped[r.usn] = {};
      if (!grouped[r.usn][r.subject]) grouped[r.usn][r.subject] = { subjectName: r.subjectName };
      grouped[r.usn][r.subject][r.type] = r.marks;
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/marks  — Teacher saves marks
// Body: [ { usn, subject, subjectName, type, marks, maxMarks }, ... ]
app.post('/api/marks', auth, requireRole('admin','teacher'), async (req, res) => {
  try {
    const records = req.body;
    if (!Array.isArray(records) || records.length === 0)
      return res.status(400).json({ error: 'Array of records required' });

    const validTypes = ['internal','final','lab_internal','lab_external'];
    for (const r of records) {
      if (!validTypes.includes(r.type))
        return res.status(400).json({ error: `Invalid type: ${r.type}` });
    }

    const ops = records.map(r => ({
      updateOne: {
        filter: { usn: r.usn, subject: r.subject, type: r.type },
        update: {
          $set: {
            marks:       Number(r.marks),
            maxMarks:    Number(r.maxMarks || 100),
            subjectName: r.subjectName || '',
            updatedBy:   req.user.username,
          }
        },
        upsert: true
      }
    }));

    await Marks.bulkWrite(ops);
    res.json({ message: `${records.length} marks records saved` });
  } catch (err) {
    console.error('Save marks error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================================================
// ROUTES — STUDENT SUMMARY  (student sees all their data)
// GET /api/student/summary
// Returns: { attendance, marks } for the logged-in student
// =====================================================
app.get('/api/student/summary', auth, requireRole('student'), async (req, res) => {
  try {
    const usn = req.user.usn;
    if (!usn) return res.status(400).json({ error: 'No USN on account' });

    const [attRecords, marksRecords] = await Promise.all([
      Attendance.find({ usn }).sort({ subject:1 }),
      Marks.find({ usn }).sort({ subject:1, type:1 }),
    ]);

    // Format attendance: { BCA601: 88, BCA602: 92 }
    const attendance = {};
    attRecords.forEach(r => { attendance[r.subject] = r.percentage; });

    // Format marks: [ { sub, code, internal, final, lab_int, lab_ext } ]
    const marksMap = {};
    marksRecords.forEach(r => {
      if (!marksMap[r.subject]) marksMap[r.subject] = { code: r.subject, sub: r.subjectName };
      if (r.type === 'internal')     marksMap[r.subject].internal    = r.marks;
      if (r.type === 'final')        marksMap[r.subject].final       = r.marks;
      if (r.type === 'lab_internal') marksMap[r.subject].lab_int     = r.marks;
      if (r.type === 'lab_external') marksMap[r.subject].lab_ext     = r.marks;
    });
    const marks = Object.values(marksMap);

    res.json({ attendance, marks });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// =====================================================
// START
// =====================================================
mongoose.connection.once('open', async () => {
  await seedUsers();
  app.listen(PORT, () => console.log(`🚀 EduManage server running on http://localhost:${PORT}`));
});