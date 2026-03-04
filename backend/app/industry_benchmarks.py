"""
Industry-specific PPI-F baseline benchmarks for normalizing scores across industries.
Baseline maturity (0-5) per industry; used when organization.industry is set.
"""
from typing import Dict, List, Tuple

# Industry key -> (display label, baseline maturity 0-5)
# Baselines are reference averages for "typical" maturity in that industry (can be updated from real data later).
INDUSTRY_BENCHMARKS: Dict[str, Tuple[str, float]] = {
    "technology": ("Technology", 3.2),
    "financial_services": ("Financial Services", 3.0),
    "healthcare": ("Healthcare", 2.7),
    "retail": ("Retail", 2.6),
    "manufacturing": ("Manufacturing", 2.5),
    "energy": ("Energy & Utilities", 2.4),
    "telecommunications": ("Telecommunications", 2.9),
    "media": ("Media & Entertainment", 2.8),
    "government": ("Government", 2.3),
    "education": ("Education", 2.4),
    "other": ("Other", 3.0),
}

DEFAULT_BASELINE = 3.0  # When industry is missing or unknown


def get_industry_baseline(industry: str | None) -> float:
    """Return baseline maturity (0-5) for the given industry key. Uses DEFAULT_BASELINE if unknown or None."""
    if not industry:
        return DEFAULT_BASELINE
    key = industry.strip().lower().replace(" ", "_")
    if key in INDUSTRY_BENCHMARKS:
        return INDUSTRY_BENCHMARKS[key][1]
    return DEFAULT_BASELINE


def get_industry_label(industry: str | None) -> str:
    """Return display label for the industry, or 'All industries' when unknown."""
    if not industry:
        return "All industries"
    key = industry.strip().lower().replace(" ", "_")
    if key in INDUSTRY_BENCHMARKS:
        return INDUSTRY_BENCHMARKS[key][0]
    return industry.replace("_", " ").title()


def list_industries() -> List[Dict[str, str]]:
    """Return list of { value, label } for dropdowns."""
    return [
        {"value": k, "label": v[0]}
        for k, v in INDUSTRY_BENCHMARKS.items()
    ]
