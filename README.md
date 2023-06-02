# Capstone General Store - Backend

This is the backend component of the Capstone General Store project, which serves as the server-side implementation for managing products and orders.

## Prerequisites

Before running the backend, make sure you have the following prerequisites installed:

- Node.js (version X.X.X)
- npm (version X.X.X)
- MongoDB (version X.X.X)

## Getting Started

1. Clone the repository:

```shell
git clone https://github.com/alakhiani/capstone-general-store-backend.git
````

2. Install the dependencies:

```shell
npm install
```

3. Set up the environment variables:

Create a `.env` file in the root directory and add the following environment variables:

```
DATABASE_URI=mongodb://localhost:27017/general-store
PORT=8000
```

4. Build the project:

```shell
npm run clean-build
```

5. Start the server:

```shell
npm start
```

6. The backend server will now be running at `http://localhost:8000`.

## Scripts

The following scripts are available for development, building, testing, and load testing:

- `npm run clean`: Remove the build artifacts and test coverage reports.
- `npm run build`: Compile the TypeScript code and generate the build artifacts.
- `npm run clean-build`: Clean the project and build it from scratch.
- `npm start`: Start the backend server.
- `npm run dev`: Run the development server with hot-reloading using `nodemon`.
- `npm test`: Run the unit tests using Jest.
- `npm run test-ci`: Run the unit tests in CI mode.
- `npm run test-debug`: Run the unit tests with debugging enabled.
- `npm run load-test:product`: Run the load test for the product functionality using k6.
- `npm run load-test:order`: Run the load test for the order functionality using k6.

## Contributing

Contributions are welcome! If you find any issues or want to enhance the project, feel free to open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

We would like to acknowledge the following resources and libraries that have been used in the development of this project:

- [cors](https://www.npmjs.com/package/cors) - CORS middleware for Express.
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variable management.
- [express](https://www.npmjs.com/package/express) - Web application framework for Node.js.
- [express-validator](https://www.npmjs.com/package/express-validator) - Middleware for request validation in Express.
- [mongoose](https://www.npmjs.com/package/mongoose) - MongoDB object modeling tool.
- [mongodb](https://www.mongodb.com/) - Fully managed document database service.

Special thanks to the contributors and maintainers of these projects for their valuable contributions.
