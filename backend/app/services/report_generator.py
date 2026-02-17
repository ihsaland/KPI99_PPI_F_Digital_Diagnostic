"""
Report generator service for PDF, JSON, CSV, and Excel exports
"""
from sqlalchemy.orm import Session
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics import renderPDF
import json
import csv
import os
from datetime import datetime
from typing import Dict, Any, List
import io

from app import models
from app.models import Dimension

REPORT_DIR = os.getenv("REPORT_DIR", "./reports")

class ReportGenerator:
    """Service for generating assessment reports"""
    
    def __init__(self):
        os.makedirs(REPORT_DIR, exist_ok=True)
    
    def generate_pdf(self, assessment_id: int, report_type: str, db: Session) -> str:
        """Generate PDF report"""
        assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
        if not assessment:
            raise ValueError("Assessment not found")
        
        scores = db.query(models.Score).filter(models.Score.assessment_id == assessment_id).all()
        findings = db.query(models.Finding).filter(models.Finding.assessment_id == assessment_id).all()
        recommendations = db.query(models.Recommendation).filter(
            models.Recommendation.assessment_id == assessment_id
        ).order_by(models.Recommendation.priority).all()
        
        filename = f"kpi99_assessment_{assessment_id}_{report_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join(REPORT_DIR, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        story = []
        styles = getSampleStyleSheet()
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a237e'),
            spaceAfter=30
        )
        story.append(Paragraph("KPI99 PPI-F Engineering Maturity Report", title_style))
        story.append(Paragraph("Performance failures are business risks — until they are engineered.", styles['Italic']))
        story.append(Spacer(1, 0.2*inch))
        
        # Assessment Info
        story.append(Paragraph(f"<b>Assessment:</b> {assessment.name}", styles['Normal']))
        story.append(Paragraph(f"<b>Organization:</b> {assessment.organization.name}", styles['Normal']))
        story.append(Paragraph(f"<b>Date:</b> {assessment.completed_at.strftime('%Y-%m-%d %H:%M') if assessment.completed_at else 'N/A'}", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Executive Summary (if full or executive)
        if report_type in ["full", "executive"]:
            overall_maturity = sum(s.maturity_score for s in scores) / len(scores) if scores else 0.0
            story.append(Paragraph("<b>Executive Summary</b>", styles['Heading2']))
            
            # Enhanced executive summary with visual indicators
            summary_data = [
                ["Metric", "Value", "Status"],
                ["PPI-F Overall Maturity Score", f"{overall_maturity:.2f}/5.0", 
                 "Excellent" if overall_maturity >= 4.0 else "Good" if overall_maturity >= 3.0 else "Fair" if overall_maturity >= 2.0 else "Critical"],
                ["Total Findings", str(len(findings)), 
                 "Critical" if len([f for f in findings if f.severity == "critical"]) > 0 else "Normal"],
                ["Total PPI-F Recommendations", str(len(recommendations)), "Action Required"],
                ["Assessment Status", assessment.status.title(), "Completed" if assessment.status == "completed" else "In Progress"]
            ]
            
            if overall_maturity < 2.0:
                risk_level = "Critical"
            elif overall_maturity < 3.0:
                risk_level = "High"
            elif overall_maturity < 4.0:
                risk_level = "Medium"
            else:
                risk_level = "Low"
            
            summary_data.append(["Risk Level", risk_level, risk_level])
            
            summary_table = Table(summary_data)
            summary_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a237e')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
            ]))
            story.append(summary_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Scores Heatmap (if full or engineering)
        if report_type in ["full", "engineering"]:
            story.append(Paragraph("<b>PPI-F Maturity Scores by Dimension</b>", styles['Heading2']))
            
            score_data = [["Dimension", "Maturity Score", "Percentage", "Status"]]
            for score in scores:
                status = "Critical" if score.maturity_score < 2.0 else "High" if score.maturity_score < 3.0 else "Medium" if score.maturity_score < 4.0 else "Good"
                score_data.append([
                    score.dimension.value.replace('_', ' ').title(),
                    f"{score.maturity_score:.2f}/5.0",
                    f"{score.percentage:.1f}%",
                    status
                ])
            
            score_table = Table(score_data)
            score_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(score_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Findings (if full or engineering)
        if report_type in ["full", "engineering"] and findings:
            story.append(Paragraph("<b>PPI-F Key Findings</b>", styles['Heading2']))
            for finding in findings[:10]:  # Limit to top 10
                story.append(Paragraph(f"<b>{finding.severity.upper()}: {finding.title}</b>", styles['Normal']))
                story.append(Paragraph(finding.description, styles['Normal']))
                story.append(Spacer(1, 0.1*inch))
            story.append(Spacer(1, 0.2*inch))
        
        # Recommendations (if full or engineering)
        if report_type in ["full", "engineering"] and recommendations:
            story.append(Paragraph("<b>PPI-F Engineering Recommendations & Roadmap</b>", styles['Heading2']))
            
            # Group by timeline
            by_timeline = {}
            for rec in recommendations:
                timeline = rec.timeline
                if timeline not in by_timeline:
                    by_timeline[timeline] = []
                by_timeline[timeline].append(rec)
            
            for timeline in ["30", "60", "90"]:
                if timeline in by_timeline:
                    story.append(Paragraph(f"<b>{timeline}-Day Roadmap</b>", styles['Heading3']))
                    
                    # Create recommendations table for better formatting
                    rec_data = [["Title", "Effort", "Impact", "Status", "Priority"]]
                    for rec in by_timeline[timeline]:
                        rec_data.append([
                            rec.title[:50] + "..." if len(rec.title) > 50 else rec.title,
                            rec.effort.title(),
                            rec.impact.title(),
                            (rec.status or "pending").replace("_", " ").title(),
                            str(rec.priority)
                        ])
                    
                    rec_table = Table(rec_data, colWidths=[3*inch, 0.8*inch, 0.8*inch, 0.8*inch, 0.6*inch])
                    rec_table.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0, 0), (-1, 0), 10),
                        ('FONTSIZE', (0, 1), (-1, -1), 9),
                        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                        ('GRID', (0, 0), (-1, -1), 1, colors.black),
                    ]))
                    story.append(rec_table)
                    story.append(Spacer(1, 0.2*inch))
                    
                    # Detailed descriptions
                    for rec in by_timeline[timeline]:
                        story.append(Paragraph(f"<b>{rec.title}</b>", styles['Normal']))
                        story.append(Paragraph(rec.description, styles['Normal']))
                        if rec.kpi:
                            story.append(Paragraph(f"<i>KPI: {rec.kpi}</i>", styles['Italic']))
                        story.append(Spacer(1, 0.1*inch))
                    story.append(Spacer(1, 0.2*inch))
        
        doc.build(story)
        return filepath
    
    def generate_json(self, assessment_id: int, db: Session) -> Dict[str, Any]:
        """Generate JSON export"""
        assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
        if not assessment:
            raise ValueError("Assessment not found")
        
        scores = db.query(models.Score).filter(models.Score.assessment_id == assessment_id).all()
        findings = db.query(models.Finding).filter(models.Finding.assessment_id == assessment_id).all()
        recommendations = db.query(models.Recommendation).filter(
            models.Recommendation.assessment_id == assessment_id
        ).all()
        answers = db.query(models.Answer).filter(models.Answer.assessment_id == assessment_id).all()
        
        overall_maturity = sum(s.maturity_score for s in scores) / len(scores) if scores else 0.0
        
        return {
            "assessment": {
                "id": assessment.id,
                "name": assessment.name,
                "version": assessment.version,
                "status": assessment.status,
                "completed_at": assessment.completed_at.isoformat() if assessment.completed_at else None
            },
            "organization": {
                "id": assessment.organization.id,
                "name": assessment.organization.name
            },
            "overall_maturity": overall_maturity,
            "scores": [
                {
                    "dimension": s.dimension.value,
                    "maturity_score": s.maturity_score,
                    "weighted_score": s.weighted_score,
                    "percentage": s.percentage
                }
                for s in scores
            ],
            "findings": [
                {
                    "dimension": f.dimension.value,
                    "severity": f.severity,
                    "title": f.title,
                    "description": f.description
                }
                for f in findings
            ],
            "recommendations": [
                {
                    "dimension": r.dimension.value,
                    "title": r.title,
                    "description": r.description,
                    "effort": r.effort,
                    "impact": r.impact,
                    "kpi": r.kpi,
                    "timeline": r.timeline,
                    "priority": r.priority
                }
                for r in recommendations
            ],
            "answers": [
                {
                    "question_id": a.question_id,
                    "answer_value": a.answer_value,
                    "maturity_score": a.maturity_score
                }
                for a in answers
            ]
        }
    
    def generate_csv(self, assessment_id: int, db: Session) -> str:
        """Generate CSV backlog export with enhanced data"""
        assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
        if not assessment:
            raise ValueError("Assessment not found")
        
        recommendations = db.query(models.Recommendation).filter(
            models.Recommendation.assessment_id == assessment_id
        ).order_by(models.Recommendation.timeline, models.Recommendation.priority).all()
        
        filename = f"kpi99_backlog_{assessment_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        filepath = os.path.join(REPORT_DIR, filename)
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([
                "Title", "Description", "Dimension", "Effort", "Impact", 
                "KPI", "Timeline (days)", "Priority", "Status", "Created At"
            ])
            
            for rec in recommendations:
                writer.writerow([
                    rec.title,
                    rec.description,
                    rec.dimension.value.replace('_', ' ').title(),
                    rec.effort,
                    rec.impact,
                    rec.kpi or "",
                    rec.timeline,
                    rec.priority,
                    rec.status or "pending",
                    rec.created_at.strftime('%Y-%m-%d %H:%M:%S') if rec.created_at else ""
                ])
        
        return filepath
    
    def generate_excel(self, assessment_id: int, db: Session) -> str:
        """Generate Excel export using CSV format (Excel-compatible)"""
        # For now, we'll create an enhanced CSV that Excel can open
        # In production, you might want to use openpyxl or xlsxwriter
        assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
        if not assessment:
            raise ValueError("Assessment not found")
        
        scores = db.query(models.Score).filter(models.Score.assessment_id == assessment_id).all()
        findings = db.query(models.Finding).filter(models.Finding.assessment_id == assessment_id).all()
        recommendations = db.query(models.Recommendation).filter(
            models.Recommendation.assessment_id == assessment_id
        ).order_by(models.Recommendation.timeline, models.Recommendation.priority).all()
        answers = db.query(models.Answer).filter(models.Answer.assessment_id == assessment_id).all()
        
        filename = f"kpi99_assessment_{assessment_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        filepath = os.path.join(REPORT_DIR, filename)
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            
            # Assessment Info Sheet (simulated with headers)
            writer.writerow(["KPI99 PPI-F Digital Diagnostic - Assessment Export"])
            writer.writerow(["Assessment:", assessment.name])
            writer.writerow(["Organization:", assessment.organization.name])
            writer.writerow(["Completed:", assessment.completed_at.strftime('%Y-%m-%d %H:%M:%S') if assessment.completed_at else "N/A"])
            writer.writerow([])
            
            # Scores Sheet
            writer.writerow(["=== MATURITY SCORES ==="])
            writer.writerow(["Dimension", "Maturity Score", "Weighted Score", "Max Possible", "Percentage"])
            for score in scores:
                writer.writerow([
                    score.dimension.value.replace('_', ' ').title(),
                    f"{score.maturity_score:.2f}",
                    f"{score.weighted_score:.2f}",
                    f"{score.max_possible_score:.2f}",
                    f"{score.percentage:.1f}%"
                ])
            writer.writerow([])
            
            # Findings Sheet
            writer.writerow(["=== KEY FINDINGS ==="])
            writer.writerow(["Severity", "Dimension", "Title", "Description"])
            for finding in findings:
                writer.writerow([
                    finding.severity,
                    finding.dimension.value.replace('_', ' ').title(),
                    finding.title,
                    finding.description
                ])
            writer.writerow([])
            
            # Recommendations Sheet
            writer.writerow(["=== RECOMMENDATIONS & ROADMAP ==="])
            writer.writerow([
                "Title", "Description", "Dimension", "Effort", "Impact", 
                "KPI", "Timeline (days)", "Priority", "Status"
            ])
            for rec in recommendations:
                writer.writerow([
                    rec.title,
                    rec.description,
                    rec.dimension.value.replace('_', ' ').title(),
                    rec.effort,
                    rec.impact,
                    rec.kpi or "",
                    rec.timeline,
                    rec.priority,
                    rec.status or "pending"
                ])
            writer.writerow([])
            
            # Answers Sheet
            writer.writerow(["=== ASSESSMENT ANSWERS ==="])
            writer.writerow(["Question ID", "Answer Value", "Maturity Score"])
            for answer in answers:
                writer.writerow([
                    answer.question_id,
                    answer.answer_value,
                    f"{answer.maturity_score:.2f}" if answer.maturity_score else ""
                ])
        
        return filepath

