import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || process.env.ADMIN_EMAIL || 'admin@magnaurafoods.com';
const SMTP_FROM = process.env.SMTP_FROM || COMPANY_EMAIL;
const COMPANY_NAME = process.env.COMPANY_NAME || 'MAGNAURA FOODS';

const mailTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

function renderEmailTable(data) {
  return `<table style="width:100%;border-collapse:collapse;">${Object.entries(data)
    .filter(([key]) => key !== '_id' && key !== '__v')
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:600;">${key}</td><td style="padding:8px;border:1px solid #ddd;">${value ?? ''}</td></tr>`,
    )
    .join('')}</table>`;
}

function renderTextBody(data) {
  return Object.entries(data)
    .filter(([key]) => key !== '_id' && key !== '__v')
    .map(([key, value]) => `${key}: ${value ?? ''}`)
    .join('\n');
}

async function sendEmail(mailOptions) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP is not configured for email delivery');
  }
  return mailTransporter.sendMail({ from: SMTP_FROM, ...mailOptions });
}

function renderFranchiseNotification(application) {
  return `
    <h2>New Franchise Application</h2>
    ${renderEmailTable(application)}
    <p>Received at ${new Date().toLocaleString()}</p>
  `;
}

function renderContactNotification(message) {
  return `
    <h2>New Contact Message</h2>
    ${renderEmailTable(message)}
    <p>Received at ${new Date().toLocaleString()}</p>
  `;
}

function renderAutoReply(payload, type) {
  const friendlyType = type === 'franchise' ? 'franchise inquiry' : 'contact message';
  return `
    <p>Hi ${payload.fullName || 'there'},</p>
    <p>Thank you for your ${friendlyType}. Our team will review your request and get back to you shortly.</p>
    <p>Warm regards,<br/>${COMPANY_NAME}</p>
  `;
}

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_change_me';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const heroSlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    cta: String,
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    mediaUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    logoUrl: String,
    heroImage: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const menuItemSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    price: Number,
    category: String,
    imageUrl: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const franchiseSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobile: String,
    email: { type: String, required: true },
    city: String,
    state: String,
    investmentCapacity: String,
    preferredBrand: String,
    message: String,
    status: { type: String, default: 'New' },
  },
  { timestamps: true },
);

const contactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: String,
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true },
);

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);
const Brand = mongoose.model('Brand', brandSchema);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const FranchiseApplication = mongoose.model('FranchiseApplication', franchiseSchema);
const ContactMessage = mongoose.model('ContactMessage', contactSchema);
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function slugify(value = '') {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@magnaurafoods.com';
  const password = process.env.ADMIN_PASSWORD || 'Magnaura@123';
  const existing = await AdminUser.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await AdminUser.create({ email, passwordHash });
    console.log(`Admin user created: ${email}`);
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'MAGNAURA FOODS API' });
});

app.get('/api/hero', async (req, res) => {
  const slides = await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: -1 });
  res.json(slides);
});

app.get('/api/brands', async (req, res) => {
  const brands = await Brand.find({ active: true }).sort({ createdAt: -1 });
  res.json(brands);
});

app.get('/api/menu', async (req, res) => {
  const query = { active: true };
  if (req.query.brand) query.brand = req.query.brand;
  const menu = await MenuItem.find(query).sort({ brand: 1, category: 1, createdAt: -1 });
  res.json(menu);
});

app.post('/api/franchise', async (req, res) => {
  const created = await FranchiseApplication.create(req.body);
  await sendEmail({
    to: COMPANY_EMAIL,
    subject: `New Franchise Inquiry from ${req.body.fullName || 'Applicant'}`,
    text: renderTextBody(req.body),
    html: renderFranchiseNotification(req.body),
  });
  await sendEmail({
    to: req.body.email,
    subject: 'Thank you for your franchise inquiry',
    text: `Thank you for your interest in ${COMPANY_NAME}. We have received your request and will respond shortly.`,
    html: renderAutoReply(req.body, 'franchise'),
  });
  res.status(201).json(created);
});

app.post('/api/contact', async (req, res) => {
  const created = await ContactMessage.create(req.body);
  await sendEmail({
    to: COMPANY_EMAIL,
    subject: `New Contact Message from ${req.body.fullName || 'Visitor'}`,
    text: renderTextBody(req.body),
    html: renderContactNotification(req.body),
  });
  await sendEmail({
    to: req.body.email,
    subject: 'Thank you for contacting us',
    text: `Thank you for contacting ${COMPANY_NAME}. We have received your message and will get back to you shortly.`,
    html: renderAutoReply(req.body, 'contact'),
  });
  res.status(201).json(created);
});

app.post('/api/auth/login', async (req, res) => {
  const user = await AdminUser.findOne({ email: req.body.email });
  const valid = user && (await bcrypt.compare(req.body.password, user.passwordHash));
  if (!valid) return res.status(401).json({ message: 'Invalid email or password' });
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

app.get('/api/admin/summary', auth, async (req, res) => {
  const [hero, brands, menu, franchise, contact] = await Promise.all([
    HeroSlide.find().sort({ order: 1, createdAt: -1 }),
    Brand.find().sort({ createdAt: -1 }),
    MenuItem.find().sort({ createdAt: -1 }),
    FranchiseApplication.find().sort({ createdAt: -1 }),
    ContactMessage.find().sort({ createdAt: -1 }),
  ]);
  res.json({ hero, brands, menu, franchise, contact });
});

app.post('/api/admin/hero', auth, async (req, res) => {
  const created = await HeroSlide.create({
    ...req.body,
    cta: req.body.cta || 'Explore',
    mediaType: req.body.mediaType || (req.body.mediaUrl?.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image'),
  });
  res.status(201).json(created);
});

app.post('/api/admin/brands', auth, async (req, res) => {
  const created = await Brand.create({ ...req.body, slug: req.body.slug || slugify(req.body.name) });
  res.status(201).json(created);
});

app.post('/api/admin/menu', auth, async (req, res) => {
  const created = await MenuItem.create(req.body);
  res.status(201).json(created);
});

app.delete('/api/admin/:resource/:id', auth, async (req, res) => {
  const models = {
    hero: HeroSlide,
    brands: Brand,
    menu: MenuItem,
    franchise: FranchiseApplication,
    contact: ContactMessage,
  };
  const Model = models[req.params.resource];
  if (!Model) return res.status(404).json({ message: 'Unknown resource' });
  await Model.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

app.post('/api/admin/upload', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  if (!process.env.CLOUDINARY_CLOUD_NAME) return res.status(400).json({ message: 'Cloudinary is not configured' });

  const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'magnaura-foods', resource_type: resourceType },
      (error, uploaded) => (error ? reject(error) : resolve(uploaded)),
    );
    stream.end(req.file.buffer);
  });
  res.status(201).json({ url: result.secure_url, resourceType });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/magnaura_foods')
  .then(async () => {
    await seedAdmin();
    app.listen(PORT, () => console.log(`MAGNAURA FOODS API running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
