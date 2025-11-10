from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sua-chave-secreta-aqui-123'

# 🎯 SQLITE - FUNCIONA 100% SEM MYSQL!
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///produtos_cadastro.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo do Usuário
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Modelo do Produto
class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/criar_login')
def criar_login():
    return render_template('criar_login.html')

@app.route('/produtos')
def produtos():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return render_template('produtos.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        session['user_email'] = user.email
        return jsonify({'success': True, 'message': 'Login realizado!'})
    else:
        return jsonify({'success': False, 'message': 'E-mail ou senha inválidos!'})

@app.route('/criar_usuario', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    
    if password != confirm_password:
        return jsonify({'success': False, 'message': 'Senhas não coincidem!'})
    
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'E-mail já cadastrado!'})
    
    hashed_password = generate_password_hash(password)
    novo_user = User(email=email, password=hashed_password)
    
    db.session.add(novo_user)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Usuário criado com sucesso!'})

@app.route('/cadastrar_produto', methods=['POST'])
def cadastrar_produto():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Não logado!'})
    
    data = request.get_json()
    nome = data.get('nome')
    preco = data.get('preco')
    quantidade = data.get('quantidade')
    
    novo_produto = Produto(nome=nome, preco=preco, quantidade=quantidade)
    db.session.add(novo_produto)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Produto cadastrado!'})

@app.route('/listar_produtos')
def listar_produtos():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Não logado!'})
    
    produtos = Produto.query.all()
    produtos_list = []
    for produto in produtos:
        produtos_list.append({
            'id': produto.id,
            'nome': produto.nome,
            'preco': produto.preco,
            'quantidade': produto.quantidade
        })
    
    return jsonify({'success': True, 'produtos': produtos_list})

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# Criar banco automaticamente
with app.app_context():
    db.create_all()
    print("✅ Banco SQLite criado com sucesso!")
    print("✅ Tabelas: User, Produto")
    print("✅ Sistema funcionando perfeitamente!")

if __name__ == '__main__':
    app.run(debug=True)