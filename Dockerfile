FROM python:3.9.13-alpine

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip
RUN pip install pipenv

RUN pipenv install --verbose

ENV FLASK_ENV=production
ENV FLASK_APP=app.py

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
