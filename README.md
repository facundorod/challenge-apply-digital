# Challenge ApplyDigital API RESTful

## Overview

This project contains the API for the ApplyDigital challenge.

## Getting started

You'll need the following installed to run the application successfully:

* Node version: >= 20.11.0
* PNPM version: >= 8.15.1
* Docker and docker-compose

### Installation

```bash
git clone https://github.com/facundorod/challenge-apply-digital
cd challenge-apply-digital
```

2. Create the environment configuration:

- Create a .env file in the root directory using .env.example as a template.

3. Dockerize application using docker-compose:

```bash
docker-compose up -d
```

3. Access the API:

- Open your browser and navigate to the Swagger documentation to explore available endpoints:

```bash
http://localhost:3000/docs
```

### Running tests

1. Run unit test
```bash
docker-compose exec -it api pnpm run test
```

2. Run the integration tests:
```bash
docker-compose exec -it api pnpm run test:e2e
```

3. Run test coverage:

```bash
docker-compose exec -it api pnpm run test:cov
```

## Contributing

The main branch contains the latest stable source code intended for production. All changes and features should be proposed via pull requests and tested through the CI pipeline.

### Continuos Integration
Each pull request triggers automated testing using GitHub Actions to ensure code quality and functionality are maintained. Any failing tests will block the merge.

## Code Structure

This project follows the principles of clean and hexagonal architecture, organizing code into distinct layers with a focus on maintainability, flexibility, and testability. The codebase is structured into three main folders:

#### Domain (src/domain)
This folder encapsulates the entities of the application. It defines the entities and dtos of the application.

#### Infrastructure (src/infrastructure)
The infrastructure folder contains the implementations of external interfaces defined in the domain layer. This layer serves as the bridge between the domain and external frameworks or services. Despite being the entry point for external communication, the code within this layer does not dictate the choice of frameworks or external dependencies, maintaining flexibility and allowing for easy adaptation to changes.

#### Usecases (src/usecases)
The usecases folder represents the application-specific use cases and orchestrators. It defines the use cases, entities, and business rules, serving as the heart of the application. Each use case is implemented through interfaces defined in the domain layer, ensuring loose coupling and easy replacement of components.
* Note: The job to fetching products will be executed every hour. It's defined in src/infrastructure/jobs/fetchData.job.ts 

### Key principles

- Clean architecture: The project embraces the clean architecture principles, separating concerns and providing a clear and scalable structure for development.
- Dependency Inversion: Dependencies are inverted to ensure that high-level modules (domain and usecases) do not depend on low-level modules (infrastructure). Instead, both depend on abstractions.
- Framework Independence: The codebase is designed to be framework-agnostic, allowing for the adoption of different frameworks or libraries without affecting the core business logic.
- Testability: The clean separation of concerns facilitates easy unit testing of business logic and use cases without the need for external dependencies.
  
This structure ensures that the application remains modular, maintainable, and adaptable to future changes or technology choices. Developers can focus on implementing business logic without being tied to specific frameworks or external dependencies.
