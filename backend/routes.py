import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import stripe

from .app import db
from .models import User, Listing, Booking

auth_bp = Blueprint('auth', __name__)
search_bp = Blueprint('search', __name__)
booking_bp = Blueprint('booking', __name__)
payment_bp = Blueprint('payment', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'email exists'}), 400

    user = User(email=email, password_hash=generate_password_hash(password), name=name)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify({'token': token, 'user': user.to_dict()})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'invalid credentials'}), 401

    token = create_access_token(identity=user.id)
    return jsonify({'token': token, 'user': user.to_dict()})

@auth_bp.route('/me')
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'not found'}), 404
    return jsonify({'user': user.to_dict()})


@search_bp.route('/search')
def search():
    q = request.args.get('q', '').lower()
    t = request.args.get('type')

    query = Listing.query.filter_by(available=True)
    if t:
        query = query.filter_by(type=t)
    if q:
        query = query.filter(Listing.title.ilike(f'%{q}%') | Listing.description.ilike(f'%{q}%'))

    results = [l.to_dict() for l in query.limit(50).all()]
    return jsonify({'results': results})


@booking_bp.route('/book', methods=['POST'])
@jwt_required()
def book():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    listing_id = data.get('listing_id')

    listing = Listing.query.get(listing_id)
    if not listing or not listing.available:
        return jsonify({'error': 'listing unavailable'}), 400

    booking = Booking(user_id=user_id, listing_id=listing.id, status='confirmed')
    listing.available = False
    db.session.add(booking)
    db.session.commit()

    return jsonify({'booking': booking.to_dict()})


@payment_bp.route('/create-payment-intent', methods=['POST'])
@jwt_required()
def create_payment_intent():
    data = request.get_json() or {}
    amount_cents = data.get('amount_cents')
    currency = data.get('currency', 'usd')

    stripe_key = os.getenv('STRIPE_SECRET_KEY')
    if not stripe_key:
        return jsonify({'error': 'Stripe not configured'}), 500

    stripe.api_key = stripe_key
    try:
        intent = stripe.PaymentIntent.create(amount=amount_cents, currency=currency)
        return jsonify({'client_secret': intent.client_secret})
    except Exception as e:
        current_app.logger.exception('stripe error')
        return jsonify({'error': str(e)}), 500


@payment_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    if webhook_secret:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        except Exception as e:
            return jsonify({'error': 'invalid webhook'}), 400
    else:
        try:
            event = stripe.Event.construct_from(request.get_json(), stripe.api_key)
        except Exception:
            return jsonify({'error': 'invalid event'}), 400

    # rudimentary handling
    if event['type'] == 'payment_intent.succeeded':
        current_app.logger.info('payment succeeded')

    return jsonify({'status': 'ok'})


def seed_if_needed():
    if Listing.query.count() == 0:
        samples = [
            Listing(title='Coastal California Tour', description='7-day scenic tour', type='tour', price_cents=120000),
            Listing(title='Round-trip NYC-LAX', description='Direct flight', type='flight', price_cents=35000),
            Listing(title='Sea View Boutique Hotel', description='2-night stay', type='hotel', price_cents=22000),
        ]
        for s in samples:
            db.session.add(s)
        db.session.commit()


@search_bp.before_app_first_request
def init_data():
    seed_if_needed()
