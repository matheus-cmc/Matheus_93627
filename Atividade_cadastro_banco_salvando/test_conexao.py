from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from sqlalchemy import text

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost:3307/sistema_login'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Testar conexão
try:
    with app.app_context():
        result = db.session.execute(text('SELECT 1'))
        print("✅ Conexão com MySQL OK!")
        
        # Verificar se as tabelas existem
        tables = db.session.execute(text("SHOW TABLES")).fetchall()
        print("📊 Tabelas encontradas:", tables)
        
        # Verificar dados nas tabelas
        users = db.session.execute(text("SELECT * FROM users")).fetchall()
        print("👥 Usuários:", users)
        
        products = db.session.execute(text("SELECT * FROM products")).fetchall()
        print("📦 Produtos:", products)
        
except Exception as e:
    print(f"❌ Erro: {e}")