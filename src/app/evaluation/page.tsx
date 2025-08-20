'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Evaluation, EvaluationScore } from '@/types';

export default function EvaluationPage() {
  const router = useRouter();
  const { personalInfo, addSubmission } = useApp();
  const [timer, setTimer] = useState(0);
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

  useEffect(() => {
    if (!personalInfo) {
      router.push('/');
      return;
    }

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

  const handleSubmit = (e: React.FormEvent) => {
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

    const submission = {
      personalInfo,
      evaluation: {
        response1: evaluation1,
        response2: evaluation2
      },
      timestamp: new Date().toISOString(),
    };

    console.log('Submission:', submission);
    addSubmission(submission);
    router.push('/');
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

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Evaluation on Response to Patient Concern</h1>
        <div className="text-xl font-mono bg-gray-100 px-4 py-2 rounded">
          {formatTime(timer)}
        </div>
      </div>

      <div className="space-y-8">
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Summarized Context</h2>
          <p className="text-gray-700">
            The patient has been newly diagnosed with diabetes and is discussing starting insulin treatment with the doctor.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Dialogue Chunk</h2>
          <div className="space-y-4">
            <p className="text-gray-700"><strong>Patient:</strong> Do I really need to start insulin now? Can't I just try other medications first？</p>
            <p className="text-gray-700"><strong>Doctor:</strong> Insulin is necessary at this stage to control your blood sugar levels effectively. Other medications may not work as well in your case. </p>
            <p className="text-gray-700"><strong>Patient:</strong> I'm worried that once I start insulin, I'll have to use it for the rest of my life. </p>
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Detected Concern Type</h2>
          <p className="text-gray-700">Lifestyle Adaptations</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Response 1 */}
          <div className="space-y-8">
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Doctor Response 1</h2>
              <p className="text-gray-700">
                It's natural to feel hesitant about starting insulin. Many patients worry about long-term commitment, but insulin is often introduced to stabilize blood sugar levels when other options might not be sufficient. Once your levels are well-controlled, we can reassess whether other treatments could be an option for you. Think of insulin as a temporary tool to help your body adjust and avoid complications. You won't necessarily need it for life, and we'll work together to explore all available options as your condition improves.
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
                While insulin might seem daunting, it's actually a very effective treatment option. Your blood sugar levels indicate that we need to take action now to prevent complications. We can start with a low dose and adjust as needed. 
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
            Submit
          </button>
        </div>
      </div>
    </main>
  );
} 