# NetCheck Pro

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

> **Professional-grade internet speed testing with premium UX/UI**

NetCheck Pro is a modern, production-ready speed test application that measures ping, jitter, download speed, and upload speed with precision. Built with a focus on performance, privacy, and beautiful design.

![Speed Test Demo](https://via.placeholder.com/800x400/1e293b/38bdf8?text=NetCheck+Pro+Speed+Test)

## ✨ Features

- **Precision Metrics**: Accurate measurements for ping, jitter, download, and upload speeds
- **Real-time Progress**: Visual feedback during each phase of the test
- **Connection Quality Score**: AI-powered rating system with usage recommendations
- **Test History**: Local storage of up to 50 tests with visual analytics
- **Export Options**: Export results to JSON or CSV for further analysis
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode**: Premium dark theme with glassmorphism effects
- **Privacy Focused**: No data sent to external servers, all processing done locally

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/netcheck-pro.git

# Navigate to the project
cd netcheck-pro

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Custom + Radix UI primitives

## 📁 Project Structure

```
netcheck-pro/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes for speed testing
│   │   │   ├── ping/          # Latency measurement endpoint
│   │   │   ├── download/      # Download test endpoint
│   │   │   ├── upload/        # Upload test endpoint
│   │   │   └── server/        # Server info endpoint
│   │   ├── history/           # Test history page
│   │   ├── about/             # About & explanations page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main speed test page
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── speed-test/       # Speed test components
│   │   ├── layout/           # Layout components
│   │   └── history/          # History view components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and helpers
│   ├── store/                # Zustand state management
│   ├── styles/               # Global styles and CSS variables
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.js            # Next.js configuration
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ping` | GET | Latency measurement |
| `/api/download` | GET | Download speed test (configurable size) |
| `/api/upload` | POST | Upload speed test |
| `/api/server` | GET | Server information |

## 📊 Measurement Methodology

### Ping Test
- 8 sequential requests with 200ms intervals
- Outlier trimming (discard highest and lowest)
- Average of remaining samples
- Jitter calculated as average deviation

### Download Test
- 5 iterations with 1MB chunks
- Warm-up request discarded
- Average of valid samples
- Time-based calculation (not cached)

### Upload Test
- 4 iterations with 512KB payloads
- Random data generation to prevent compression
- Time-based calculation

## 🎨 Design System

### Colors
- **Primary**: `#0ea5e9` (Sky Blue)
- **Background**: `#0f172a` (Slate 900)
- **Card**: `#1e293b` (Slate 800)
- **Accent**: `#22d3ee` (Cyan 400)

### Typography
- **Font**: Inter (system fallback)
- **Headings**: Bold with gradient text effect

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
```

## 🔐 Privacy

- All test data is processed locally in your browser
- No personal information is collected or stored
- Results are stored only in your browser's localStorage
- No analytics or tracking scripts

## ⚠️ Technical Limitations

Browser-based speed tests have inherent limitations compared to dedicated applications:

1. **Protocol Overhead**: HTTP adds ~2-5% overhead vs raw socket tests
2. **Browser Throttling**: Some browsers limit background activity
3. **Compression**: Servers may compress responses, affecting results
4. **Caching**: Aggressive caching can skew results (handled with cache-busting)
5. **Network Prioritization**: Some ISPs prioritize certain traffic types

For most use cases, these limitations result in <10% variance from tool-based tests.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">Built with ❤️ using Next.js and TypeScript</p>"# INTERTEST" 
