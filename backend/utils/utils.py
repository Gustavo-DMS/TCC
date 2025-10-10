import psycopg
from os import environ

from psycopg.rows import dict_row

from fpdf import FPDF
from barcode import Code128
from barcode.writer import SVGWriter


def manage_sensitive(name):
    var = environ.get(name)
    if environ.get("FLASK_DEBUG") == "1":
        return var

    if var is None:
        raise ValueError(f"Environment variable {name} not set")

    return open(var).read().rstrip("\n")


def fetch_db(sql, values={}):
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


def gerar_pdf_etiquetas(ids):
    # Create a new PDF document
    pdf = FPDF()

    # Set the position and size of the image in the PDF
    x = 0
    y = 0
    w = 573
    h = 191

    # Generate a Code128 Barcode as SVG:
    for i in ids:
        pdf.add_page(format=(573, 191))
        teste = Code128(f'{i["id"]}', writer=SVGWriter()).render()
        pdf.image(teste, x=x, y=y, w=w, h=h)
        pdf.set_font("Arial", size=100)
        pdf.set_y(135)
        pdf.cell(
            w=0,
            text=f"{i['id']}",
            align="C",
        )

        # Output a PDF file:
    return pdf.output()
