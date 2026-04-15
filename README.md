# 🚨 Police Command Center

An interactive web-based application built using **React.js**, designed to manage emergency response operations for citizens and police departments. This system allows seamless coordination between citizens and law enforcement through modern, responsive dashboards.

---

## 🌐 Overview

The **Police Command Center** provides two main portals:

* **Citizen Dashboard** – Enables users to report emergencies, view alerts, and request help.
* **Police Dashboard** – Allows officers to monitor citizen reports, track live incidents, and manage response priorities.

This project was originally developed using plain HTML, CSS, and JavaScript, and later refactored into a **React-based SPA (Single Page Application)** for better modularity, reusability, and scalability.


## ⚙️ Tech Stack

| Category            | Technologies Used                  |
| ------------------- | ---------------------------------- |
| **Frontend**        | React.js, Vite, TailwindCSS        |
| **Styling**         | Custom CSS (modular per component) |
| **Icons & Fonts**   | Lucide Icons, Google Fonts (Inter) |
| **Build Tool**      | Vite.js                            |
| **Version Control** | Git & GitHub                       |

---

## 🧩 Folder Structure

```
src/
├── components/
│   ├── Landing.jsx
│   ├── CitizenLogin.jsx
│   ├── PoliceLogin.jsx
│   ├── CitizenDashboard.jsx
│   ├── PoliceDashboard.jsx
│   ├── QuickCard.jsx
│   ├── Landing.css
│   ├── CitizenLogin.css
│   ├── PoliceLogin.css
│   ├── CitizenDashboard.css
│   ├── PoliceDashboard.css
│   └── QuickCard.css
├── App.jsx
├── App.css
├── main.jsx
└── index.html
```

Each component has its **own CSS file** for scoped styling, ensuring modularity and easier maintenance.

---

## 🚀 Features

✅ **Citizen Features**

* Report emergencies quickly with one click.
* Track alert status and police response.
* View live notifications and help center info.

✅ **Police Features**

* Manage incident reports in real-time.
* Assign priorities and track case status.
* Secure login for authorized personnel only.

✅ **General Features**

* Fully responsive layout for all devices.
* Modern design using Tailwind and Inter fonts.
* Optimized build setup with Vite.

---

## 🛠️ Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/police-command-center.git
   cd police-command-center
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the app in development mode:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

---

## 📁 Component Details

### 1️⃣ Landing Page

* Displays the system overview.
* Acts as a gateway for citizens and police to log in.

### 2️⃣ Citizen Login

* Secure citizen authentication interface.
* Simple form with validation and quick access icons.

### 3️⃣ Police Login

* Dedicated portal for law enforcement.
* Styled with dark mode UI for focus and contrast.

### 4️⃣ Dashboards

* Dynamic dashboards showing reports, alerts, and user data.
* `QuickCard` component used for modular info cards.

---

## 🎨 UI Design Philosophy

* Inspired by **Indian Tricolor themes**.
* Incorporates **Ashoka Chakra watermark** for national representation.
* Clean, accessible, and mobile-first layout.

---

## 📚 Future Enhancements

* 🔹 Integration with live map APIs for incident tracking.
* 🔹 Notification system with real-time WebSockets.
* 🔹 Database connectivity (MongoDB + Express backend).
* 🔹 Role-based authentication and admin panel.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch for your feature:

   ```bash
   git checkout -b feature-name
   ```
3. Commit and push your changes.
4. Open a Pull Request.


🧑‍💻 Author

**Vaibhav Tyagi**
💼 MCA Student | MERN Stack Developer
📍 India (IST, UTC+5:30)


⭐ Acknowledgments

* Built using **React + Vite** for performance.
* Design inspired by real-world emergency response systems.
* Dedicated to improving public safety through technology.




