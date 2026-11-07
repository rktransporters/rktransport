from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_password_hash
from app.models import (
    About,
    CarMake,
    CarModel,
    Faq,
    HeroBanner,
    Location,
    PageCopy,
    Route,
    Service,
    SiteSettings,
    User,
    Vehicle,
    VehicleType,
)


PAGE_COPY = {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "home.hero.title": "Car transport between Dubai and Abu Dhabi",
    "home.hero.description": "Reliable vehicle transport between Dubai and Abu Dhabi.",
    "packages_banner_url": "",
    "carfeatures_banner_url": "",
    "why_banner_url": "",
    "faq_banner_url": "",
    "home.services.eyebrow": "How we help",
    "home.services.heading": "Transport support, when you need it",
    "home.services.link": "Explore services",
    "home.services.details": "Service details",
    "home.promise.route.title": "Dubai ⇄ Abu Dhabi",
    "home.promise.route.description": "Two-way vehicle transport between the Emirates.",
    "home.faqs.eyebrow": "Answers",
    "home.faqs.heading": "Frequently asked questions",
    "services.heading": "Transport and vehicle services",
    "services.details": "Learn more",
    "services.detail.cta": "Request this service",
    "contact.heading": "Contact RK Transport",
    "contact.subheading": "Available 24/7 for car transport across the UAE.",
    "empty.services": "Services will appear here once published.",
    "home.about.eyebrow": "About us",
    "home.about.link": "More about RK Transport",
    "home.testimonials.eyebrow": "Customer feedback",
    "home.testimonials.heading": "Trusted to move what matters",
    "home.routes.eyebrow": "Core corridor",
    "home.routes.heading": "Indexable routes and services",
    "seo.home.title": "RK Transport | Dubai ⇄ Abu Dhabi Car Transport",
    "seo.home.description": "24/7 car transportation in the UAE. Core route Dubai ⇄ Abu Dhabi.",
    "seo.about.title": "About RK Transport | UAE Car Transport",
    "seo.about.description": "RK Transport moves cars between Dubai and Abu Dhabi.",
    "seo.services.title": "Car Transport Services | RK Transport",
    "seo.services.description": "Vehicle transport on the Dubai–Abu Dhabi corridor, available 24/7.",
    "seo.contact.title": "Contact RK Transport | 24/7 UAE Vehicle Support",
    "seo.contact.description": "Call or message RK Transport for car transport anywhere we operate.",
    "seo.dubai-to-abu-dhabi.title": "Dubai to Abu Dhabi Car Transport | RK Transport",
    "seo.dubai-to-abu-dhabi.description": "Door-to-door car transport from Dubai to Abu Dhabi, 24/7. Enclosed and open options for private and commercial vehicles.",
    "seo.abu-dhabi-to-dubai.title": "Abu Dhabi to Dubai Car Transport | RK Transport",
    "seo.abu-dhabi-to-dubai.description": "Car transport from Abu Dhabi to Dubai around the clock. Share pickup details and we confirm a same-day window.",
    "landing.dubai-to-abu-dhabi.h1": "Dubai to Abu Dhabi car transport",
    "landing.dubai-to-abu-dhabi.intro": "RK Transport runs a dedicated Dubai → Abu Dhabi corridor for private cars, SUVs, and light commercial vehicles. Share your pickup area and drop-off address and we confirm a collection window the same day — including overnight moves.",
    "landing.dubai-to-abu-dhabi.body": "This route is set up for one-way deliveries into Abu Dhabi: apartments, compounds, dealerships, and yards. We coordinate building access, basement height limits, and handover photos so the vehicle arrives in the condition it left Dubai. If you also need a return trip, contact us to discuss the arrangements.",
    "landing.abu-dhabi-to-dubai.h1": "Abu Dhabi to Dubai car transport",
    "landing.abu-dhabi-to-dubai.intro": "Moving a vehicle from Abu Dhabi into Dubai — including Dubai Marina, Downtown, Business Bay, and the northern emirates handover points we serve from the city — is a core RK Transport route, not a detour.",
    "landing.abu-dhabi-to-dubai.body": "We collect from Abu Dhabi islands, Khalifa City, Mussafah, and surrounding areas, then run a scheduled Dubai drop. Use this page if Dubai is the destination; use the Dubai to Abu Dhabi page if you are sending a car the other way.",
}


