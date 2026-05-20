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

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['admin', 'student', 'teacher', 'staff'],
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  phone: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },

  // =========================
  // STUDENT FIELDS
  // =========================

  usn: {
    type: String,
    default: ''
  },

  course: {
    type: String,
    default: ''
  },

  semester: {
    type: Number,
    default: null
  },

  gender: {
    type: String,
    default: ''
  },

  dob: {
    type: String,
    default: ''
  },

  admissionDate: {
    type: String,
    default: ''
  },

  parentName: {
    type: String,
    default: ''
  },

  parentPhone: {
    type: String,
    default: ''
  },

  address: {
    type: String,
    default: ''
  },

  // =========================
  // TEACHER FIELDS
  // =========================

  department: {
    type: String,
    default: ''
  },

  qualification: {
    type: String,
    default: ''
  },

  experience: {
    type: Number,
    default: null
  },

  subjects: {
    type: [String],
    default: []
  },

  joiningDate: {
    type: String,
    default: ''
  },

  // =========================
  // STAFF FIELDS
  // =========================

  designation: {
    type: String,
    default: ''
  }

}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

/* --- Attendance --- */
const attendanceSchema = new mongoose.Schema({
  usn:        { type: String, required: true },
  subject:    { type: String, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  updatedBy:  { type: String },
}, { timestamps: true });

attendanceSchema.index({ usn: 1, subject: 1 }, { unique: true });
const Attendance = mongoose.model('Attendance', attendanceSchema);

/* --- Marks --- */
const marksSchema = new mongoose.Schema({
  usn:         { type: String, required: true },
  subject:     { type: String, required: true },
  subjectName: { type: String, default: '' },
  type:        { type: String, enum: ['internal', 'final', 'lab_internal', 'lab_external'], required: true },
  marks:       { type: Number, required: true, min: 0 },
  maxMarks:    { type: Number, default: 100 },
  updatedBy:   { type: String },
}, { timestamps: true });

marksSchema.index({ usn: 1, subject: 1, type: 1 }, { unique: true });
const Marks = mongoose.model('Marks', marksSchema);

// =====================================================
// JWT MIDDLEWARE
// =====================================================
async function auth(req, res, next) {

  try {

    const header = req.headers['authorization'];

    if (!header) {
      return res.status(401).json({
        error: 'No token provided'
      });
    }

    const token = header.startsWith('Bearer ')
      ? header.slice(7)
      : header;

    const decoded = jwt.verify(token, JWT_SECRET);

    // IMPORTANT FIX
    const user = await User.findById(decoded.id)
      .select('-password');

    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      });
    }

    req.user = user;

    next();

  } catch (error) {

    console.error('Auth error:', error);

    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. Required role: ${roles.join(' or ')}` });
    }
    next();
  };
}

// =====================================================
// SEED — ONLY ADMIN  (BUG FIX #3)
// Previously seeded 10 students + 1 teacher + 1 staff.
// Now only the admin account is pre-created.
// All other users must be added through the Admin Dashboard.
// =====================================================
async function seedUsers() {
  const adminExists = await User.findOne({ username: 'admin' });
  if (!adminExists) {
    const hash = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'admin',
      password: hash,
      role:     'admin',
      name:     'Super Admin',
      email:    'admin@college.edu',
      usn:      ''
    });
    console.log('  Seeded user: admin (admin)');
  }
  console.log('✅ User seed complete — only admin pre-exists. Add students/teachers/staff via dashboard.');
}

// =====================================================
// ROUTES — AUTH
// =====================================================

// POST /api/login
app.post('/api/login', async (req, res) => {

  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password required'
      });
    }

    const user = await User.findOne({
      username: username.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        error: 'Account disabled'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      token,
      user: {
  _id: user._id,
  username: user.username,
  role: user.role,

  name: user.name,
  email: user.email,
  phone: user.phone,

  usn: user.usn,
  course: user.course,
  semester: user.semester,

  gender: user.gender,
  dob: user.dob,
  admissionDate: user.admissionDate,

  parentName: user.parentName,
  parentPhone: user.parentPhone,

  address: user.address,

  department: user.department,
  qualification: user.qualification,
  experience: user.experience,
  subjects: user.subjects,

  joiningDate: user.joiningDate,
  designation: user.designation,

  status: user.status
}
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// GET /api/me — verify token
app.get('/api/me', auth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/change-password
app.post('/api/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6)
      return res.status(400).json({ error: 'Valid current and new password (min 6 chars) required' });

    const user  = await User.findById(req.user.id);
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

app.get('/api/attendance', auth, async (req, res) => {
  try {
    const { usn } = req.query;
    if (req.user.role === 'student' && usn !== req.user.usn)
      return res.status(403).json({ error: 'Access denied' });

    const query   = usn ? { usn } : {};
    const records = await Attendance.find(query).sort({ usn: 1, subject: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/attendance/all', auth, requireRole('admin', 'teacher'), async (req, res) => {
  try {
    const records = await Attendance.find().sort({ usn: 1, subject: 1 });
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

app.post('/api/attendance', auth, requireRole('admin', 'teacher'), async (req, res) => {
  try {
    const records = req.body;
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
// ROUTES — MARKS
// =====================================================

app.get('/api/marks', auth, async (req, res) => {
  try {
    const { usn, type } = req.query;
    if (req.user.role === 'student' && usn !== req.user.usn)
      return res.status(403).json({ error: 'Access denied' });

    const query = {};
    if (usn)  query.usn  = usn;
    if (type) query.type = type;

    const records = await Marks.find(query).sort({ usn: 1, subject: 1, type: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/marks/all', auth, requireRole('admin', 'teacher'), async (req, res) => {
  try {
    const records = await Marks.find().sort({ usn: 1, subject: 1 });
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

app.post('/api/marks', auth, requireRole('admin', 'teacher'), async (req, res) => {
  try {
    const records    = req.body;
    const validTypes = ['internal', 'final', 'lab_internal', 'lab_external'];

    if (!Array.isArray(records) || records.length === 0)
      return res.status(400).json({ error: 'Array of records required' });

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
// ROUTES — STUDENT SUMMARY
// =====================================================
app.get('/api/student/summary', auth, requireRole('student'), async (req, res) => {
  try {
    const usn = req.user.usn;
    if (!usn) return res.status(400).json({ error: 'No USN on account' });

    const [attRecords, marksRecords] = await Promise.all([
      Attendance.find({ usn }).sort({ subject: 1 }),
      Marks.find({ usn }).sort({ subject: 1, type: 1 }),
    ]);

    const attendance = {};
    attRecords.forEach(r => { attendance[r.subject] = r.percentage; });

    const marksMap = {};
    marksRecords.forEach(r => {
      if (!marksMap[r.subject]) marksMap[r.subject] = { code: r.subject, sub: r.subjectName };
      if (r.type === 'internal')     marksMap[r.subject].internal  = r.marks;
      if (r.type === 'final')        marksMap[r.subject].final     = r.marks;
      if (r.type === 'lab_internal') marksMap[r.subject].lab_int   = r.marks;
      if (r.type === 'lab_external') marksMap[r.subject].lab_ext   = r.marks;
    });

    res.json({ attendance, marks: Object.values(marksMap) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================================================
// ROUTES — USER MANAGEMENT
// =====================================================

// ── BUG FIX #1 & #4: GET /api/users now supports ?role= filter
// Previously returned ALL users regardless of query param.
// Now correctly filters by role and excludes admin from results.
// ── GET /api/users?role=student  →  only students
// ── GET /api/users               →  all non-admin users
app.get('/api/users', auth, requireRole('admin'), async (req, res) => {

  try {

    const { role } = req.query;

    const filter = {
      role: { $ne: 'admin' }
    };

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// ── POST /api/users — Create user
app.post('/api/users', auth, requireRole('admin'), async (req, res) => {
  try {

    const {
      username,
      password,
      role,
      name,
      email,
      phone,
      usn,
      course,
      semester,
      gender,
      dob,
      admissionDate,
      parentName,
      parentPhone,
      address,
      department,
      qualification,
      experience,
      subjects,
      joiningDate,
      designation
    } = req.body;

    if (!username || !password || !role || !name || !email) {
      return res.status(400).json({
        error: 'Please fill all required fields'
      });
    }

    if (!['student', 'teacher', 'staff'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role'
      });
    }

    const existingUser = await User.findOne({
      username: username.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Username already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: username.toLowerCase(),
      password: hashedPassword,
      role,
      name,
      email,
      phone,
      usn,
      course,
      semester,
      gender,
      dob,
      admissionDate,
      parentName,
      parentPhone,
      address,
      department,
      qualification,
      experience,
      subjects: typeof subjects === 'string'
        ? subjects.split(',').map(s => s.trim())
        : [],
      joiningDate,
      designation
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: `${role} created successfully`,
      user
    });

  } catch (error) {

    console.error('Create user error:', error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

app.put('/api/users/:id', auth, requireRole('admin'), async (req, res) => {

  try {

    const updateData = { ...req.body };

    // Hash password if admin changes it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    // Convert subjects string to array
    if (typeof updateData.subjects === 'string') {
      updateData.subjects = updateData.subjects
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }

    // Convert numeric fields
    if (updateData.semester) {
      updateData.semester = Number(updateData.semester);
    }

    if (updateData.experience) {
      updateData.experience = Number(updateData.experience);
    }

    // Prevent admin role editing
    if (updateData.role === 'admin') {
      return res.status(403).json({
        error: 'Cannot assign admin role'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {

    console.error('Update user error:', error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// ── DELETE /api/users/:id — Delete user
app.delete('/api/users/:id', auth, requireRole('admin'), async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        error: 'Admin cannot be deleted'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// ── BUG FIX #2: PATCH /api/users/:id/status — Toggle user status
// This route was MISSING entirely. Frontend called it but got 404.
// Toggles between 'active' and 'inactive'.
app.patch('/api/users/:id/status', auth, requireRole('admin'), async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    user.status = user.status === 'active'
      ? 'inactive'
      : 'active';

    await user.save();

    res.json({
      success: true,
      message: `User ${user.status}`
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', time: new Date().toISOString() })
);

// =====================================================
// START
// =====================================================
mongoose.connection.once('open', async () => {
  await seedUsers();
  app.listen(PORT, () =>
    console.log(`🚀 EduManage server running on http://localhost:${PORT}`)
  );
});