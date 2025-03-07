# Trail Blazer

by Team Goofy Goobers:
- Daniel Blatner
- Zen Dignan
- Sebastian Lanz
- Zachary Medailleu
- Gabriel Olafsson

## Get Started Developing

### Environment Variables
1. ``PORT``: The port to host the backend on.
2. ``MONGO_URI``: The URI to the MongoDB you would like to utilize.

### Instructions
1. Clone the repository.
2. Run ``npm install``.
3. Start up a MongoDB instance locally. If you want to use a remote instance, set the ``MONGO_URI`` environment variable appropriately.
4. Run ``npm run start:fe``, open a new terminal, and run ``npm run start:be:watch`` there.
5. Navigate to http://localhost:8082/ and enjoy a hot reloadable backend and frontend.

## Deployment

Current production deployment is on a single EC2 instance with NGINX proxying traffic two ways:
1. ``/api`` calls are directed to the Express application running on port ``8080``.
2. All other traffic is statically served the ``index.html`` file found in ``dist/frontend`` upon building.

### Instructions
1. Clone the repository.
2. Run ``npm install``.
3. Run ``npm run build``.
4. Set your relevant environment variables in ``.env`` as specified before.
5. Run ``npm run start``.

The server will begin at port ``8081``, or whatever your ``PORT`` environment variable is set to, and connect to the MongoDB at ``localhost`` or the URI provided in the ``MONGO_URI`` environment variable.

## Proprietary Documentation
This repository interacts with Express in a unique way, and is structured particularly. For more information, review docs available in `docs`.

## Technologies

### Infrastructure
- TypeScript
- MongoDB
- NodeJS
- Webpack

### Backend
- Express

### Frontend
- ReactJS