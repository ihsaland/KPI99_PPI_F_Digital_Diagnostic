"""
ROI Calculator API endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any
import traceback

router = APIRouter()

# Scenario defaults
SCENARIO_DEFAULTS = {
    "conservative": {
        "cloud_savings_pct": 0.06,
        "incident_reduction_pct": 0.15,
        "revenue_mitigated_pct": 0.05,
        "productivity_recovery_pct": 0.02,
        "realization_factor": 0.60
    },
    "expected": {
        "cloud_savings_pct": 0.12,
        "incident_reduction_pct": 0.30,
        "revenue_mitigated_pct": 0.10,
        "productivity_recovery_pct": 0.05,
        "realization_factor": 0.75
    },
    "upside": {
        "cloud_savings_pct": 0.18,
        "incident_reduction_pct": 0.45,
        "revenue_mitigated_pct": 0.20,
        "productivity_recovery_pct": 0.08,
        "realization_factor": 0.90
    }
}

# Validation caps
MAX_CLOUD_SAVINGS = 0.30
MAX_INCIDENT_REDUCTION = 0.60
MAX_REVENUE_MITIGATION = 0.30
MAX_PRODUCTIVITY_RECOVERY = 0.15


class ROIInputs(BaseModel):
    annual_cloud_spend_usd: float = Field(ge=0, description="Annual cloud spend in USD")
    critical_incidents_per_month: float = Field(ge=0, description="Critical incidents per month")
    avg_cost_per_incident_usd: float = Field(ge=0, description="Average cost per incident in USD")
    monthly_engineering_cost_usd: float = Field(ge=0, description="Monthly engineering cost in USD")
    monthly_revenue_at_risk_usd: float = Field(ge=0, description="Monthly revenue at risk in USD")
    engagement_cost_usd: float = Field(gt=0, description="Engagement cost in USD")
    engagement_duration_months: float = Field(ge=0, description="Engagement duration in months (ROI starts after completion)")


class ROIModel(BaseModel):
    version: str = "1.0.0"
    region: str
    time_horizon_months: int = Field(gt=0, description="Time horizon in months")
    inputs: ROIInputs
    ppi_f_maturity_score: Optional[float] = Field(None, ge=0, le=5.0, description="PPI-F maturity score (0-5)")

    @field_validator('region')
    @classmethod
    def validate_region(cls, v):
        valid_regions = ['LATAM', 'North America', 'Europe', 'Asia Pacific', 'Other']
        if v not in valid_regions:
            raise ValueError(f"Region must be one of: {', '.join(valid_regions)}")
        return v


def adjust_for_maturity(maturity_score: Optional[float], base_value: float, is_savings: bool = True) -> float:
    """
    Adjust default percentages based on PPI-F maturity score.
    Lower maturity -> higher potential gains, lower realization factor
    Higher maturity -> lower potential gains, higher realization factor
    """
    if maturity_score is None:
        return base_value
    
    # Normalize maturity score to 0-1 range
    normalized = maturity_score / 5.0
    
    if is_savings:
        # Lower maturity = higher potential savings
        # Higher maturity = lower potential savings (already optimized)
        adjustment_factor = 1.0 - (normalized * 0.3)  # Up to 30% reduction for high maturity
        return base_value * adjustment_factor
    else:
        # For realization factor: lower maturity = lower realization, higher maturity = higher realization
        # Base realization is already in the defaults, we adjust based on maturity
        if normalized < 0.4:  # Low maturity (0-2.0)
            adjustment = -0.15  # Reduce realization by 15%
        elif normalized < 0.7:  # Medium maturity (2.0-3.5)
            adjustment = 0.0  # No adjustment
        else:  # High maturity (3.5-5.0)
            adjustment = 0.10  # Increase realization by 10%
        
        return max(0.0, min(1.0, base_value + adjustment))


def calculate_roi_for_scenario(
    scenario: str,
    inputs: ROIInputs,
    time_horizon_months: int,
    maturity_score: Optional[float] = None
) -> Dict[str, Any]:
    """Calculate ROI for a specific scenario"""
    defaults = SCENARIO_DEFAULTS[scenario]
    
    # Adjust percentages based on maturity if provided
    cloud_savings_pct = adjust_for_maturity(maturity_score, defaults["cloud_savings_pct"], is_savings=True)
    incident_reduction_pct = adjust_for_maturity(maturity_score, defaults["incident_reduction_pct"], is_savings=True)
    revenue_mitigated_pct = adjust_for_maturity(maturity_score, defaults["revenue_mitigated_pct"], is_savings=True)
    productivity_recovery_pct = adjust_for_maturity(maturity_score, defaults["productivity_recovery_pct"], is_savings=True)
    realization_factor = adjust_for_maturity(maturity_score, defaults["realization_factor"], is_savings=False)
    
    # Apply caps
    cloud_savings_pct = min(cloud_savings_pct, MAX_CLOUD_SAVINGS)
    incident_reduction_pct = min(incident_reduction_pct, MAX_INCIDENT_REDUCTION)
    revenue_mitigated_pct = min(revenue_mitigated_pct, MAX_REVENUE_MITIGATION)
    productivity_recovery_pct = min(productivity_recovery_pct, MAX_PRODUCTIVITY_RECOVERY)
    realization_factor = max(0.0, min(1.0, realization_factor))
    
    # Calculate impacts
    cloud_impact = inputs.annual_cloud_spend_usd * cloud_savings_pct * realization_factor
    incident_impact = (inputs.critical_incidents_per_month * inputs.avg_cost_per_incident_usd * 12) * incident_reduction_pct * realization_factor
    revenue_impact = (inputs.monthly_revenue_at_risk_usd * 12) * revenue_mitigated_pct * realization_factor
    productivity_impact = (inputs.monthly_engineering_cost_usd * 12) * productivity_recovery_pct * realization_factor
    
    total_impact = cloud_impact + incident_impact + revenue_impact + productivity_impact
    
    # Calculate ROI metrics
    # ROI starts accumulating AFTER engagement completion
    roi_multiple = total_impact / inputs.engagement_cost_usd if inputs.engagement_cost_usd > 0 else 0.0
    monthly_impact = total_impact / time_horizon_months if time_horizon_months > 0 else 0.0
    # Payback period = engagement duration + time to recover cost after engagement completes
    payback_months_from_start = inputs.engagement_duration_months + (inputs.engagement_cost_usd / monthly_impact if monthly_impact > 0 else float('inf'))
    payback_months_from_completion = inputs.engagement_cost_usd / monthly_impact if monthly_impact > 0 else float('inf')
    
    return {
        "scenario": scenario,
        "cloud_impact": round(cloud_impact, 2),
        "incident_impact": round(incident_impact, 2),
        "revenue_impact": round(revenue_impact, 2),
        "productivity_impact": round(productivity_impact, 2),
        "total_impact": round(total_impact, 2),
        "roi_multiple": round(roi_multiple, 2),
        "payback_months_from_start": round(payback_months_from_start, 2) if payback_months_from_start != float('inf') else None,
        "payback_months_from_completion": round(payback_months_from_completion, 2) if payback_months_from_completion != float('inf') else None,
        "realization_factor": round(realization_factor, 2),
        "cloud_savings_pct": round(cloud_savings_pct * 100, 2),
        "incident_reduction_pct": round(incident_reduction_pct * 100, 2),
        "revenue_mitigated_pct": round(revenue_mitigated_pct * 100, 2),
        "productivity_recovery_pct": round(productivity_recovery_pct * 100, 2)
    }


@router.post("/compute")
async def compute_roi(model: ROIModel):
    """
    Compute ROI for Conservative, Expected, and Upside scenarios
    """
    try:
        computed = {}
        warnings = []
        
        # Validate inputs
        if model.inputs.engagement_cost_usd <= 0:
            raise HTTPException(status_code=400, detail="Engagement cost must be greater than 0")
        
        if model.time_horizon_months <= 0:
            raise HTTPException(status_code=400, detail="Time horizon must be greater than 0")
        
        if model.inputs.engagement_duration_months < 0:
            raise HTTPException(status_code=400, detail="Engagement duration must be >= 0")
        
        if model.inputs.engagement_duration_months >= model.time_horizon_months:
            raise HTTPException(status_code=400, detail="Engagement duration must be less than time horizon")
        
        # Check for caps
        if model.inputs.annual_cloud_spend_usd > 0:
            potential_cloud_savings = model.inputs.annual_cloud_spend_usd * MAX_CLOUD_SAVINGS
            if potential_cloud_savings > model.inputs.annual_cloud_spend_usd * 0.5:
                warnings.append("Cloud savings may be capped at 30%")
        
        # Calculate for each scenario
        for scenario in ["conservative", "expected", "upside"]:
            computed[scenario] = calculate_roi_for_scenario(
                scenario,
                model.inputs,
                model.time_horizon_months,
                model.ppi_f_maturity_score
            )
        
        return {
            "computed": computed,
            "warnings": warnings,
            "metadata": {
                "version": model.version,
                "region": model.region,
                "time_horizon_months": model.time_horizon_months,
                "ppi_f_maturity_score": model.ppi_f_maturity_score
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error computing ROI: {str(e)}"
        )

