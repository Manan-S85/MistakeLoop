# MistakeLoop

🔄 **Transform Interview Failures into Success Stories**

MistakeLoop is an AI-powered interview intelligence platform that helps professionals turn their interview setbacks into stepping stones for career growth.

## Philosophy

*"Only mistakes can truly improve a person. Every failure teaches us what success cannot."*

## How It Works

**The MistakeLoop Process:**
- **Mistake** - Identify what went wrong
- **Detection** - AI analyzes patterns
- **Feedback** - Get personalized insights
- **Action** - Implement improvements
- **Review** - Track your progress
- **Repeat if unfixed** - Continue the loop until mastery

## Features

- **Pattern Recognition**: AI identifies recurring interview mistakes
- **Progress Tracking**: Monitor improvement over time
- **Personalized Feedback**: Escalating guidance based on persistence
- **Accountability System**: Mark issues resolved to move forward

## 🛠 Tech Stack

- **Frontend**: React.js, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI**: OpenRouter API
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mistakeloop.git
   cd mistakeloop
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../app
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in both `/server` and `/app` directories:
   
   **Server (.env):**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   OPENROUTER_API_KEY=your_openrouter_api_key
   PORT=5000
   ```

4. **Run the application**
   ```bash
   # Start the server
   cd server
   npm start
   
   # In a new terminal, start the client
   cd app
   npm run dev
   ```

## 📁 Project Structure

```
mistakeloop/
├── app/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api/
│   └── package.json
├── server/                 # Node.js backend
│   ├── brain/             # AI logic
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
└── README.md
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## Support

If you find MistakeLoop helpful, please give it a ⭐ on GitHub!

---

**Remember**: Every mistake is a lesson waiting to be learned. Keep looping! 🔄