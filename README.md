# Vue.js Application

This is a Vue.js application built with Vue CLI. Below are the instructions to run the application in development mode and deploy it for production.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm are installed. You can download them from [nodejs.org](https://nodejs.org/).
- Vue CLI is installed globally. You can install it using npm:

  ```bash
  npm install -g @vue/cli
  ```

## Running the Application in Development Mode

To run the application in development mode, follow these steps:

1. **Clone the Repository**

   Clone the repository to your local machine using:

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the Project Directory**

   Change into the project directory:

   ```bash
   cd <project-directory>
   ```

3. **Install Dependencies**

   Install the necessary dependencies using npm:

   ```bash
   npm install
   ```

4. **Start the Development Server**

   Start the development server with the following command:

   ```bash
   npm run dev
   ```

   This will start the application on a local server, typically at `http://localhost:5173/`. You can view and interact with the application in your web browser.

## Building and Deploying for Production

To build and deploy the application for production, follow these steps:

1. **Build the Application**

   Build the application for production using:

   ```bash
   npm run build
   ```

   This command will generate a `dist` directory containing the compiled files.

2. **Deploy the Application**

   You can deploy the contents of the `dist` directory to your preferred hosting service. Here are some common options:

   - **Static File Hosting**: Upload the `dist` directory to a static file hosting service like Netlify, Vercel, or GitHub Pages.
   - **Web Server**: Serve the `dist` directory using a web server like Nginx or Apache.
   - **Cloud Services**: Deploy to cloud services like AWS S3, Google Cloud Storage, or Azure Blob Storage.

   Ensure your server is configured to serve the `index.html` file for all routes, especially if you're using Vue Router in history mode.

   OR ise the following command

   ```bash
   npm run deploy
   ```

## Additional Resources

- [Vue.js Documentation](https://vuejs.org/v2/guide/)
- [Vue CLI Documentation](https://cli.vuejs.org/guide/)

