# TrailBlazer

by Team Goofy Goobers:
- Daniel Blatner
- Zen Dignan
- Sebastian Lanz
- Zachary Medailleu
- Gabriel Olafsson

## Our Project

This project was created as a way for users to create and share walking paths, highlighting the individual locations that they find important enough to make up that path. Inspired originally by the Boston Freedom Trail, a path that can be found pre-created on the deployed site, the webapp allows for users to sign up, log in, and create "Paths" made out of individual locations titled "Waypoints."
The project can be found at <https://goober.dignan.dev>.

Each "Waypoint" is given a name, description, and a longitudinal and latitudinal location. The user can interact with the provided map to place these and as they do they create a walkable path. By sharing the URL of their path, they can easily send it to friends or provide it to their own end-users. Those who want to experience a path may enter "Play Mode," in which they are able to traverse  from one location to another, assisted by a button that provides navigational references through the Google Maps website. Users can view the waypoints in a list, or experience them one at a time, and with an alread-generated QR code visible they can quickly share the experience with those around them. This tool provides utility to both path-makers and path-walkers, through an easy to pick up interface, high accessibility as recorded by lightouse reports, and simple UI/UX that allows for significant creative expression.

## Basic Usage Instructions

Usage is relatively simple, and users are encouraged to create their own account using the Sign-In page available.
If creating a new account is not possible, the following username and password can be used to log in:
Dummy Username: ```gompei```
Dummy Password: ```salisbury```

A path can be created by going to the "Create Path" tab in the navbar.
Waypoints can then be added to the map by zooming into the starting location and adding a waypoint by clicking on it.
Further waypoints can be added in the add mode, or edited by either clicking on the waypoint on the map or by editing it in the 
list of waypoints beneath the map.


## Technologies

### Infrastructure
- TypeScript
    - Core to the project, TypeScript acted as both our main language for the project and as a general guiding philosophy.
    - We wanted our code to be type-safe and as secure as possible, and through our use of typescript in both the front and backend, and enforcement of typed payloads being sent between, TypeScript was a great thing for much of our team to use this project to learn.
- MongoDB
    - Although perhaps not the best choice for this project at scale, MongoDB presented a good learning opportunity for much of our team. We used it as our primary database, storing three models, the Path, User, and Waypoint.
    - Each model was implemented and supported throughout our type safe code through Typescript Interfaces and intentional development structure.
    - In the future, or had we do this project again, we would have likely chosen a different database solution, but as MongoDB was something our team did not know beforehand, we chose to learn that as an intentional take-away from this class.
- NodeJS
    - NodeJS was our backend infrastructure solution and was present throughout our backend structure.
    - We used multiple NodeJS packages and middlewares, even writing some of our own to simplify some project and repo-specific aspects of the codebase.
- Webpack
    - Webpack is a time tested and highly extensible bundler. It provided a robust and simple developer server that had extensive documentation and was simple to use.
    - Primary feature that was useful for writing a client-server application was the ability to proxy the `/api` endpoint to another port, akin to NGINX.

### Backend
- Express
    - We used Express as our primary backend framework
    - We were able to leverage Express with NGINX to provide strong performance for the purposes of the application
    - Express also allowed for us to use HTTP and additional middlewares to best support our webapp

### Frontend
- ReactJS
    - React was used as our primary frontend framework
    - ReactJS is an extremely powerful tool we used to generate our frontend, with components and pages developed with it
    - We used additional react addons like React Router, Reactstrap, and React Leaflet to integrate our webapps functionality with styling and clean code design.


## Challenges

1. The largest initial challenge our team faced was in organization and management. Each of our five members were taking at least one major senior-level or extremely time intensive course alongside this one, so from our attempts at scheduling a first meeting we knew it would be challenging to integrate our schedules with each other. We were also working to combine knowledge-sets that, for the most part, were in different places and had different expertise. We were able to overcome some of these major team-based challenges by developing flexible meetings and sprint schedules, take a much more focused approach to completing large tasks with tickets being assigned, and finding every opportunity we could to pair-program and work as a team to develop each of our knowledge-bases to the point of developing production-ready code.

2. The biggest focus of this project, from our team's perspective, was on creating code that we could confidently show off in an interview, or host as code examples on portfolios. Although our project had relatively few major features, the project provided deep complexity in implementation, and significant amounts of learning opportunities for members of our team to take the time to focus on code quality, clarity, and effectiveness. This effort presented us with some major challenges, and led to much higher times associated with code review. We overcame these challenges through team effort in taking every opportunity to learn, and to teach, when it came to our specific expertises. By working entirely from the perspective of creating the best and most maintainable codebase that we could, we produced a project and overcame challenges that we are extremely proud of.

