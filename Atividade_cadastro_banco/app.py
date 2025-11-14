from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy import text
import os

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_super_segura_aqui_2024'

# MySQL Workbench - Porta 3307, Senha: root
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost:3307/sistema_login'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'  # FORÇAR nome da tabela
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    products = db.relationship('Product', backref='user', lazy=True)

class Product(db.Model):
    __tablename__ = 'products'  # FORÇAR nome da tabela
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Note: 'users.id'

print("🔄 Iniciando aplicação...")

# Primeiro, vamos DROPAR as tabelas antigas e criar novas
try:
    with app.app_context():
        # Drop tables antigas
        db.session.execute(text('DROP TABLE IF EXISTS products'))
        db.session.execute(text('DROP TABLE IF EXISTS users'))
        db.session.execute(text('DROP TABLE IF EXISTS product'))
        db.session.execute(text('DROP TABLE IF EXISTS user'))
        db.session.commit()
        
        # Criar novas tabelas
        db.create_all()
        print("✅ Tabelas criadas com nomes corretos!")
        
        # Verificar dados
        users_count = db.session.execute(text("SELECT COUNT(*) FROM users")).scalar()
        products_count = db.session.execute(text("SELECT COUNT(*) FROM products")).scalar()
        print(f"📊 Dados atuais - Usuários: {users_count}, Produtos: {products_count}")
        
except Exception as e:
    print(f"❌ Erro: {e}")

# ... (o resto do código das rotas permanece igual)

@app.route('/')
def index():
    if 'loggedin' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        print(f"🔐 Tentativa de login: {username}")
        
        if not username or not password:
            return jsonify({'success': False, 'message': 'Por favor, preencha todos os campos!'})
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password, password):
            session['loggedin'] = True
            session['userid'] = user.id
            session['username'] = user.username
            print(f"✅ Login bem-sucedido: {username}")
            return jsonify({'success': True, 'message': 'Login realizado com sucesso!'})
        else:
            print(f"❌ Login falhou: {username}")
            return jsonify({'success': False, 'message': 'Usuário ou senha incorretos!'})
    
    return render_template('login.html')

@app.route('/register/', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')
        print(f"📝 Tentativa de cadastro: {username}, {email}")
        
        if not username or not password or not email:
            return jsonify({'success': False, 'message': 'Por favor, preencha todos os campos!'})
        
        if User.query.filter_by(username=username).first():
            return jsonify({'success': False, 'message': 'Usuário já existe!'})
        
        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email já cadastrado!'})
        
        if '@' not in email or '.' not in email:
            return jsonify({'success': False, 'message': 'Email inválido!'})
        
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password=hashed_password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            print(f"✅ Usuário cadastrado: {username}")
            return jsonify({'success': True, 'message': 'Cadastro realizado com sucesso!'})
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao cadastrar: {e}")
            return jsonify({'success': False, 'message': f'Erro no cadastro: {str(e)}'})
        
    return render_template('register.html')

@app.route('/dashboard/')
def dashboard():
    if 'loggedin' not in session:
        return redirect(url_for('login'))
    
    user_products = Product.query.filter_by(user_id=session['userid']).all()
    return render_template('dashboard.html', 
                         username=session['username'], 
                         products=user_products)

@app.route('/add_product/', methods=['POST'])
def add_product():
    if 'loggedin' not in session:
        return jsonify({'success': False, 'message': 'Usuário não logado!'})
    
    if request.method == 'POST':
        product_name = request.form.get('product_name')
        product_description = request.form.get('product_description')
        product_price = request.form.get('product_price')
        print(f"📦 Tentativa de cadastrar produto: {product_name}")
        
        if not product_name or not product_price:
            return jsonify({'success': False, 'message': 'Nome e preço são obrigatórios!'})
        
        try:
            price = float(product_price)
            if price <= 0:
                return jsonify({'success': False, 'message': 'Preço deve ser maior que zero!'})
        except ValueError:
            return jsonify({'success': False, 'message': 'Preço deve ser um número válido!'})
        
        new_product = Product(
            name=product_name,
            description=product_description,
            price=price,
            user_id=session['userid']
        )
        
        try:
            db.session.add(new_product)
            db.session.commit()
            print(f"✅ Produto cadastrado: {product_name}")
            return jsonify({'success': True, 'message': 'Produto cadastrado com sucesso!'})
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao cadastrar produto: {e}")
            return jsonify({'success': False, 'message': f'Erro ao salvar produto: {str(e)}'})

@app.route('/logout/')
def logout():
    session.pop('loggedin', None)
    session.pop('userid', None)
    session.pop('username', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    print("🚀 Servidor iniciando...")
    app.run(debug=True)