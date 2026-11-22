from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from backend.genai.onboarding import (
    process_onboarding_conversation,
    parse_resume_or_profile_text,
    generate_skill_analysis_and_roadmap,
    extract_text_from_file_bytes
)

router = APIRouter(tags=["GenAI Extensions"])

class OnboardingChatRequest(BaseModel):
    user_message: str
    session_id: Optional[str] = None
    current_profile: Optional[Dict[str, Any]] = None

class ResumeTextRequest(BaseModel):
    resume_text: str
    current_profile: Optional[Dict[str, Any]] = None

class ProfileAnalyzeRequest(BaseModel):
    profile: Dict[str, Any]

class PolicyAskRequest(BaseModel):
    question: str
    employee_id: Optional[str] = None

class GenAIMitigationRequest(BaseModel):
    employee_id: str
    prompt: Optional[str] = None

@router.post("/onboarding/chat")
def onboarding_chat(body: OnboardingChatRequest):
    """
    Onboarding Multi-Turn Conversational Agent.
    Parses conversational text, extracts structured profile fields, and provides guidance.
    """
    try:
        result = process_onboarding_conversation(
            user_message=body.user_message,
            current_profile=body.current_profile
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Onboarding conversation error: {str(e)}"
        )

@router.post("/onboarding/parse-resume-text")
def parse_resume_text(body: ResumeTextRequest):
    """
    Parse raw resume or LinkedIn text into structured profile with skills, experience, and roadmap.
    """
    try:
        profile = parse_resume_or_profile_text(body.resume_text, body.current_profile)
        analysis = generate_skill_analysis_and_roadmap(profile)
        return {
            "status": "success",
            "profile": profile,
            "analysis": analysis,
            "source": "Nirnaya Resume Intelligence"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume parsing error: {str(e)}"
        )

@router.post("/onboarding/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    Accepts PDF, DOCX, or TXT file upload, extracts text, and runs deep profile synthesis.
    """
    try:
        contents = await file.read()
        extracted_text = extract_text_from_file_bytes(contents, file.filename)
        if not extracted_text or extracted_text.startswith("["):
            raise ValueError(extracted_text or "Could not extract legible text from file")

        profile = parse_resume_or_profile_text(extracted_text)
        analysis = generate_skill_analysis_and_roadmap(profile)

        return {
            "status": "success",
            "filename": file.filename,
            "profile": profile,
            "analysis": analysis,
            "raw_text_length": len(extracted_text),
            "source": "Nirnaya Document Extractor"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process resume file: {str(e)}"
        )

@router.post("/onboarding/analyze")
def analyze_profile(body: ProfileAnalyzeRequest):
    """
    Evaluates profile skills against role baseline and generates 30-60-90 day onboarding roadmap.
    """
    try:
        analysis = generate_skill_analysis_and_roadmap(body.profile)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile analysis error: {str(e)}"
        )

@router.post("/policy/ask", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def policy_ask_stub(body: PolicyAskRequest):
    """
    Policy Q&A Agent (GenAI Stub).
    To be implemented by GenAI teammate in backend/genai/policy_qa.py
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Policy Q&A GenAI agent logic to be implemented by GenAI teammate in backend/genai/policy_qa.py"
    )

@router.post("/mitigation/generate", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def mitigation_generate_stub(body: GenAIMitigationRequest):
    """
    Mitigation Reasoning Engine (GenAI Stub).
    To be implemented by GenAI teammate in backend/genai/mitigation.py
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Mitigation Reasoning GenAI logic to be implemented by GenAI teammate in backend/genai/mitigation.py"
    )
