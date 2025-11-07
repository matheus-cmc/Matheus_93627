from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sua-chave-secreta-aqui'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///produtos_cadastro.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo do Usuário
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Buscar usuário no banco
    user = User.query.filter_by(username=username).first()
    
    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        session['username'] = user.username
        return jsonify({'success': True, 'message': 'Login realizado com sucesso!'})
    else:
        return jsonify({'success': False, 'message': 'Usuário ou senha inválidos!'})

@app.route('/dashboard')
def dashboard():
    if 'user_id' in session:
        return f"Bem-vindo, {session['username']}!"
    return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# Criar banco e usuário inicial
with app.app_context():
    db.create_all()
    
    # Criar usuário admin se não existir
    if not User.query.filter_by(username='admin').first():
        hashed_password = generate_password_hash('admin123')
        admin_user = User(username='admin', password=hashed_password)
        db.session.add(admin_user)
        db.session.commit()
        print("Usuário admin criado: admin / admin123")

if __name__ == '__main__':
    app.run(debug=True)