3. In regards to more technical challenges, we made the early decision to write entirely in TypeScript. This was aligned with our goal of quality code by providing us much stronger type safety than JavaScript would be able to provide. Most of our team had never worked with TypeScript before, so by choosing to use it we gave ourselves a much more challenging road to our final project. However, through continuous team support and use of documentation we were able to finalize both a strong base infrastructure and a solid pathway towards features by the end of the project.

4. We chose to use SASS as an addon in styling for this project. It had been used by a member of our team before, and allowed for consistent and easily usable custom styling in addition to the Bootstrap base we chose to use. This challenged both our backend and frontend sides, with it needing to be compiled through our Webpack config, hydrated as a stylesheet through Typescript configs, and finally created in the first place with SCSS files. This was a new technology to most members of the team, and added another layer of learning to the project.

5. In using the Leaflet React module, we created a much more user-friendly and intuitive interface, but this cost significant developer time in identifying and learning about a technology that none of the members of our team had used before. We were definitely challenged by implementing the map as a key piece of UI/UX, but by delegating aspects of the overall feature and ensuring our team across the stack was prepared for it, we were able to bring in the critical "feel" piece of the map into our project.

6. A major challenge on the design side was creating a web page that would both be effective for the creation of user-generated content in the form of paths from a computer, while still being usable on the mobile devices that users would be interacting with while using the web page in "Play Mode." This challenge led to our use of the Bootstrap framework to help us with mobile-first development, and we took significant amounts of time to consider how the mobile user may interact with out tool, guiding our implementation over time of the front-end. By using React and Bootstrap together, we successfully created our project in a way that would be usable on both mobile and desktop interfaces. We used things like breakpoints and minimum sizes through Bootstrap to help us with specifics, like our path pages interface.

7. This project, for our team, consisted almost entirely of technologies that nobody or very few people knew beforehand. This was an intentional challenge we took on, but it did lead to extended periods of teaching, and meetings that consisted of effectively mini lectures on relevant topics in our specific fields. From MongoDB, to TypeScript, to React, our team took on the many challenges of picking up a technology and learning it to the point of being able to create production ready, and interview quality, code.



## Individual Responsibilities

Zen Dignan (Product Owner) - Created the repository architecture, basic express configuration, database configuration, setting coding standards, primary code reviews, configuration and management of deployment, created middlewares, created api routing handlers, wrote backend CRUD operations, implemented custom API interfacing class for typed data handling, handled developer environment and experience issues, and branch safety setup.

Daniel Blatner (Scrum Master) - Developed the page's navbar, and routing systems between forms and pages. Created the signup page, as well as implementing the SASS files and variables to support our customized styling. Added API call methods on the front-end to support some CRUD operations on Paths and Waypoints. Completed accessibility tests through Lighthouse and identified our color scheming for the app. Organized the team's Jira page and scheduled and ran meetings in accordance to the Agile methodologies, fitting planning, scrums, and retros into our tightly packed schedules.

Zachary Medailleu - Developed functionality for editing and deleting waypoints. Worked on the Figma that was used as a basis for the application's design and implemented the application's styling. Did extensive testing to ensure that the application was working properly.

Gabriel Olafsson - Developed the map to display waypoints on the view path page. Worked with Zach to get initial functionality of editing and deleting waypoints. Later added said functionality to the waypoints on the map, with the addition of adding and editing waypoints on click.

Sebastian (Alex) Lanz - Worked on creating brand new paths and implemented the home page information. Created the initial style guide and helped with website styling and formatting. Improved error handling across all of the front end and prepared a detailed Freedom Trail demo to help demonstrate the app.


Demo Video:
https://www.youtube.com/watch?v=p6Jb02QEpyA



## Get Started Developing

### Environment Variables
1. ``PORT``: The port to host the backend on.
2. ``MONGO_URI``: The URI to the MongoDB you would like to utilize.

### Instructions
1. Clone the repository.
2. Run ``npm install``.
3. Start up a MongoDB instance locally. If you want to use a remote instance, set the ``MONGO_URI`` environment variable appropriately.
4. Run ``npm run start:fe``, open a new terminal, and run ``npm run start:be:watch`` there.
5. Navigate to http://localhost:8082/ and enjoy a hot-reloadable backend and frontend.

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
This repository interacts with Express in a unique way, and is structured in a particular way. For more information, review docs available in `docs`.
