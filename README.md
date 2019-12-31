# Todo-App
Full stack todo application. Includes microservices and JWT authentication.

## Frameworks
- NestJS, back end framework; similar to express.
- NextJS, front end framework; similart to ReactJS, but NextJS is server side rendered.

## Usage
To start up the entire application, run `docker-compose up`, the commend will start the following:
- MongoDB used for Authentication
- MongoDB used for Todo Data
- Redis used for Temporal Data Storage
- Authentication Microservice
- Todo Microservice
- API Gateway that commmunicates with other microservices
- NextJS SSR React application

## Key takeaways
1. Microservice architecture complicates simple application. This project is simply for demonstration.
2. NextJS makes a few things more difficult compared with ReactJS, such as importing CSS.
3. Nginx by default drops header with "_"
4. When sending post request with user's password, client side should encrypt it before transmitting.
