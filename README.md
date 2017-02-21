## Deploying Mike's Technical Test Using Docker

This demonstration was tested on Chrome and Firefox browsers.

High level directory structure of repo:
/application - code for Node JS.
/portal - code for React/Redux portal.
/build - scripts and Docker building environment

### Deploying with docker-compose on your local machine

From the repo root directory:
```bash
    > cd ./build
    > docker-compose up
```
* Navigate your browser to: localhost:3000
* API found on localhost:3001

### Data Loading
The API Server container starts loading Census and Consumer Complaints data on start up as long as no data exists.
The web portal to the data can be used while the data loads, but, of course, the displayed tables and chart will display incomplete data.

### Docker Details

Docker compose will bring up three images:

* Mongo DB
    - Docker Image: mongo:3.4.2
    - Docker Container: mongo

* API for Census/Consume Complaints
    - Node JS application connecting to Mongo DB.
    - Docker Image: omb-api:version
    - Docker Container: omb-api
    - Binds to host on port 3001
    
* Portal Server
    - React application providing UI for examining data.
    - Docker Image: omb-portal:version
    - Docker Container: omb-portal
    - Hard wired to connect to API container bound to localhost:3001



=================================================================================

Original directions:

# Ombud Technical Test 2016

## Intro

Hello and thank you for your interest in joining the Ombud team. We believe the best way to evaluate developers is a coding challenge.

For your project, we'd like you to complete as much of the following as you can. We expect this project to take no more than MAX_TIME hours (typically AVG_TIME). Please reach out to us if you get stuck and we'll help get you back on track.

## Project Description

For this project we'd like you to build an application that combines two different datasets and allows the user to answer questions using the combined data set.

* Consumer Complaints Database: http://catalog.data.gov/dataset/consumer-complaint-database#topic=consumer_navigation
* US Census Database: http://www.census.gov/popest/data/datasets.html

Minimum Functionality:

* The server exposes an API to run queries against the imported data.
* The UI allows the user to explore the data and answer these questions:
  - What's the number one product that has the most complaints in the State of New York?
  - How many people were born between 7/1/2014 to 6/30/2015 in each state that Bank of America received a consumer complaint in?
  - What is the fastest growing state that also has the most complaints for payday loans?
* The user can change the parameters of the three questions and view those results

Extended Functionality:

* Data is presented in an interesting visual format (d3, plot.ly, google maps..)
* The user can explore and answer questions beyond the three shown above
* Combine with other datasets to answer more interesting questions
* You tell us!

## Requirements

* The development environment should be containerized using tools included in the standard Docker install. Ideally, we should be able to pull your repository and launch with a single command.
* All source code committed to the repository should be your own work - any external, runtime dependencies are OK
  - References to npm libraries in package.json are OK
  - References to Docker images in docker-compose.yml are OK
* The server should be written in node.js

## Criteria

#### Does it work?

The finished application should compile/run without errors and implement some or all of the functionality described above

#### Code Quality

Your code should be written with a consistent coding style, good organization, etc.

#### Application Design

Your app should have a logical api/data model that makes sense for the given problem and would be easy to extend for future use cases.

#### UI/UX

The UI should look nice and be easy to use. A basic bootstrap app with a good layout is perfectly fine, anything beyond that is a nice extra.

## Evaluation

Let us know when you're finished. We'd like to be able to run this application with a single `docker-compose up` command, but please include any additional instructions for running locally.

We'll review the app and invite you to the office to for a demo and code review session.