# Wanderlust – Full-Stack MVC Web Application (Node.js, Express, MongoDB)
Wanderlust is a full-stack web application inspired by Airbnb, designed for travel enthusiasts to explore, create, and manage travel listings. The project demonstrates real-world backend architecture, MVC design pattern, user authentication, and server-side rendering.

🛠 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB with Mongoose ODM

Frontend: EJS templating engine with EJS-Mate layouts

Authentication: Passport.js (Local Strategy)

Session Management: express-session + connect-flash

Other Libraries: method-override, Joi (for validation), dotenv (for environment management)

⚡ Key Features

User Authentication & Authorization :

Secure signup and login with Passport.js

Session-based authentication with cookies and flash messages

Protected routes for authenticated users

Listings Management :

Full CRUD (Create, Read, Update, Delete) for travel listings

Each listing includes location, description, pricing, and image placeholders

Listings can be updated or deleted only by the owner

Review System :

Users can post, edit, and delete reviews linked to listings

Nested routing (/listings/:id/reviews) ensures proper association

Authorization ensures only review owners can modify content

Server-Side Rendering & Dynamic Views :

EJS templates render dynamic content

Reusable layouts and partials (navbar, footer, flash messages) via EJS-Mate

Responsive frontend with organized CSS and JS

Error Handling & Validation :

Centralized error handling with ExpressError

Async route errors managed with WrapAsync utility

Request validation with Joi prevents invalid or malicious data

Prepared Cloud Integration :

Cloudinary setup included for future image upload support

Ready for production-level media management

Security & Usability :
 
Input sanitization, authentication checks, and route authorization

Flash messages improve user feedback and interface usability

Method override supports PUT and DELETE HTTP methods via forms

Scalable Architecture :

MVC separation makes the project maintainable and extensible

Controllers, models, and routes organized for team collaboration

🔮 Future Improvements 

Integrate Cloudinary for live image uploads.

Add search and filter functionality for listings.

Implement role-based access control (Admin/User).

Enhance UI with responsive design and map integration (Mapbox or Google Maps).

Deploy as a production-ready web application using Heroku or Vercel.