def seed_defaults(db: Session) -> None:
    if not db.query(User).filter(User.username == settings.ADMIN_USERNAME).first():
        db.add(
            User(
                username=settings.ADMIN_USERNAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                is_admin=True,
                is_active=True,
            )
        )

    current_settings = db.query(SiteSettings).filter(SiteSettings.id == 1).first()
    if not current_settings:
        db.add(
            SiteSettings(
                id=1,
                brand_name="RK Transport",
                tagline="Car transport across the UAE",
                phone_primary=None,
                whatsapp=None,
                email=None,
                address_line=None,
                city=None,
                emirate=None,
                country="United Arab Emirates",
                available_24_7=True,
                hours_label="Available 24/7",
                timezone="Asia/Dubai",
                currency_code="AED",
                currency_symbol="AED",
                core_route_label="Dubai ⇄ Abu Dhabi",
                header_cta_label="Contact us",
                header_cta_href="/contact",
                seo_title="RK Transport | Dubai ⇄ Abu Dhabi Car Transport",
                seo_description="24/7 car transportation in the UAE. Core route Dubai ⇄ Abu Dhabi.",
                footer_blurb="RK Transport moves cars between Dubai and Abu Dhabi.",
            )
        )
    else:
        for field in ("phone_primary", "whatsapp"):
            if getattr(current_settings, field) == "+971500000000":
                setattr(current_settings, field, None)
        if current_settings.email == "hello@rktransport.ae":
            current_settings.email = None
        if current_settings.address_line == "Dubai, United Arab Emirates":
            current_settings.address_line = None

    if not db.query(Location).first():
        dubai = Location(
            name="Dubai",
            slug="dubai",
            emirate="Dubai",
            is_hub=True,
            sort_order=1,
            is_active=True,
        )
        ad = Location(
            name="Abu Dhabi",
            slug="abu-dhabi",
            emirate="Abu Dhabi",
            is_hub=True,
            sort_order=2,
            is_active=True,
        )
        db.add_all([dubai, ad])
        db.flush()
        db.add_all(
            [
                Route(
                    origin_location_id=dubai.id,
                    destination_location_id=ad.id,
                    title="Dubai → Abu Dhabi",
                    is_core=True,
                    sort_order=1,
                    is_active=True,
                ),
                Route(
                    origin_location_id=ad.id,
                    destination_location_id=dubai.id,
                    title="Abu Dhabi → Dubai",
                    is_core=True,
                    sort_order=2,
                    is_active=True,
                ),
            ]
        )

    if not db.query(Service).first():
        db.add_all(
            [
                Service(
                    title="Car Transport",
                    slug="car-transport",
                    short_description="Enclosed and open car transportation on the core Dubai ⇄ Abu Dhabi corridor, both directions.",
                    detailed_description="RK Transport moves private and commercial vehicles between Dubai and Abu Dhabi 24/7. Share pickup and drop-off details and we confirm a window the same day.",
                    features=["Both directions", "Door-to-door options", "Available 24/7"],
                    icon="Truck",
                    category="transport",
                    seo_title="Car Transport Dubai ⇄ Abu Dhabi | RK Transport",
                    seo_description="Enclosed and open vehicle transport between Dubai and Abu Dhabi, both directions, 24/7.",
                    sort_order=1,
                    image_alt="Car transporter on a UAE highway",
                ),
            ]
        )

    if not db.query(VehicleType).first():
        db.add_all(
            [
                VehicleType(name="Sedan", slug="sedan", surcharge_aed=0, sort_order=1),
                VehicleType(name="SUV", slug="suv", surcharge_aed=0, sort_order=2),
                VehicleType(name="Luxury", slug="luxury", surcharge_aed=0, sort_order=3),
                VehicleType(name="Van", slug="van", surcharge_aed=0, sort_order=4),
                VehicleType(name="Motorcycle", slug="motorcycle", surcharge_aed=0, sort_order=5),
            ]
        )

    vehicle_type_rows = {
        row.name.casefold(): row
        for row in db.query(VehicleType).all()
    }
    for name, slug in (
        ("Sedan", "sedan"),
        ("SUV", "suv"),
        ("Pickup", "pickup"),
        ("Van", "van"),
        ("Luxury", "luxury"),
        ("Sports", "sports"),
    ):
        if name.casefold() not in vehicle_type_rows:
            row = VehicleType(name=name, slug=slug, surcharge_aed=0, sort_order=len(vehicle_type_rows) + 1)
            db.add(row)
            vehicle_type_rows[name.casefold()] = row
    motorcycle_type = vehicle_type_rows.get("motorcycle")
    if motorcycle_type:
        motorcycle_type.is_active = False
    db.flush()

    car_starter_data = {
        "Toyota": ["Camry", "Corolla", "Land Cruiser", "Hilux", "Prado", "RAV4", "Yaris"],
        "Nissan": ["Patrol", "Altima", "Sunny", "X-Trail", "Navara", "Pathfinder"],
        "Honda": ["Accord", "Civic", "CR-V", "Pilot", "City"],
        "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLE", "G-Class"],
        "BMW": ["3 Series", "5 Series", "7 Series", "X3", "X5"],
        "Lexus": ["ES", "LS", "RX", "GX", "LX"],
        "Land Rover": ["Defender", "Discovery", "Range Rover Sport"],
        "Range Rover": ["Evoque", "Velar", "Sport", "Autobiography"],
        "Ford": ["Mustang", "Explorer", "Ranger", "F-150", "Everest"],
        "Chevrolet": ["Tahoe", "Captiva", "Camaro", "Silverado"],
        "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent"],
        "Kia": ["Sportage", "Sorento", "K5", "Telluride", "Cerato"],
        "Porsche": ["911", "Cayenne", "Macan", "Panamera"],
        "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
        "Mitsubishi": ["Pajero", "Outlander", "Lancer", "Montero Sport"],
        "Mazda": ["Mazda 3", "Mazda 6", "CX-5", "CX-9"],
        "GMC": ["Yukon", "Terrain", "Acadia", "Sierra"],
        "Isuzu": ["D-Max", "MU-X"],
        "Suzuki": ["Jimny", "Swift", "Vitara"],
        "Volkswagen": ["Golf", "Tiguan", "Touareg", "Passat"],
    }
    vehicle_types_by_name = {
        row.name.casefold(): row.id
        for row in db.query(VehicleType).all()
    }
    for sort_order, (make_name, model_names) in enumerate(car_starter_data.items(), start=1):
        make = db.query(CarMake).filter(CarMake.name.ilike(make_name)).first()
        if not make:
            make = CarMake(name=make_name, sort_order=sort_order, is_active=True)
            db.add(make)
            db.flush()
        existing_models = {
            row.name.casefold()
            for row in db.query(CarModel).filter(CarModel.make_id == make.id).all()
        }
        for model_name in model_names:
            if model_name.casefold() in existing_models:
                continue
            model_folded = model_name.casefold()
            vehicle_type_name = (
                "sports" if any(term in model_folded for term in ("911", "mustang", "camaro"))
                else "pickup" if any(term in model_folded for term in ("hilux", "navara", "ranger", "f-150", "silverado", "sierra", "d-max"))
                else "suv" if any(term in model_folded for term in ("land cruiser", "patrol", "prado", "rav4", "x-trail", "cr-v", "pilot", "gle", "g-class", "x3", "x5", "rx", "gx", "lx", "defender", "discovery", "range rover", "explorer", "everest", "tahoe", "tucson", "santa fe", "sportage", "sorento", "telluride", "cayenne", "macan", "model x", "model y", "pajero", "outlander", "montero", "cx-", "yukon", "terrain", "acadia", "mu-x", "jimny", "vitara", "tiguan", "touareg"))
                else "luxury" if make_name in {"Mercedes-Benz", "BMW", "Lexus", "Land Rover", "Range Rover", "Porsche", "Tesla"}
                else "sedan"
            )
            db.add(
                CarModel(
                    make_id=make.id,
                    name=model_name,
                    default_vehicle_type_id=vehicle_types_by_name.get(vehicle_type_name),
                    is_active=True,
                )
            )

    if not db.query(Vehicle).first():
        db.add_all(
            [
                Vehicle(
                    title="Sedan Comfort",
                    slug="sedan-comfort",
                    description="Smooth, air-conditioned sedans perfect for individual travelers and couples.",
                    seats="4 passengers",
                    chips=["AC", "2 bags", "Wi-Fi ready"],
                    display_order=1,
                ),
                Vehicle(
                    title="SUV Family & Group",
                    slug="suv-family-group",
                    description="Spacious SUVs with extra legroom and luggage space for comfortable journeys.",
                    seats="6-7 passengers",
                    chips=["AC", "5 bags", "Extra legroom"],
                    display_order=2,
                ),
                Vehicle(
                    title="Executive Van",
                    slug="executive-van",
                    description="Premium vans designed for group travel and corporate commuters between cities.",
                    seats="9-12 passengers",
                    chips=["AC", "10 bags", "Group travel"],
                    display_order=3,
                ),
            ]
        )

    if not db.query(HeroBanner).first():
        db.add(
            HeroBanner(
                title="Car transport Dubai ⇄ Abu Dhabi",
                subtitle="RK Transport",
                description="Vehicle transport between Dubai and Abu Dhabi. Available 24/7.",
                badge_text="Available 24/7",
                button_text="Contact us",
                button_link="/contact",
                image_alt="RK Transport car carrier",
                sort_order=1,
                is_active=True,
            )
        )

    if not db.query(About).first():
        db.add(
            About(
                title="About RK Transport",
                subtitle="Moving cars across the UAE",
                description="RK Transport is a Dubai-based car transportation company. Our core corridor is Dubai ⇄ Abu Dhabi in both directions, around the clock.",
                mission="Move every vehicle safely, on time, and with clear communication.",
                vision="Be the most reliable 24/7 car-move partner in the UAE.",
                values=[
                    {"title": "Always on", "description": "Available 24/7 for car transport."},
                    {"title": "Careful handling", "description": "Vehicle moves handled with care."},
                    {"title": "Clear communication", "description": "Service arrangements confirmed before work begins."},
                ],
                images=[],
            )
        )

    default_faqs = [
        Faq(
            question="How much does it cost to transport a car from Dubai to Abu Dhabi?",
            answer="The price depends on vehicle type, condition, pickup and delivery locations, and timing. Contact RK Transport for a fixed quote before the journey.",
            page_key="home",
            sort_order=1,
        ),
        Faq(
            question="Do you operate both directions between Dubai and Abu Dhabi?",
            answer="Yes. Dubai → Abu Dhabi and Abu Dhabi → Dubai, 24/7. See the dedicated route pages for each direction.",
            page_key="home",
            sort_order=1,
        ),
        Faq(
            question="How long does Dubai to Abu Dhabi car transport take?",
            answer="Most jobs run the same day once pickup is confirmed. Exact timing depends on pickup access, traffic, and whether the vehicle is driveable.",
            page_key="dubai-to-abu-dhabi",
            sort_order=1,
        ),
        Faq(
            question="Can you collect from a Dubai apartment tower?",
            answer="Yes, when basement height and loading rules allow. Share the building name and any security or loading-bay instructions when you contact us.",
            page_key="dubai-to-abu-dhabi",
            sort_order=2,
        ),
        Faq(
            question="Do you transport non-running cars from Dubai to Abu Dhabi?",
            answer="Contact us to confirm whether the vehicle can be loaded safely for transport.",
            page_key="dubai-to-abu-dhabi",
            sort_order=3,
        ),
        Faq(
            question="Where in Dubai can you drop a car coming from Abu Dhabi?",
            answer="We drop across Dubai including Marina, Downtown, Business Bay, and other areas. Share the exact pin when you contact us.",
            page_key="abu-dhabi-to-dubai",
            sort_order=1,
        ),
        Faq(
            question="Can I send a car from Mussafah to Dubai?",
            answer="Yes. Mussafah, Khalifa City, and the islands are regular Abu Dhabi collection points for Dubai-bound moves.",
            page_key="abu-dhabi-to-dubai",
            sort_order=2,
        ),
        Faq(
            question="Is Abu Dhabi to Dubai available at night?",
            answer="Yes. The corridor runs 24/7. Night collections are confirmed by phone so access and security are arranged.",
            page_key="abu-dhabi-to-dubai",
            sort_order=3,
        ),
    ]
    existing_faq_questions = {row.question for row in db.query(Faq).all()}
    for faq in default_faqs:
        if faq.question not in existing_faq_questions:
            db.add(faq)
    for row in db.query(Faq).filter(Faq.page_key.is_(None)).all():
        if row.question in {
            "Do you operate both directions between Dubai and Abu Dhabi?",
        }:
            row.page_key = "home"

    existing_keys = {row.key for row in db.query(PageCopy).all()}
    for key, value in PAGE_COPY.items():
        if key not in existing_keys:
            db.add(PageCopy(key=key, value=value))

    db.commit()
