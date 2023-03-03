FROM python:3.11

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt


ENV FLASK_ENV=production
ENV FLASK_APP=main.py

EXPOSE 5000

CMD ["python", "main.py"]
