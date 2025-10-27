import pandas as pd
import re
import unicodedata

# Caminhos dos arquivos
file_principal = r"D:\DESKTOP\TCC\xls_conformidade_site_20250807_115642184.xls"
file_forma_farm = r"D:\DESKTOP\TCC\FORMA_FARMACEUTICA.xlsx"
file_via_adm = r"D:\DESKTOP\TCC\VIA_ADMINISTRACAO.xlsx"

# Leitura do arquivo principal a partir da linha 42 (linha 42 será o header)
df = pd.read_excel(file_principal, engine="xlrd", header=41)

# Seleção apenas das colunas desejadas
colunas = [
    "SUBSTÂNCIA",
    "LABORATÓRIO",
    "REGISTRO",
    "PRODUTO",
    "APRESENTAÇÃO",
    "CLASSE TERAPÊUTICA",
    "TIPO DE PRODUTO (STATUS DO PRODUTO)",
    "PF Sem Impostos",
    "TARJA",
]
df = df[colunas]


# ----------------------------
# Limpeza da coluna APRESENTAÇÃO
# - Remover acentuação
# - Remover espaços duplos
# ----------------------------
def remover_acentos(txt):
    if pd.isna(txt):
        return txt
    nfkd = unicodedata.normalize("NFKD", str(txt))
    return "".join([c for c in nfkd if not unicodedata.combining(c)])


df["APRESENTAÇÃO"] = (
    df["APRESENTAÇÃO"]
    .apply(remover_acentos)
    .str.replace("  ", " ", regex=False)  # tira espaços duplos
)

# ----------------------------
# Leitura dos arquivos auxiliares
# ----------------------------
df_forma = pd.read_excel(file_forma_farm)
df_via = pd.read_excel(file_via_adm)


# Função para encontrar correspondências
def encontrar_matches(texto, lista):
    matches = [
        item
        for item in lista
        if pd.notna(item) and str(item).lower() in str(texto).lower()
    ]
    if not matches:
        return None
    # Ordena do maior para o menor (mais específico primeiro)
    matches = sorted(matches, key=len, reverse=True)
    resultado = []
    while matches:
        atual = matches.pop(0)
        # Se o próximo estiver contido no atual, descarta
        matches = [m for m in matches if m.lower() not in atual.lower()]
        resultado.append(atual)
    return "; ".join(resultado)


# ----------------------------
# Criar colunas FORMA_FARM e VIA_ADM
# ----------------------------
lista_formas = df_forma["ABREVIACAO"].dropna().unique().tolist()
lista_vias = df_via["VIA_ADM"].dropna().unique().tolist()

df["FORMA_FARM"] = df["APRESENTAÇÃO"].apply(
    lambda x: encontrar_matches(x, lista_formas)
)
df["VIA_ADM"] = df["APRESENTAÇÃO"].apply(lambda x: encontrar_matches(x, lista_vias))


# ----------------------------
# Criar colunas QTDE e OBS_QTDE
# ----------------------------
def extrair_qtde_obs(texto):
    if pd.isna(texto):
        return None, None
    if " X " not in texto:
        return None, None

    # Parte após " X "
    parte = texto.split(" X ", 1)[1].strip()

    # Expressão regular: pega o primeiro número (pode ter vírgula ou ponto)
    match = re.match(r"([\d.,]+)(.*)", parte)
    if match:
        qtde_str = match.group(1).strip()
        # Trocar vírgula por ponto e converter para float
        try:
            qtde = float(qtde_str.replace(",", "."))
        except:
            qtde = None
        obs = match.group(2).strip() if match.group(2) else None
        return qtde, obs
    return None, None


df[["QTDE", "OBS_QTDE"]] = df["APRESENTAÇÃO"].apply(
    lambda x: pd.Series(extrair_qtde_obs(x))
)

# Visualizar primeiras linhas do resultado
print(df.head())

# Se quiser salvar o resultado tratado em Excel:
df.to_excel(r"D:\DESKTOP\TCC\medicamentos_tratados.xlsx", index=False)

