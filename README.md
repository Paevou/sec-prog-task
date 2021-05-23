# sec-prog-task
Secure Programming Course Assignment by Paavo Kemppainen

# How to Setup the Project
## .env file
The environment variable file needs to be configure before starting the servers. First create a copy of the .env.example file in /api/database/ and rename it to .env. Here change the fields with 'user' in them to the desired database username, and change the fields with either 'pass' or 'password' to match the desired password.
## Windows operating system
1. Have Desktop Docker installed and running
2. Run start.bat as an Administrator user, which starts the Docker database containers, builds the client react files, and starts the HTTPS server available in https://localhost:9000/.
## Non Windows operating system
1. Docker needs to be installed
2. Run 'docker-compose up' in /api/database
3. Run 'npm build' in /client/
4. Run 'npm start' in /api/
5. The application is available in https://localhost:9000/

Further documenation and structure can be found in the Documentation.pdf.
The presentation can be found in the Presentation.pdf
