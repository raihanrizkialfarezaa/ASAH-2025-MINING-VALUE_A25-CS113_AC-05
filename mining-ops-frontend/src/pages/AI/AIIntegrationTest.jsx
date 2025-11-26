import React, { useState, useEffect } from 'react';
import aiService from '../../services/aiService';

/**
 * AI Integration Test Page
 * Halaman untuk testing full integration antara Frontend, Backend, dan AI Service
 */
const AIIntegrationTest = () => {
  const [testResults, setTestResults] = useState({
    aiServiceHealth: null,
    backendConnection: null,
    realtimeData: null,
    recommendations: null,
    chatbot: null,
  });
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState('');

  // Test AI Service Health
  const testAIServiceHealth = async () => {
    try {
      const response = await aiService.checkHealth();
      setTestResults(prev => ({
        ...prev,
        aiServiceHealth: {
          status: 'success',
          data: response,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        aiServiceHealth: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      }));
    }
  };

  // Test Realtime Data
  const testRealtimeData = async () => {
    try {
      const response = await aiService.getRealtimeConditions();
      setTestResults(prev => ({
        ...prev,
        realtimeData: {
          status: 'success',
          data: response,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        realtimeData: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      }));
    }
  };

  // Test Recommendations
  const testRecommendations = async () => {
    try {
      const params = {
        weather: 'SUNNY',
        shift: 'PAGI',
        target_production: 5000,
        truck_available: 10,
        excavator_available: 3,
      };
      const response = await aiService.getRecommendations(params);
      setTestResults(prev => ({
        ...prev,
        recommendations: {
          status: 'success',
          data: response,
          params: params,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        recommendations: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      }));
    }
  };

  // Test Chatbot
  const testChatbot = async () => {
    try {
      const question = 'What is the best strategy for sunny weather?';
      const context = { weather: 'SUNNY', shift: 'PAGI' };
      const response = await aiService.askChatbot(question, context);
      setTestResults(prev => ({
        ...prev,
        chatbot: {
          status: 'success',
          data: response,
          question: question,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        chatbot: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      }));
    }
  };

  // Run All Tests
  const runAllTests = async () => {
    setLoading(true);
    await testAIServiceHealth();
    await testRealtimeData();
    await testRecommendations();
    await testChatbot();
    setLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const renderTestResult = (title, result, key) => {
    if (!result) {
      return (
        <div className="border rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="text-gray-500">Testing...</div>
        </div>
      );
    }

    const isSuccess = result.status === 'success';
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
    const textColor = isSuccess ? 'text-green-700' : 'text-red-700';

    return (
      <div className={`border ${borderColor} rounded-lg p-4 mb-4 ${bgColor}`}>
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedSection(expandedSection === key ? '' : key)}>
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${textColor}`}>
              {isSuccess ? '✓ Success' : '✗ Failed'}
            </span>
            <span className="text-gray-500">{expandedSection === key ? '▼' : '▶'}</span>
          </div>
        </div>
        
        {expandedSection === key && (
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">
              <strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}
            </div>
            
            {isSuccess ? (
              <div>
                {result.params && (
                  <div className="mb-3">
                    <strong className="text-sm">Parameters:</strong>
                    <pre className="bg-white p-3 rounded mt-1 overflow-auto text-xs">
                      {JSON.stringify(result.params, null, 2)}
                    </pre>
                  </div>
                )}
                {result.question && (
                  <div className="mb-3">
                    <strong className="text-sm">Question:</strong>
                    <p className="bg-white p-3 rounded mt-1 text-sm">{result.question}</p>
                  </div>
                )}
                <strong className="text-sm">Response Data:</strong>
                <pre className="bg-white p-3 rounded mt-1 overflow-auto text-xs max-h-96">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div>
                <strong className="text-sm text-red-600">Error:</strong>
                <pre className="bg-white p-3 rounded mt-1 overflow-auto text-xs text-red-600">
                  {result.error}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Integration Test Dashboard</h1>
          <p className="text-gray-600 mb-4">
            Comprehensive testing for Frontend → Backend → AI Service integration
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={runAllTests}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
            >
              {loading ? 'Running Tests...' : 'Run All Tests'}
            </button>
            <button
              onClick={() => setTestResults({
                aiServiceHealth: null,
                backendConnection: null,
                realtimeData: null,
                recommendations: null,
                chatbot: null,
              })}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Clear Results
            </button>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {testResults.aiServiceHealth?.status === 'success' ? '✓' : 
                 testResults.aiServiceHealth?.status === 'error' ? '✗' : '○'}
              </div>
              <div className="text-sm text-gray-600">AI Health</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {testResults.realtimeData?.status === 'success' ? '✓' : 
                 testResults.realtimeData?.status === 'error' ? '✗' : '○'}
              </div>
              <div className="text-sm text-gray-600">Realtime Data</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {testResults.recommendations?.status === 'success' ? '✓' : 
                 testResults.recommendations?.status === 'error' ? '✗' : '○'}
              </div>
              <div className="text-sm text-gray-600">Recommendations</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {testResults.chatbot?.status === 'success' ? '✓' : 
                 testResults.chatbot?.status === 'error' ? '✗' : '○'}
              </div>
              <div className="text-sm text-gray-600">Chatbot</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(testResults).filter(r => r?.status === 'success').length}/4
              </div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Results</h2>
          
          {renderTestResult('1. AI Service Health Check', testResults.aiServiceHealth, 'health')}
          {renderTestResult('2. Realtime Operational Data', testResults.realtimeData, 'realtime')}
          {renderTestResult('3. Strategic Recommendations', testResults.recommendations, 'recommendations')}
          {renderTestResult('4. AI Chatbot Q&A', testResults.chatbot, 'chatbot')}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Integration Architecture</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-xs overflow-auto">
{`
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│                 │      │                  │      │                 │
│   React         │──────│  Express.js      │──────│  FastAPI        │
│   Frontend      │ HTTP │  Backend         │ HTTP │  AI Service     │
│   (Port 3000)   │      │  (Port 3000)     │      │  (Port 8000)    │
│                 │      │                  │      │                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                │                           │
                                │                           │
                         ┌──────▼──────┐           ┌───────▼────────┐
                         │             │           │                │
                         │ PostgreSQL  │           │  ML Models     │
                         │  Database   │           │  (Joblib)      │
                         │             │           │                │
                         └─────────────┘           └────────────────┘
                                                           │
                                                    ┌──────▼──────┐
                                                    │             │
                                                    │  Ollama     │
                                                    │  (Optional) │
                                                    │             │
                                                    └─────────────┘

Data Flow:
1. Frontend requests → Backend API (/api/ai/*)
2. Backend validates → Calls AI Service (http://localhost:8000)
3. AI Service runs ML predictions + SimPy simulation
4. Chatbot queries use Ollama (if available) or fallback response
5. Results logged to PostgreSQL for analytics
6. Real-time data synced hourly via scheduled jobs
`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIntegrationTest;
