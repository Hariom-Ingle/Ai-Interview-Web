 #  PrepAI: Your AI-Powered Interview Preparation Platform

 ## 📽️ Demo

Watch the live demo here: [Click to Watch](https://youtu.be/ZABUpUduTb8)

![Project Demo](/Demo/Demo.gif "Optional: A nice banner for your project")

## Table of Contents

-   [About the Project](#about-the-project)
    -   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Work Flow ](#work-flow)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
    -   [Running the Application](#running-the-application)
-   [API Endpoints](#api-endpoints)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)
-   [Acknowledgments](#acknowledgments)

---

## About the Project

PrepAI is an AI-powered interview preparation platform designed to help candidates practice, evaluate, and improve their performance for job interviews. It offers personalized mock interviews, real-time feedback, and curated question sets tailored to different roles and industries.

 

### Features

* **User Authentication:**
    * User Registration
    * User Login  
    * User Logout
    * Password Reset  
* **Email Verification:**
    * OTP (One-Time Password) based email verification
<!-- * **User Profile Management:**
    * View and update user profile (e.g., name, avatar - if implemented) -->
* **Interview Mode :**
    * AI-generated role-specific interview questions
    * AI-generated general interview preparation questions ( Language Specific);
    * Real-time feedback on answers Using  gemini flash 2.0
    
 

---

## Technologies Used

This project leverages a modern full-stack JavaScript ecosystem.

**Frontend:**

* **React.js:** A JavaScript library for building user interfaces.
* **Vite:** A fast build tool that provides a rapid development environment for modern web projects.
* **Redux Toolkit:** For efficient and predictable state management.
* **React Router DOM:** For declarative routing in the application.
* **Axios:** A promise-based HTTP client for making API requests.

* **Audio-to-Text Integration:** Enables the conversion of spoken language into written text, likely for processing user voice input during interviews.

* **Text-to-Speech Integration:** Facilitates the conversion of written text into spoken words, potentially used for AI responses or interview prompts.
* **React Toastify:** For elegant and customizable notifications.
* **Shadcn/UI:** A collection of reusable components built with Radix UI and Tailwind CSS.
* **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
 

**Backend:**

* **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** A NoSQL database for flexible data storage.
* **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
* **JWT (JSON Web Tokens):** For secure authentication (likely via HTTP-only cookies).
* **Bcrypt.js:** For password hashing.
* **Nodemailer:** For sending emails (e.g., OTP for verification, password reset links).
 

---
## Work Flow 

 ![Work Flow Diagram](/Demo/_-%20visual%20selection%20(1).png "")


---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js:** (LTS version recommended, e.g., v18.x or v20.x)
    * [Download Node.js](https://nodejs.org/)
* **npm** (comes with Node.js) or **Yarn**
* **MongoDB:**
    * [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
    * Alternatively, you can use a cloud-hosted MongoDB service like MongoDB Atlas.
* **Git:**
    * [Download Git](https://git-scm.com/downloads)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Hariom-Ingle/Ai-Interview-Web.git
    cd Ai-Interview-web
    ```

2.  **Install Frontend Dependencies:**

    ```bash
    cd Ai-Interview-web  # Navigate into the frontend directory
    npm install
    # OR yarn install
    ```

3.  **Install Backend Dependencies:**

    ```bash
    cd backend # Navigate into the backend directory (or wherever your backend code is)
    npm install
    # OR yarn install
    ```

### Environment Variables

Both the frontend and backend require environment variables for configuration. Create `.env` files in the respective directories:

**Backend (`server/.env`):**

```env
PORT=[Your_Backend_Port, e.g., 5000]
MONGO_URI=[Your_MongoDB_Connection_String, e.g., mongodb://localhost:27017/your_db_name]
JWT_SECRET=[A_strong_random_secret_string_for_JWT]
JWT_COOKIE_EXPIRE=[Number_of_days_for_cookie_expiration, e.g., 7d]

# Email Service (for Nodemailer - example for Gmail)
EMAIL_SERVICE=[e.g., Gmail]
EMAIL_USERNAME=[Your_Email_Address, e.g., your_app_email@gmail.com]
EMAIL_PASSWORD=[Your_Email_Password_or_App_Password] # IMPORTANT: Use an App Password for Gmail
# For OTP email verification
OTP_LENGTH=[e.g., 6]
OTP_EXPIRATION_MINUTES=[e.g., 10]
```

# Full Stack Web Application Setup

## 📁 Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/your_db_name
JWT_SECRET=your_strong_jwt_secret
JWT_COOKIE_EXPIRE=7d

# Email Service (for Nodemailer - example for Gmail)

EMAIL_SERVICE=Gmail
EMAIL_USERNAME=your_app_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

 
```

## 📁 Frontend (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🔐 Important Security Notes

- Never hardcode sensitive information like `JWT_SECRET` or `EMAIL_PASSWORD` directly in your code. Use `.env` files.
- For email services like Gmail, it's highly recommended to use an **App Password** instead of your primary email password.
  - You can generate one via **Google Account → Security → App passwords**.

---

## 🚀 Running the Application

### Start the Backend Server

```bash
cd server
npm start
# OR
yarn start
```

- The backend server should start at: `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd client
npm run dev
# OR
yarn dev
```

- The frontend app usually opens at: `http://localhost:5173`

---

## 📡 API Endpoints

### 🔑 Authentication

- `POST /api/auth/register` - Register new user  
- `POST /api/auth/login` - Login existing user  
- `POST /api/auth/logout` - Logout and clear cookie  
- `GET /api/auth/user-profile` - Get logged-in user's profile *(Protected)*  
- `POST /api/auth/forgot-password` - Request password reset  
- `PUT /api/auth/reset-password/:resetToken` - Reset password  

### ✉️ Email Verification

- `POST /api/auth/send-verification-otp` - Send OTP *(Protected)*  
- `POST /api/auth/verify-email-otp` - Verify OTP  

### 👥 Users

- `GET /api/users` - Get all users *(Admin only)*  
- `PUT /api/users/update-profile` - Update profile *(Protected)*  

 

---

## 📲 Usage Flow

1. **Register**: Visit `/register` to create a new account.  
2. **Login**: Navigate to `/login` and enter your credentials.  
3. **Email Verification**:  
   - If not verified, an OTP will be sent to your registered email.  
   - Submit the OTP to complete verification.  
4. **Dashboard**: Upon success, you'll be redirected to `/dashboard` or `/`.  
5. **Core Features** (examples):  
   - Create a task via the “Add Task” button.  
   - Browse products by category.  
6. **Logout**: Use the “Sign Out” button to log out.

---

## 📂 Project Structure

```
.
├── client/                      # Frontend (React application)
│   ├── public/                 # Public assets
│   ├── src/
│   │   ├── assets/             # Images, icons, etc.
│   │   ├── components/         # Reusable UI components (Header, Footer, etc.)
│   │   ├── features/           # Redux slices (e.g., auth, tasks)
│   │   │   └── auth/
│   │   │       ├── authAPI.js    # API calls related to authentication
│   │   │       └── authSlice.js  # Redux slice for authentication state
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Application views/pages (Login, Register, Dashboard, VerifyEmail)
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # Entry point for React app
│   │   └── index.css           # Global styles
│   ├── .env                    # Frontend environment variables
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Backend (Node.js/Express application)
│   ├── config/                 # DB connection, JWT config, etc.
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Logic for handling API requests
│   ├── middlewares/            # Express middleware (e.g., authMiddleware.js)
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route files
│   ├── utils/                  # Utility functions (e.g., sendEmail.js)
│   ├── .env                    # Backend environment variables
│   ├── app.js                  # Express app setup
│   ├── server.js               # Entry point
│   ├── package.json
│   └── yarn.lock
│
├── .gitignore
├── README.md
└── package.json                # For monorepo root, if applicable
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag `enhancement`.

Don't forget to give the project a ⭐! Thanks again!

### How to Contribute

```bash
# Fork the project
# Create a feature branch
git checkout -b feature/AmazingFeature

# Commit changes
git commit -m "Add some AmazingFeature"

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## 📄 License

Distributed under the **[MIT License](LICENSE)**. See `LICENSE` for more information.

---

## 📬 Contact

**Hariom Ingle**  
📧 Email: hariomingle2003@gmail.com  
🔗 Project Link: [https://github.com/](https://github.com/your-repo)

---

## 🙏 Acknowledgments

- [Node.js Documentation](https://nodejs.org/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)


