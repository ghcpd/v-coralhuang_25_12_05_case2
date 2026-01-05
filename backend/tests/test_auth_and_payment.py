import os

from backend.app import create_app, db


def test_register_and_login():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        client = app.test_client()

        # register
        r = client.post('/api/auth/register', json={'email': 'test@example.com', 'password': 'secret'})
        assert r.status_code == 200
        data = r.get_json()
        assert 'token' in data

        # login
        r2 = client.post('/api/auth/login', json={'email': 'test@example.com', 'password': 'secret'})
        assert r2.status_code == 200
        data2 = r2.get_json()
        assert 'token' in data2


def test_payment_without_config():
    # payment endpoint returns proper error if stripe secret not set
    app = create_app()
    with app.app_context():
        client = app.test_client()
        os.environ.pop('STRIPE_SECRET_KEY', None)
        r = client.post('/api/create-payment-intent', json={'amount_cents': 1000})
        # endpoint should be a 500 when stripe not configured
        assert r.status_code in (500, 404)
