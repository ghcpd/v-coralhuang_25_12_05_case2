import os
import tempfile

from backend.app import create_app, db


def test_health(tmp_path):
    app = create_app()
    client = app.test_client()
    res = client.get('/health')
    assert res.status_code == 200


def test_search_seed(tmp_path):
    # quick smoke test that the seeder populates listings
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        # call endpoint which triggers seeding
        client = app.test_client()
        r = client.get('/api/search')
        assert r.status_code == 200
        data = r.get_json()
        assert 'results' in data
