FROM python:3.11

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip
RUN pip install pipenv

RUN pipenv install --verbose

ENV FLASK_ENV=production
ENV FLASK_APP=main.py

EXPOSE 5000

CMD ["/bin/bash", "-c", "source $(pipenv --venv)/bin/activate && python main.py"]
