import mysql.connector
from contextlib import contextmanager

db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '', # À remplir si vous avez un mot de passe
    'database': 'agrico'
}

@contextmanager
def db_cursor():
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor(dictionary=True)
    try:
        yield cur
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()