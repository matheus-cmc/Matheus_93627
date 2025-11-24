from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_super_segura_aqui_2024'

# Configuração MySQL — sem especificar a porta (usa a padrão: 3306)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/sistema_login'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    products = db.relationship('Product', backref='user', lazy=True, cascade='all, delete-orphan')

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    category = db.Column(db.String(50), default='Geral')
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

print("🔄 Iniciando aplicação...")

try:
    with app.app_context():
        db.create_all()
        print("✅ Tabelas criadas/verificadas com sucesso!")
        
        users_count = User.query.count()
        products_count = Product.query.count()
        print(f"📊 Estatísticas: {users_count} usuários, {products_count} produtos")

except Exception as e:
    print(f"❌ Erro ao criar tabelas: {e}")

@app.after_request
def log_http_status(response):
    method = request.method
    path = request.path
    status = response.status_code
    print(f"[HTTP] {method} {path} → {status}")
    return response

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
            print(f"✅ Usuário cadastrado: {username} (ID: {new_user.id})")
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
    return render_template('dashboard.html', username=session['username'], products=user_products)

@app.route('/add_product/', methods=['POST'])
def add_product():
    if 'loggedin' not in session:
        return jsonify({'success': False, 'message': 'Usuário não logado!'})

    product_name = request.form.get('product_name')
    product_description = request.form.get('product_description')
    product_price = request.form.get('product_price')
    product_quantity = request.form.get('product_quantity', 1)
    product_category = request.form.get('product_category', 'Geral')
    print(f"📦 Tentativa de cadastrar produto: {product_name}")

    if not product_name or not product_price:
        return jsonify({'success': False, 'message': 'Nome e preço são obrigatórios!'})

    try:
        price = float(product_price)
        quantity = int(product_quantity)
        if price <= 0:
            return jsonify({'success': False, 'message': 'Preço deve ser maior que zero!'})
        if quantity <= 0:
            return jsonify({'success': False, 'message': 'Quantidade deve ser maior que zero!'})
    except ValueError:
        return jsonify({'success': False, 'message': 'Preço e quantidade devem ser números válidos!'})

    new_product = Product(
        name=product_name,
        description=product_description,
        price=price,
        quantity=quantity,
        category=product_category,
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

@app.route('/delete_product/<int:product_id>', methods=['POST'])
def delete_product(product_id):
    if 'loggedin' not in session:
        return jsonify({'success': False, 'message': 'Usuário não logado!'})

    product = Product.query.filter_by(id=product_id, user_id=session['userid']).first()
    if product:
        try:
            db.session.delete(product)
            db.session.commit()
            print(f"🗑️ Produto deletado: {product.name}")
            return jsonify({'success': True, 'message': 'Produto excluído com sucesso!'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'message': f'Erro ao excluir produto: {str(e)}'})
    else:
        return jsonify({'success': False, 'message': 'Produto não encontrado!'})

@app.route('/delete_account/', methods=['POST'])
def delete_account():
    if 'loggedin' not in session:
        return jsonify({'success': False, 'message': 'Usuário não logado!'})

    password = request.form.get('password')
    if not password:
        return jsonify({'success': False, 'message': 'Por favor, digite sua senha!'})

    user = User.query.get(session['userid'])
    if user and check_password_hash(user.password, password):
        try:
            # Deleta os produtos do usuário
            for prod in user.products:
                db.session.delete(prod)
            db.session.delete(user)
            db.session.commit()

            session.clear()
            print(f"🗑️ Conta deletada: {user.username}")
            return jsonify({'success': True, 'message': 'Conta deletada com sucesso!'})
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao deletar conta: {e}")
            return jsonify({'success': False, 'message': f'Erro ao deletar conta: {str(e)}'})
    else:
        return jsonify({'success': False, 'message': 'Senha incorreta!'})

@app.route('/logout/')
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    print("\n🚀 Servidor Flask iniciando...")
    print("📍 URLs disponíveis:")
    print("   http://localhost:5000 - Página inicial")
    print("   http://localhost:5000/login - Login")
    print("   http://localhost:5000/register - Cadastro")
    print("   http://localhost:5000/dashboard - Dashboard")
    app.run(debug=True)
