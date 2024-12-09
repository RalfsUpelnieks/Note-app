# Note-app

**Note-app** is a versatile note-taking web application designed to help users organize their thoughts and tasks efficiently. The app features intuitive notebooks, note pages, and note blocks that can be customized and rearranged effortlessly.

![Screenshot 2024-12-09 202759](https://github.com/user-attachments/assets/9898297d-d78a-40ff-bb1c-565863f633d1)

---

## Features

- **Notebooks**: Organize your notes into separate notebooks.
- **Note Pages**: Create and manage pages within notebooks.
- **Note Blocks**: Add and edit blocks that support different types and formatting styles.
- **Drag-and-Drop**: Easily rearrange notebooks, pages, and note blocks.
- **Search**: Quickly find specific notes using a powerful search feature.
- **Authentication**: Secure login and user account management.
- **Admin Dashboard**: Includes statistics and user moderation tools.

---

## Installation

You can deploy Note-app in two ways:
1. **Local Installation**
2. **Using Docker**

---

### 1. Local Installation (Windows)

Follow these steps to run the application locally:

1. **Install Required Software**:
   - [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
   - [.NET 7](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
   - [Node.js](https://nodejs.org/en)

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/RalfsUpelnieks/Note-app
   ```

3. **Configure Backend**:
   - Navigate to the `backend` folder in the cloned repository.
   - Update the `appsettings.json` file with the appropriate configurations for your environment.

4. **Run the Backend**:
   - Open a terminal, navigate to the `backend` folder, and run:
     ```bash
     dotnet run
     ```

5. **Run the Frontend**:
   - Open another terminal, navigate to the `frontend` folder, and install the necessary modules:
     ```bash
     npm install
     ```
   - Start the application:
     ```bash
     npm start
     ```

---

### 2. Running with Docker

1. **Install Docker**:
   - Download and install [Docker](https://www.docker.com/products/docker-desktop).

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/RalfsUpelnieks/Note-app
   ```

3. **Configure Docker**:
   - Update the docker-compose file with your desired settings. Use one of the following docker files based on the intended environment
     - **Local development**:
         ```bash
         docker-compose.local.yml
         ```
     - **Production deployment (Nginx)**:
       ```bash
       docker-compose.deployment.yml
       ```

5. **Run the Application**:
     - **Local development**:
       ```bash
       docker compose -f docker-compose.local.yml up
       ```
     - **Production deployment (Nginx)**:
       ```bash
       docker compose -f docker-compose.deployment.yml up
       ```
---

## Repository Structure

- `backend/`: Contains the server-side code built with ASP.NET Core.
- `frontend/`: Contains the client-side code built with React.
- `nginx/`: Web server configuration.

---
