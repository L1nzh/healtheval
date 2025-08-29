'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Evaluation, EvaluationScore, Question, QuestionsResponse } from '@/types';

export default function EvaluationPage() {
  const router = useRouter();
  const { personalInfo, addSubmission } = useApp();
  const [timer, setTimer] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());
  const [evaluation1, setEvaluation1] = useState<Evaluation>({
    helpfulness: null,
    clarity: null,
    reassurance: null,
    feasibility: null,
    medicalAccuracy: null,
  });
  const [evaluation2, setEvaluation2] = useState<Evaluation>({
    helpfulness: null,
    clarity: null,
    reassurance: null,
    feasibility: null,
    medicalAccuracy: null,
  });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/questions?limit=3`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data: QuestionsResponse = await response.json();
      setQuestions(data.questions);
      setPagination(data.pagination);
      setCurrentQuestionIndex(0);
      // Reset evaluations when loading new questions
      setEvaluation1({
        helpfulness: null,
        clarity: null,
        reassurance: null,
        feasibility: null,
        medicalAccuracy: null,
      });
      setEvaluation2({
        helpfulness: null,
        clarity: null,
        reassurance: null,
        feasibility: null,
        medicalAccuracy: null,
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!personalInfo) {
      router.push('/');
      return;
    }

    fetchQuestions();

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [personalInfo, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateAnsweredTimes = async (questionId: string) => {
    try {
      await fetch('/api/questions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionId }),
      });
    } catch (error) {
      console.error('Error updating answered times:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personalInfo) {
      router.push('/');
      return;
    }

    // Check if all scores are selected for both evaluations
    const allScoresSelected1 = Object.values(evaluation1).every(score => score !== null);
    const allScoresSelected2 = Object.values(evaluation2).every(score => score !== null);
    
    if (!allScoresSelected1 || !allScoresSelected2) {
      alert('Please rate all criteria for both responses before submitting.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const submission = {
      personalInfo,
      questionId: currentQuestion._id,
      evaluation: {
        response1: evaluation1,
        response2: evaluation2
      },
      timestamp: new Date().toISOString(),
    };

    console.log('Submission:', submission);
    addSubmission(submission);

    // Update answered times for this question
    if (!answeredQuestionIds.has(currentQuestion._id)) {
      await updateAnsweredTimes(currentQuestion._id);
      setAnsweredQuestionIds(prev => new Set(prev).add(currentQuestion._id));
    }

    // Move to next question or return home
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Reset evaluations
      setEvaluation1({
        helpfulness: null,
        clarity: null,
        reassurance: null,
        feasibility: null,
        medicalAccuracy: null,
      });
      setEvaluation2({
        helpfulness: null,
        clarity: null,
        reassurance: null,
        feasibility: null,
        medicalAccuracy: null,
      });
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const renderRatingOptions = (
    criterion: keyof Evaluation,
    label: string,
    description: string,
    evaluation: Evaluation,
    setEvaluation: React.Dispatch<React.SetStateAction<Evaluation>>
  ) => (
    <div className="mb-6">
      <p className="text-gray-700"><strong>{label}</strong>: {description}</p>
      <div className="flex gap-4">
        {[5,4,3,2,1].map((score) => (
          <label key={score} className="flex items-center">
            <input
              type="radio"
              name={criterion}
              value={score}
              checked={evaluation[criterion] === score}
              onChange={() => setEvaluation({ ...evaluation, [criterion]: score as EvaluationScore })}
              className="mr-2"
            />
            {score}
          </label>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <main className="min-h-screen p-8 max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-xl">Loading questions...</div>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen p-8 max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-xl">No questions available.</div>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Evaluation on Response to Patient Concern</h1>
        <div className="text-xl font-mono bg-gray-100 px-4 py-2 rounded">
          {formatTime(timer)}
        </div>
      </div>

      <div className="space-y-8">
        {/* Question Navigation */}
        {questions.length > 1 && (
          <div className="flex justify-center items-center bg-blue-50 p-4 rounded-lg gap-4">
            <button
              onClick={() => {
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
                // Reset evaluations when changing questions
                setEvaluation1({
                  helpfulness: null,
                  clarity: null,
                  reassurance: null,
                  feasibility: null,
                  medicalAccuracy: null,
                });
                setEvaluation2({
                  helpfulness: null,
                  clarity: null,
                  reassurance: null,
                  feasibility: null,
                  medicalAccuracy: null,
                });
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentQuestionIndex === 0}
              className={`px-3 py-2 text-sm rounded whitespace-nowrap ${
                currentQuestionIndex > 0 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              ⬅ Previous Question
            </button>
            <span className="text-gray-700 text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <button
              onClick={() => {
                setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1));
                // Reset evaluations when changing questions
                setEvaluation1({
                  helpfulness: null,
                  clarity: null,
                  reassurance: null,
                  feasibility: null,
                  medicalAccuracy: null,
                });
                setEvaluation2({
                  helpfulness: null,
                  clarity: null,
                  reassurance: null,
                  feasibility: null,
                  medicalAccuracy: null,
                });
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`px-3 py-2 text-sm rounded whitespace-nowrap ${
                currentQuestionIndex < questions.length - 1 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next Question ➡
            </button>
          </div>
        )}

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Summarized Context</h2>
          <p className="text-gray-700">
            {currentQuestion.summarizedContext}
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Dialogue Chunk</h2>
          <div className="space-y-4">
            {currentQuestion.dialogueChunk.map((dialogue, index) => (
              <p key={index} className="text-gray-700">
                <strong>{dialogue.speaker}:</strong> {dialogue.text}
              </p>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Detected Concern Type</h2>
          <p className="text-gray-700">{currentQuestion.concernType}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Response 1 */}
          <div className="space-y-8">
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Doctor Response 1</h2>
              <p className="text-gray-700">
                {currentQuestion.doctorResponse1}
              </p>
            </section>

            <form className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6">Evaluation on Response 1</h2>
              <p className="text-gray-700 mb-4">
                Please rate the response based on the following criteria:
              </p>
              {renderRatingOptions('helpfulness', 'Helpfulness', 'Does the response directly address the concern?', evaluation1, setEvaluation1)}
              {renderRatingOptions('clarity', 'Clarity', 'Is the response clear and easy to understand?', evaluation1, setEvaluation1)}
              {renderRatingOptions('reassurance', 'Reassurance', 'Does the response demonstrate empathy and understanding?', evaluation1, setEvaluation1)}
              {renderRatingOptions('feasibility', 'Feasibility', 'Is the response practical?', evaluation1, setEvaluation1)}
              {renderRatingOptions('medicalAccuracy', 'Medical Accuracy', 'Is the response medically accurate?', evaluation1, setEvaluation1)}
            </form>
          </div>

          {/* Response 2 */}
          <div className="space-y-8">
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Doctor Response 2</h2>
              <p className="text-gray-700">
                {currentQuestion.doctorResponse2}
              </p>
            </section>

            <form className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6">Evaluation on Response 2</h2>
              <p className="text-gray-700 mb-4">
                Please rate the response based on the following criteria:
              </p>
              {renderRatingOptions('helpfulness', 'Helpfulness', 'Does the response directly address the concern?', evaluation2, setEvaluation2)}
              {renderRatingOptions('clarity', 'Clarity', 'Is the response clear and easy to understand?', evaluation2, setEvaluation2)}
              {renderRatingOptions('reassurance', 'Reassurance', 'Does the response demonstrate empathy and understanding?', evaluation2, setEvaluation2)}
              {renderRatingOptions('feasibility', 'Feasibility', 'Is the response practical?', evaluation2, setEvaluation2)}
              {renderRatingOptions('medicalAccuracy', 'Medical Accuracy', 'Is the response medically accurate?', evaluation2, setEvaluation2)}
            </form>
          </div>
        </div>


        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Submit & Next Question' : 'Submit & Finish'}
          </button>
        </div>
      </div>
    </main>
  );
} 