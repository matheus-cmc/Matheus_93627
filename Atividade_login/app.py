from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sua-chave-secreta-aqui-123'

print("=" * 50)
print("🆕 SISTEMA COM PRODUTOS POR USUÁRIO - MYSQL 3307")
print("=" * 50)

# 🎯 MYSQL - PORTA 3307
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost:3307/produtos_cadastro'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    produtos = db.relationship('Produto', backref='usuario', lazy=True)

class Produto(db.Model):
    __tablename__ = 'produto'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # 🔥 NOVO

# Rotas principais
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

# Autenticação
@app.route('/login', methods=['POST'])
def login():
    try:
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
    except Exception as e:
        print(f"❌ Erro no login: {e}")
        return jsonify({'success': False, 'message': 'Erro no servidor!'})

@app.route('/criar_usuario', methods=['POST'])
def criar_usuario():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        
        if password != confirm_password:
            return jsonify({'success': False, 'message': 'Senhas não coincidem!'})
        
        if len(password) < 6:
            return jsonify({'success': False, 'message': 'Senha deve ter pelo menos 6 caracteres!'})
        
        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'E-mail já cadastrado!'})
        
        hashed_password = generate_password_hash(password)
        novo_user = User(email=email, password=hashed_password)
        
        db.session.add(novo_user)
        db.session.commit()
        
        print(f"✅ USUÁRIO SALVO NO MYSQL: {email}")
        return jsonify({'success': True, 'message': 'Usuário criado com sucesso!'})
    except Exception as e:
        print(f"❌ Erro ao criar usuário: {e}")
        return jsonify({'success': False, 'message': f'Erro ao criar usuário: {str(e)}'})

# Produtos
@app.route('/cadastrar_produto', methods=['POST'])
def cadastrar_produto():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Não logado!'})
    
    try:
        data = request.get_json()
        nome = data.get('nome')
        preco = data.get('preco')
        quantidade = data.get('quantidade')
        
        if not nome or not preco or not quantidade:
            return jsonify({'success': False, 'message': 'Preencha todos os campos!'})
        
        if preco <= 0 or quantidade < 0:
            return jsonify({'success': False, 'message': 'Preço e quantidade devem ser valores válidos!'})
        
        # 🔥 MUDANÇA: Salvar com ID do usuário logado
        novo_produto = Produto(
            nome=nome, 
            preco=preco, 
            quantidade=quantidade,
            user_id=session['user_id']  # 🔥 VINCULA AO USUÁRIO
        )
        
        db.session.add(novo_produto)
        db.session.commit()
        
        print(f"✅ PRODUTO SALVO NO MYSQL: {nome} - Usuário: {session['user_email']} (ID: {session['user_id']})")
        return jsonify({'success': True, 'message': 'Produto cadastrado!'})
    except Exception as e:
        print(f"❌ Erro ao cadastrar produto: {e}")
        return jsonify({'success': False, 'message': f'Erro ao cadastrar produto: {str(e)}'})

@app.route('/listar_produtos')
def listar_produtos():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Não logado!'})
    
    try:
        # 🔥 MUDANÇA: Filtrar apenas produtos do usuário logado
        produtos = Produto.query.filter_by(user_id=session['user_id']).all()
        
        produtos_list = []
        for produto in produtos:
            produtos_list.append({
                'id': produto.id,
                'nome': produto.nome,
                'preco': produto.preco,
                'quantidade': produto.quantidade
            })
        
        print(f"📦 Listando {len(produtos_list)} produtos para usuário: {session['user_email']}")
        return jsonify({'success': True, 'produtos': produtos_list})
    except Exception as e:
        print(f"❌ Erro ao listar produtos: {e}")
        return jsonify({'success': False, 'message': f'Erro ao listar produtos: {str(e)}'})

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/teste_db')
def teste_db():
    """Teste de conexão com o banco"""
    try:
        user_count = User.query.count()
        produto_count = Produto.query.count()
        
        return jsonify({
            'success': True, 
            'message': f'Conexão OK! Usuários: {user_count}, Produtos: {produto_count}',
            'users': user_count,
            'products': produto_count
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro DB: {str(e)}'})

@app.route('/teste_completo')
def teste_completo():
    """Teste completo do sistema"""
    try:
        # Verificar se já existe usuário teste
        user_existente = User.query.filter_by(email='teste@teste.com').first()
        if not user_existente:
            hashed_password = generate_password_hash('123456')
            user_teste = User(email='teste@teste.com', password=hashed_password)
            db.session.add(user_teste)
            db.session.commit()
            user_existente = user_teste
        
        # Criar produto teste se não existir (vinculado ao usuário teste)
        produto_existente = Produto.query.filter_by(nome='Produto Teste', user_id=user_existente.id).first()
        if not produto_existente:
            produto_teste = Produto(
                nome='Produto Teste', 
                preco=29.90, 
                quantidade=10,
                user_id=user_existente.id  # 🔥 VINCULADO AO USUÁRIO
            )
            db.session.add(produto_teste)
            db.session.commit()
        
        # Verificar no MySQL
        users = User.query.all()
        produtos = Produto.query.all()
        
        return f"""
        <h1>✅ SISTEMA FUNCIONANDO - PRODUTOS POR USUÁRIO!</h1>
        <h3>Usuários no MySQL: {len(users)}</h3>
        <ul>
            {"".join(f'<li>{u.id} - {u.email}</li>' for u in users)}
        </ul>
        
        <h3>Produtos no MySQL: {len(produtos)}</h3>
        <ul>
            {"".join(f'<li>{p.id} - {p.nome} - R$ {p.preco} - Qtd: {p.quantidade} - Usuário ID: {p.user_id}</li>' for p in produtos)}
        </ul>
        
        <p><strong>Verifique no MySQL Workbench:</strong></p>
        <code>SELECT p.id, p.nome, p.preco, p.quantidade, u.email FROM produto p JOIN user u ON p.user_id = u.id;</code>
        
        <p><a href="/">Voltar para Login</a></p>
        """
    except Exception as e:
        return f"<h1>❌ ERRO: {e}</h1>"

# Inicializar
with app.app_context():
    try:
        db.create_all()
        print("🎉 SISTEMA PRONTO - PRODUTOS SEPARADOS POR USUÁRIO!")
        print("🌐 Acesse: http://127.0.0.1:5000")
        print("🧪 Teste completo: http://127.0.0.1:5000/teste_completo")
        print("🔍 Teste DB: http://127.0.0.1:5000/teste_db")
    except Exception as e:
        print(f"❌ ERRO AO INICIAR: {e}")

if __name__ == '__main__':
    app.run(debug=True)