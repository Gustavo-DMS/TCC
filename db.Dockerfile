# syntax=docker/dockerfile:1
FROM postgres:latest
COPY ./db /docker-entrypoint-initdb.d/
