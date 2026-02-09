# Wanderlust – Full-Stack MVC Web Application (Node.js, Express, MongoDB)
Wanderlust is a full-stack web application inspired by Airbnb, designed for travel enthusiasts to explore, create, and manage travel listings. The project demonstrates real-world backend architecture, MVC design pattern, user authentication, and server-side rendering.

🛠 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB with Mongoose ODM

Frontend: EJS templating engine with EJS-Mate layouts

Authentication: Passport.js (Local Strategy)

Session Management: express-session + connect-flash

Other Libraries: method-override, Joi (for validation), dotenv (for environment management)

⚡ Features

User Authentication & Authorization
Secure signup and login using Passport.js, session-based authentication, and flash messages for feedback.

Listings Management
Users can create, read, update, and delete travel listings with details like location, description, and images.

Review System
Logged-in users can post, edit, and delete reviews for listings. Nested routes maintain proper relationships between listings and reviews.

MVC Architecture
Separate models (MongoDB schemas), views (EJS templates), and controllers (business logic) ensure maintainable and scalable code.

Server-Side Rendering & Dynamic Content
EJS templates render dynamic data, and layouts are managed with EJS-Mate for reusability.

Error Handling & Validation
Custom ExpressError class, WrapAsync utility, and Joi schemas validate inputs and manage application errors gracefully.

Prepared Cloud Integration
Cloudinary setup is included for future image upload support, making the project scalable for media handling.

🔮 Future Improvements

Integrate Cloudinary for live image uploads.

Add search and filter functionality for listings.

Implement role-based access control (Admin/User).

Enhance UI with responsive design and map integration (Mapbox or Google Maps).

Deploy as a production-ready web application using Heroku or Vercel.
