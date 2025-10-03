# 🛠️ Project Management Scripts

Script-script ini memudahkan pengelolaan project Bualoi Relief Fund.

## 📋 Available Scripts

### 🛑 Pause Project
```bash
npm run pause [reason]
```
- Menghentikan development server
- Menyimpan status project saat ini
- Membuat backup file penting
- Commit perubahan yang belum di-commit
- Membuat pause marker

**Contoh:**
```bash
npm run pause "Taking a break"
npm run pause "Switching to another project"
```

### ▶️ Resume Project
```bash
npm run resume
```
- Membaca informasi pause
- Menghapus pause marker
- Memeriksa dependencies
- Generate Prisma client
- Menjalankan development server

### 📊 Check Status
```bash
npm run status
# atau
npm run pause-status
```
- Menampilkan status project (paused/active)
- Informasi git status
- Health check project
- Status development server

### 🚀 Quick Start
```bash
npm run quick-start
```
- Setup project dari awal
- Install dependencies jika perlu
- Generate Prisma client
- Cek environment variables
- Jalankan development server

## 📁 File Structure

```
scripts/
├── pause-project.js    # Script untuk pause project
├── resume-project.js   # Script untuk resume project
├── pause-status.js     # Script untuk cek status
├── quick-start.js      # Script untuk quick start
└── README.md          # Dokumentasi ini
```

## 🔧 How It Works

### Pause Process
1. **Stop Server**: Menghentikan development server yang berjalan
2. **Save State**: Menyimpan informasi project saat ini ke `.pause-marker.json`
3. **Backup Files**: Membuat backup file penting ke folder `.backup/`
4. **Git Commit**: Commit perubahan yang belum di-commit
5. **Create Marker**: Membuat file marker untuk identifikasi project paused

### Resume Process
1. **Read Marker**: Membaca informasi dari `.pause-marker.json`
2. **Check Status**: Memeriksa git status dan dependencies
3. **Cleanup**: Menghapus pause marker
4. **Setup**: Install dependencies dan generate Prisma client
5. **Start Server**: Menjalankan development server

### Status Check
1. **Pause Check**: Memeriksa apakah project sedang paused
2. **Server Check**: Memeriksa status development server
3. **Git Check**: Memeriksa git status dan last commit
4. **Health Check**: Memeriksa file-file penting project

## 📝 Pause Marker Format

File `.pause-marker.json` berisi:
```json
{
  "pausedAt": "2025-01-02T10:30:00.000Z",
  "reason": "Manual pause",
  "gitStatus": "M src/app/page.tsx",
  "lastCommit": "abc1234 Fix favicon configuration"
}
```

## 🚨 Important Notes

- **Backup Files**: File backup disimpan di folder `.backup/`
- **Git Safety**: Script akan commit perubahan sebelum pause
- **Environment**: Pastikan `.env` file sudah dikonfigurasi dengan benar
- **Dependencies**: Script akan install dependencies jika diperlukan

## 🔍 Troubleshooting

### Project tidak bisa di-resume
```bash
# Hapus pause marker manual
rm .pause-marker.json

# Atau reset ke commit terakhir
git reset --hard HEAD
```

### Dependencies error
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### Port sudah digunakan
```bash
# Kill process di port 3000
taskkill /f /im node.exe
# atau
npx kill-port 3000
```

## 💡 Tips

1. **Gunakan reason**: Selalu berikan alasan saat pause untuk dokumentasi
2. **Check status**: Gunakan `npm run status` untuk memeriksa kondisi project
3. **Quick start**: Gunakan `npm run quick-start` untuk setup project baru
4. **Backup**: File backup otomatis dibuat di folder `.backup/`

## 🎯 Workflow Example

```bash
# Mulai project
npm run quick-start

# Pause project
npm run pause "Going to lunch"

# Cek status
npm run status

# Resume project
npm run resume
```
