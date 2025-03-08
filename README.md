# Instagram Clone

This is a full-stack Instagram-like web application built using Vite + React for the frontend and Spring Boot with MySQL for the backend. The app allows users to register, log in, create and manage posts, search for users, follow/unfollow users, and view profiles.

## Tech Stack
- **Frontend:** Vite + React
- **Backend:** Spring Boot
- **Database:** MySQL

## Features
- **User Registration & Authentication**  
  - New users can register an account.
  - Existing users can log in.
- **Posts Management**  
  - Users can create new posts.
  - View all posts from users.
  - Fetch posts of the logged-in user.
  - Delete own posts.
- **User Search & Follow System**  
  - Search for other users by username.
  - Follow/unfollow searched users.
- **Profile Page**  
  - Fetch and display user details.
  - View personal posts.

## Installation & Setup
### Backend (Spring Boot)
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Configure database connection in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/instagram_clone
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```
3. Build and run the backend:
   ```sh
   mvn spring-boot:run
   ```

### Frontend (React + Vite)
1. Navigate to the frontend folder:
   ```sh
   cd frontend/social_media
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- Open the frontend in a browser (typically runs on `http://localhost:5173`).
- Register or log in.
- Create, view, and delete posts.
- Search for users and follow them.
- Access your profile page to see and edit your details.

## Contributions
Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License
This project is open-source and free to use.

