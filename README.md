# Bualoi Relief Fund 🌊

A Next.js cryptocurrency charity platform supporting Typhoon Bualoi relief efforts in Vietnam. Built with modern web technologies to provide transparent, blockchain-verified donations.

## 🌟 Features

- **Modern Design**: Beautiful, responsive UI with dark/light theme support
- **Crypto Integration**: Contract address display with copy functionality
- **Live Donations**: Real-time donation tracking with blockchain verification  
- **Admin Dashboard**: Secure admin panel for managing donations and configuration
- **Gallery**: Community-sourced relief effort photos
- **Mobile Optimized**: Fully responsive design for all devices
- **Database**: Prisma ORM with PostgreSQL/SQLite support

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Database**: Prisma ORM, PostgreSQL (via Prisma Accelerate)
- **Authentication**: Custom auth with bcrypt
- **Deployment**: Vercel

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/ahmadiharja/iolaub.git
cd iolaub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy and configure your environment variables
cp .env.example .env
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Environment Variables

Required environment variables:

```env
DATABASE_URL="your_database_connection_string"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 🗄️ Database Schema

The application uses the following main models:
- **User**: Admin authentication
- **Donation**: Transaction records
- **ProjectConfig**: Dynamic configuration (Twitter links, contract addresses, etc.)

## 🔧 Admin Panel

Access the admin panel at `/admin` to:
- View and manage donations
- Configure project settings (Twitter links, contract addresses)
- Manage user accounts

Default admin credentials can be set via environment variables.

## 🎨 Components

Key components include:
- **HeroCarousel**: Image carousel with gradient overlay
- **ContractCard**: ATM-style contract address display
- **Gallery**: Photo gallery with modal view
- **DonationTable**: Modern card-based donation display
- **MarqueeBanner**: Scrolling emergency banner

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

The application is optimized for Vercel deployment with proper configuration files included.

## 📱 Features Overview

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Theme Support**: Automatic dark/light mode with system preference detection
- **Real-time Data**: Live donation feeds and configuration updates
- **Modern UI**: Clean, professional design with smooth animations
- **Accessibility**: Built with accessibility best practices
- **Performance**: Optimized images, fonts, and code splitting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Buy $BUALOI, Save Lives.** 🌊💙
