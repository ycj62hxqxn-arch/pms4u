from flask import Blueprint
from services.hunt_service import HuntService

main_bp = Blueprint('main', __name__)

# Example route: export
@main_bp.route('/export', methods=['POST'])
def export():
    # Only delegates to service layer
    return HuntService.export()

def register_routes(app):
    app.register_blueprint(main_bp)
