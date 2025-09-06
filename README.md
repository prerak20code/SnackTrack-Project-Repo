# SnackTrack 🍔📦  

SnackTrack is a **real-time food ordering and tracking system** designed for campuses and small food vendors. It enables **Students** to place/cancel orders and receive live updates, while **Contractors** can manage and update order statuses in real-time.  

---

## ✨ Features  

- 🔹 **Role-based access**:  
  - **Student** → Place/cancel orders, get live status updates.  
  - **Contractor** → Receive instant notifications, update order progress.  
- 🔹 **Real-time communication** using **Socket.IO + Redis**.  
- 🔹 **Order status workflow**: `New → Being Prepared → Ready to Collect → Picked Up`.  
- 🔹 **Notifications** sent to respective users instantly on any order event.  
- 🔹 **Scalable backend** built with Node.js and Redis for event handling.  

---

## 🛠️ Tech Stack  

- **Frontend**: React (if applicable)  
- **Backend**: Node.js, Express  
- **Database**: MongoDB  
- **Real-time**: Socket.IO, Redis  
- **Authentication**: JWT / Sessions (if enabled)  
- **Deployment**: Heroku / Vercel / AWS (to be added)  

---

## ⚡ System Flow  

```mermaid
sequenceDiagram
    participant S as Student
    participant B as Backend (Node.js + Express)
    participant R as Redis
    participant C as Contractor

    S->>B: Place Order
    B->>R: Store order + socket mapping
    B-->>C: Notify Contractor (New Order)

    C->>B: Update Order Status
    B->>R: Fetch student socket
    B-->>S: Notify Student (Status Update)

    S->>B: Cancel Order
    B->>R: Update / remove order
    B-->>C: Notify Contractor (Order Cancelled)
## 📂 Project Structure  

SnackTrack/
│── backend/
│ ├── models/ # MongoDB models (Orders, Users, etc.)
│ ├── routes/ # API routes
│ ├── socket.js # Socket.IO + Redis real-time logic
│ └── server.js # Express server entry
│
│── frontend/ # React app (if applicable)
│
│── README.md

yaml
Copy code

---

## 🚀 Getting Started  

### 1. Clone the repo  
```bash
git clone <your-repo-url>
cd SnackTrack
2. Install dependencies
bash
Copy code
# Backend
cd backend
npm install

# Frontend (if exists)
cd ../frontend
npm install
3. Setup environment variables
Create a .env file in backend/ with:

ini
Copy code
MONGO_URI=<your-mongodb-uri>
REDIS_URL=<your-redis-url>
JWT_SECRET=<your-secret>
PORT=5000
4. Run the project
bash
Copy code
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm start
📸 Screenshots / Demo (Optional)
(Add images or GIFs of ordering and real-time updates)

📌 Roadmap
✅ Student & Contractor real-time notifications

✅ Order status updates

⬜ Authentication & Role-based dashboards

⬜ Payment integration

⬜ Deployment (Cloud hosting + CI/CD)

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m 'Add some feature')

Push to the branch (git push origin feature/your-feature)

Open a Pull Request