# CS 4550 - Web Development
## Final Project: Stam Movie Club
### Created by Andrew Stam, Summer 1 2019.

Final Project for CS 4550: Web Development at Northeastern University.

Heroku instance (this repository, frontend code): https://andrew-stam-final-project.herokuapp.com/

For my final project, I worked alone to develop a website called Stam Movie Club. This site is meant to be used between friends to help plan what movies to watch and when. This project primarily uses React for the frontend, a Java Spring Boot server for the middle tier, and JPA to communicate with a mySQL database. The project is hosted on two different Heroku instances, both linked below in the Links section.

For my project, there are two user roles: Group Member and Group Leader. 

## Group Member
The Group Member can rate and review movies, as well as add movies to their favorites list. They can be added to movie groups by sharing their unique ID (found on their profile, only own ID is viewable) with a Group Leader. In groups, they can view movie watch items, which detail what movie is going to be watched and when, and can also comment on these items, for example saying where they plan to meet or if they are bringing food. They can check a box to signify if they are attending as well. In addition, users can follow other users to easily access their profiles and see which movies they've favorited, reviews they've left for movies, and who they follow / who is following them. Group Members can also search for movies by using the OMDb API (described below in the Links section), where an initial results section is shown and each movie is linked to their respective details page where movie details and other users' reviews are visible.

## Group Leader
The Group Leader cannot rate and review movies, nor add movies to their favorites list. Instead, they can create movie groups and add Group Members to them by getting their unique ID and adding them to a group. In groups, they can add watch items by visiting a movie's detail page where they are able to set which group is watching that movie and on which day. They can also comment on movie watch items (their comments are shown in Gold text to signify their Leader role). They can also check a box to signify if they are attending, just like Group Members. Group Leaders can still follow other users to easily access their profiles and see which movies they've favorited, reviews they've left for movies, and who they follow / who is following them. Group Leaders can also search for movies by using the OMDb API (described below in the Links section), where an initial results section is shown and each movie is linked to their respective details page where movie details and other users' reviews are visible, but again, Group Leaders are unable to leave reviews of their own or favorite movies as that is not the intent of their role.

## 3rd Party API
Movie search and details is accomplished through use of the OMDb API (http://www.omdbapi.com/), a free RESTful service that retrieves movie information.

## Database Relations
Database tables were created through use of JPA (Java Persistence API) and can be viewed in detail in the repositories directory of the Java server (linked below). There are several One to Many relations, including one user leaving many comments, one user having many favorite movies, or one user leaving many reviews. There are also several Many to Many relations, including many users following many other users, many users being followed by many other users, and groups having many user members / members being part of many groups. These relationships are described in greater detail in the README Google Doc linked below.

## Links
This GitHub repository hosts the frontend React code, and the Java middle tier can be found here: https://github.com/andrewstam/webdev-summer2019-final-project-java-andrew-stam
A README Google Doc can be found here: https://docs.google.com/document/d/1u5cWiC8513Hb1OdUI-gJhkRk_JsMhpYZiMmHmNmuWFk/edit?usp=sharing
Heroku instance (this repository, frontend code): https://andrew-stam-final-project.herokuapp.com/
Heroku instance (other repository, java backend code): https://andrew-stam-final-project-java.herokuapp.com/
Project requirements, outlined by our professor, can be found here: https://docs.google.com/document/d/1De-UdZ8LpJt6tftlCsYcZz-BCyh8Nljz7KYO5DY00_8/edit
