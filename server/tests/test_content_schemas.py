import unittest

from app.schemas.content import HeroBannerIn


class HeroBannerSchemaTests(unittest.TestCase):
    def test_heading_can_be_blank_or_omitted(self):
        self.assertEqual(HeroBannerIn(title="").title, "")
        self.assertEqual(HeroBannerIn().title, "")


if __name__ == "__main__":
    unittest.main()
