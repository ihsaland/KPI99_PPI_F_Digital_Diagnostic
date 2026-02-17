'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { assessmentsApi, questionsApi, Question, Answer } from '@/lib/api'
import toast from 'react-hot-toast'
import Logo from '@/components/Logo'
import Navigation from '@/components/Navigation'
import MobileMenu from '@/components/MobileMenu'

const DIMENSIONS = [
  { value: 'performance', label: 'Performance', color: 'blue', icon: '⚡' },
  { value: 'production_readiness', label: 'Production Readiness', color: 'green', icon: '✓' },
  { value: 'infrastructure_efficiency', label: 'Infrastructure Efficiency', color: 'purple', icon: '📊' },
  { value: 'failure_resilience', label: 'Failure Resilience', color: 'red', icon: '🛡️' },
]

export default function AssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = parseInt(params.id as string)

  const [assessment, setAssessment] = useState<any>(null)
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentDimension, setCurrentDimension] = useState<string>('performance')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCritical, setFilterCritical] = useState(false)

  // Load all questions and answers on mount
  useEffect(() => {
    fetchData()
  }, [assessmentId])

  // Load answers when questions are loaded
  useEffect(() => {
    if (allQuestions.length > 0) {
      fetchAnswers()
    }
  }, [allQuestions.length, assessmentId])

  const fetchData = async () => {
    try {
      const [assessmentResponse, questionsResponse] = await Promise.all([
        assessmentsApi.get(assessmentId),
        questionsApi.list(), // Get all questions
      ])
      setAssessment(assessmentResponse.data)
      const questions = questionsResponse.data || []
      console.log('Loaded questions:', questions.length)
      console.log('Question dimensions:', questions.map(q => q.dimension))
      setAllQuestions(questions)
      
      if (questions.length === 0) {
        toast.error('No questions found. Please initialize questions in the database.')
      }
    } catch (error: any) {
      console.error('Error loading assessment:', error)
      toast.error('Failed to load assessment: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  const fetchAnswers = async () => {
    try {
      const response = await assessmentsApi.getAnswers(assessmentId)
      const answersMap: Record<number, string> = {}
      response.data.forEach((answer: Answer) => {
        answersMap[answer.question_id] = answer.answer_value
      })
      setAnswers(answersMap)
    } catch (error: any) {
      // If no answers exist yet, that's okay
      console.log('No existing answers found')
    }
  }

  // Filter questions based on current dimension, search, and critical filter
  const currentQuestions = useMemo(() => {
    let filtered = allQuestions.filter(q => q.dimension === currentDimension)
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(q => 
        q.question_text.toLowerCase().includes(query)
      )
    }
    
    if (filterCritical) {
      filtered = filtered.filter(q => q.is_critical)
    }
    
    return filtered.sort((a, b) => a.order - b.order)
  }, [allQuestions, currentDimension, searchQuery, filterCritical])

  // Get current question
  const currentQuestion = currentQuestions[currentQuestionIndex] || null

  // Navigation functions
  const goToNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      scrollToQuestion()
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      scrollToQuestion()
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    setShowSidebar(false)
    scrollToQuestion()
  }

  const scrollToQuestion = () => {
    setTimeout(() => {
      const element = document.getElementById(`question-${currentQuestion?.id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  // Answer validation
  const validateAnswer = (question: Question, value: string): string | null => {
    if (!value || value.trim() === '') {
      if (question.is_critical) {
        return 'This is a critical question and requires an answer'
      }
      return null // Non-critical questions can be empty
    }

    if (question.question_type === 'numeric') {
      const num = parseFloat(value)
      if (isNaN(num)) {
        return 'Please enter a valid number'
      }
      if (num < 0) {
        return 'Please enter a positive number'
      }
    }

    return null
  }

  const handleAnswerChange = async (questionId: number, value: string) => {
    const question = allQuestions.find(q => q.id === questionId)
    if (!question) return

    const error = validateAnswer(question, value)
    if (error && question.is_critical) {
      toast.error(error)
      return
    }

    setAnswers({ ...answers, [questionId]: value })
    
    // Auto-save with debouncing
    try {
      setSaving(true)
      await assessmentsApi.submitAnswer(assessmentId, {
        question_id: questionId,
        answer_value: value,
      })
      toast.success('Answer saved', { duration: 1000 })
    } catch (error: any) {
      toast.error('Failed to save answer')
    } finally {
      setSaving(false)
    }
  }

  const handleComplete = async () => {
    // Check if all critical questions are answered
    const unansweredCritical = allQuestions.filter(q => 
      q.is_critical && (!answers[q.id] || answers[q.id].trim() === '')
    )

    if (unansweredCritical.length > 0) {
      if (!confirm(`You have ${unansweredCritical.length} unanswered critical question(s). Are you sure you want to complete the assessment?`)) {
        return
      }
    } else {
      if (!confirm('Are you sure you want to complete this assessment? This will generate scores and recommendations.')) {
        return
      }
    }

    try {
      await assessmentsApi.complete(assessmentId)
      toast.success('PPI-F Diagnostic completed!')
      router.push(`/assessments/${assessmentId}/results`)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to complete assessment')
    }
  }

  // Calculate progress
  const answeredCount = currentQuestions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length
  const progress = currentQuestions.length > 0 ? (answeredCount / currentQuestions.length) * 100 : 0
  const totalAnswered = allQuestions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length
  const totalProgress = allQuestions.length > 0 ? (totalAnswered / allQuestions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo size="md" showText={true} />
            </Link>
            <div className="flex items-center gap-4">
              <Navigation />
              <div className="text-sm text-slate-600 font-medium hidden md:block">
                {assessment?.name}
              </div>
              <Link
                href="/documentation"
                className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-600 hover:text-slate-900"
                title="Help & Documentation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
                title="Question List"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Overlay */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar - Question List */}
        {showSidebar && (
          <div className="fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-200 z-40 mt-16 overflow-y-auto md:relative md:mt-0">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Question List</h3>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentQuestionIndex(0)
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <label className="flex items-center mt-3 text-sm">
                <input
                  type="checkbox"
                  checked={filterCritical}
                  onChange={(e) => {
                    setFilterCritical(e.target.checked)
                    setCurrentQuestionIndex(0)
                  }}
                  className="mr-2"
                />
                Show critical only
              </label>
            </div>
            <div className="p-2">
              {currentQuestions.map((q, index) => {
                const isAnswered = answers[q.id] && answers[q.id].trim() !== ''
                const isCurrent = index === currentQuestionIndex
                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(index)}
                    className={`w-full text-left p-3 mb-1 rounded-lg transition ${
                      isCurrent
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : isAnswered
                        ? 'bg-green-50 hover:bg-green-100 border border-green-200'
                        : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-500">Q{index + 1}</span>
                          {q.is_critical && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                              Critical
                            </span>
                          )}
                          {isAnswered && (
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 line-clamp-2">{q.question_text}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main id="main-content" className={`container mx-auto px-6 pt-32 pb-8 max-w-6xl transition-all ${showSidebar ? 'md:ml-80' : ''}`} role="main">
          {/* Dimension Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-wrap gap-3 mb-4">
              {DIMENSIONS.map((dim) => {
                const dimQuestions = allQuestions.filter(q => q.dimension === dim.value)
                const dimAnswered = dimQuestions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length
                const isActive = currentDimension === dim.value
                
                return (
                  <button
                    key={dim.value}
                    onClick={() => {
                      setCurrentDimension(dim.value)
                      setCurrentQuestionIndex(0)
                      setSearchQuery('')
                      setFilterCritical(false)
                    }}
                    className={`px-4 py-3 rounded-lg transition-all font-semibold ${
                      isActive
                        ? `bg-${dim.color}-600 text-white shadow-md`
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="mr-2">{dim.icon}</span>
                    {dim.label}
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-slate-200'
                    }`}>
                      {dimAnswered}/{dimQuestions.length}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Current Dimension: {answeredCount}/{currentQuestions.length}</span>
                <span>Overall: {totalAnswered}/{allQuestions.length}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Current Question */}
          {currentQuestion ? (
            <div id={`question-${currentQuestion.id}`} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{currentQuestionIndex + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-slate-900 pr-4">{currentQuestion.question_text}</h3>
                    {currentQuestion.is_critical && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full whitespace-nowrap">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Question {currentQuestionIndex + 1} of {currentQuestions.length} in {DIMENSIONS.find(d => d.value === currentDimension)?.label}
                  </p>
                </div>
              </div>

              {currentQuestion.question_type === 'single_select' && currentQuestion.options?.options && (
                <div className="space-y-2 pl-14">
                  {currentQuestion.options.options.map((option: string) => (
                    <label key={option} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition group ${
                      answers[currentQuestion.id] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}>
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="mr-4 w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-700 group-hover:text-slate-900">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.question_type === 'multi_select' && currentQuestion.options?.options && (
                <div className="space-y-2 pl-14">
                  {currentQuestion.options.options.map((option: string) => (
                    <label key={option} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition group ${
                      (answers[currentQuestion.id] || '').includes(option)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={(answers[currentQuestion.id] || '').includes(option)}
                        onChange={(e) => {
                          const current = (answers[currentQuestion.id] || '').split(',').filter(Boolean)
                          const newValue = e.target.checked
                            ? [...current, option].join(',')
                            : current.filter(v => v !== option).join(',')
                          handleAnswerChange(currentQuestion.id, newValue)
                        }}
                        className="mr-4 w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="text-slate-700 group-hover:text-slate-900">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.question_type === 'numeric' && (
                <div className="pl-14">
                  <input
                    type="number"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter a number"
                    min="0"
                  />
                  {currentQuestion.is_critical && !answers[currentQuestion.id] && (
                    <p className="text-sm text-red-600 mt-2">This field is required</p>
                  )}
                </div>
              )}

              {currentQuestion.question_type === 'free_text' && (
                <div className="pl-14">
                  <textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows={4}
                    placeholder="Enter your answer"
                  />
                  {currentQuestion.is_critical && !answers[currentQuestion.id] && (
                    <p className="text-sm text-red-600 mt-2">This field is required</p>
                  )}
                </div>
              )}

              {saving && (
                <p className="text-sm text-slate-500 mt-3 pl-14 flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </p>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 pl-14">
                <button
                  onClick={goToPrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  {currentQuestionIndex + 1} / {currentQuestions.length}
                </span>
                <button
                  onClick={goToNext}
                  disabled={currentQuestionIndex === currentQuestions.length - 1}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : allQuestions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Questions Available</h3>
              <p className="text-slate-600 mb-4">Questions have not been initialized in the database.</p>
              <p className="text-sm text-slate-500">Please run: <code className="bg-slate-100 px-2 py-1 rounded">python -m app.init_questions</code> in the backend directory.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <p className="text-slate-600">No questions found for the current dimension. Try adjusting your search or filter.</p>
              <p className="text-sm text-slate-500 mt-2">
                Showing questions for: <strong>{DIMENSIONS.find(d => d.value === currentDimension)?.label}</strong>
              </p>
              <p className="text-sm text-slate-500">
                Total questions loaded: <strong>{allQuestions.length}</strong>
              </p>
            </div>
          )}

          {/* Complete Button */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
            <button
              onClick={handleComplete}
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Complete PPI-F Diagnostic
            </button>
            <p className="text-sm text-slate-600 mt-3">
              {totalAnswered === allQuestions.length 
                ? 'All questions answered. Ready to complete!'
                : `You've answered ${totalAnswered} of ${allQuestions.length} questions.`}
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
