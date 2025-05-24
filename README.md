##  Server-side Features
-All destination data is served from a structured backend using Express.js and MongoDB.
-Server-side search is implemented to filter destinations by keyword (e.g., name, location).
-Destination data is fetched from the backend using RESTful API endpoints.
- Each destination can be viewed in detail using its unique ID via dynamic routes like `/destinations/:id`.
- When a user selects a destination to book, the booking form is auto-filled with that destination’s information.
- Bookings are stored and displayed based on the authenticated user’s email. Each user only sees their own list.


##  Environment Variables

This project uses environment variables for secure configuration.  
To run the server locally, create a `.env` file in the root directory by following the structure of the provided `.env.example`.

### `.env` file:
```env
PORT=7000
MONGODB_URI=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nb7zkyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
FIREBASE_API_KEY="AIzaSyBMbdkj2ssy9FalAJMO133fHPgMNkf0cT8"
