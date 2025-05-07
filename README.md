# Personal Finance Tracker API

A powerful and secure **RESTful API** built with the **MERN stack** for managing personal finances. This backend system provides full-featured support for budget tracking, transaction logging, user authentication, goal setting, reporting, and notifications.

---

## 🛠️ Technologies Used

- **MongoDB** – NoSQL database for persistent storage.
- **Express.js** – Framework for building the RESTful API.
- **React** *(Frontend not included in this repo)* – Interface to interact with the backend.
- **Node.js** – Runtime environment for executing JavaScript on the server.
- **JWT (JSON Web Token)** – Authentication and authorization system.
- **Cron Jobs** – For scheduling automated tasks.
- **Nodemailer** – For sending notification emails.
- **Helmet** – Secures HTTP headers to protect against common web vulnerabilities.
- **express-rate-limit** – Middleware to limit repeated requests, prevent brute-force attacks.
- **Jest** – Testing framework used to write and run unit/integration tests.

---

## 📦 Core Features

### 🔐 User Management
- Register and login users securely with **JWT-based authentication**.
- Manage user profiles and roles.

### 💰 Budget Management
- Create and track budgets with categorized spending limits.

### 🔄 Transaction Management
- Log income and expenses.
- Support for **recurring transactions** with automatic reminders:
  - Email sent **2 days before due**
  - Email sent **when overdue**

### 🎯 Goal Management
- Set financial goals with tracking.
- **Email sent upon goal completion** using **Nodemailer** and **cron jobs**.

### 🛎️ Notification Management
- Scheduled **email notifications** for:
  - Goal completion
  - Upcoming and overdue transactions
- Managed via **cron jobs**.

### 📊 Report Management
- Generate summary reports based on custom filters and date ranges.

---

## 🔐 Security Features

- **Helmet** is used to set secure HTTP headers.
- **express-rate-limit** is applied to prevent brute-force and DDoS attacks.
- All sensitive routes are protected via JWT.

---

## 🧪 Testing

The system is tested using **Jest**:

```bash
npm run test

