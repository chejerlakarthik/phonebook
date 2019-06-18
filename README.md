# Phonebook
A simple phonebook app to manage contacts.

To dockerize the app,
``` docker build -t <tag-name> . ```
e.g. ``` docker build -t chejerlakarthik/phonebook . ```

To run the docker container,
``` docker run -e MONGO_USER=<username> -e MONGO_SECRET=<password> -e PORT=<port> -p <port>:<port> <docker-image-tag> ```

e.g. ``` docker run -e PORT=4000 -e MONGO_USER=admin -e MONGO_SECRET=m00nbe@m -p 4000:4000 chejerlakarthik/phonebook ```
