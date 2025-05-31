import psycopg
from os import environ

from psycopg.rows import dict_row


def manage_sensitive(name):
    var = environ.get(name)
    if environ.get("FLASK_DEBUG") == "1":
        return var

    if var is None:
        raise ValueError(f"Environment variable {name} not set")

    return open(var).read().rstrip("\n")


def fetch_db(sql, values):
    sql_result = ""
    database_url = manage_sensitive("DATABASE_URL")
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    with psycopg.connect(database_url, row_factory=dict_row) as conn:
        with conn.cursor() as cur:
            cur.execute(sql, values)
            sql_result = cur.fetchall()
            conn.commit()
            conn.close()
    return sql_result
