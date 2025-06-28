# 🌐 SocialVerse

**SocialVerse** is a decentralized, blockchain-based social media platform built on the **Internet Computer Protocol (ICP)**. It empowers users with full data ownership, privacy, censorship resistance, and transparent governance — redefining how we interact online.

---

## 🚀 Features

* Fully on-chain backend with Motoko/Rust canisters
* Modern React.js frontend with Vite + SCSS
* Secure Internet Identity-based login
* User profiles, post creation, content feed
* Decentralized hosting and censorship resistance

---

## 🏗️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind / SCSS
* **Backend:** ICP Canisters using Motoko or Rust
* **Auth:** Internet Identity
* **Dev Tools:** DFX SDK, npm, Cargo, Git

---

## 📁 Folder Structure

```
SocialVerse/
├── README.md
├── dfx.json
├── Cargo.toml
├── package.json
├── tsconfig.json
├── src/
│   ├── socialverse_backend/        # Rust/Motoko canister
│   │   └── src/lib.rs
│   └── socialverse_frontend/       # React frontend
│       ├── index.html
│       └── src/
│           ├── App.jsx
│           ├── main.jsx
│           ├── components/
│           └── pages/
```

---

## 🛠️ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/)
* [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/sdk-guide/install/)
* [Rust](https://www.rust-lang.org/tools/install)

---

### Setup Instructions

```bash
# Clone the repo
git clone https://github.com/ashishjha0125/SocialVerse.git
cd SocialVerse

# Install frontend dependencies
cd src/socialverse_frontend
npm install

# Start DFX local replica
dfx start --background

# Deploy canisters
dfx deploy

# Start frontend dev server
npm run dev
```

---

## ✨ Future Enhancements

* Token-based rewards and moderation
* DAO-based governance
* Blockchain chat system
* Mobile UI improvements

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

```bash
git fork https://github.com/ashishjha0125/SocialVerse.git
cd SocialVerse
git checkout -b feature/your-feature
```

Push and open a pull request 🚀

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgements

* DFINITY Foundation
* Internet Computer Developer Community
* All open-source contributors

---

> Built with 💻 Love| 2025 | SocialVerse
