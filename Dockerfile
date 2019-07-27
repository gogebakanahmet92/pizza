FROM ubuntu:18.04

MAINTAINER ahmet "gogebakanahmet92@gmail.com"

RUN apt-get update -y && \
    apt-get install -y python3-pip python3-dev

COPY ./requirements.txt /app/requirements.txt


WORKDIR /app

RUN pip3 install -r requirements.txt

COPY . /app

EXPOSE 8000

WORKDIR /app/flask-backend

ENV DB_URI=sqlite:////app/flask-backend/pizza.sqlite

CMD ["gunicorn", "-b", "0.0.0.0:8000", "main:app"]

