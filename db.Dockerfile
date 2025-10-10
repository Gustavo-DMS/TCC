# syntax=docker/dockerfile:1
FROM postgres:17
COPY ./db /docker-entrypoint-initdb.d/
