import { useState } from "react";

export default function InterviewDiagnostic({ user, onLogout }) {
  const [reflection, setReflection] = useState("");
  const [email, setEmail] = useState(user.email);
  const [pastMistakes, setPastMistakes] = useState([]);
  const [newMistake, setNewMistake] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddMistake = () => {
    if (newMistake.trim()) {
      setPastMistakes([...pastMistakes, newMistake.trim()]);
      setNewMistake("");
    }
  };

  const handleRemoveMistake = (index) => {
    setPastMistakes(pastMistakes.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!reflection.trim()) {
      alert("Please enter your interview reflection");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reflection: reflection.trim(),
          email: email.trim() || undefined,
          pastMistakes: pastMistakes.length > 0 ? pastMistakes : undefined
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Analysis failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReflection("");
    setEmail("");
    setPastMistakes([]);
    setNewMistake("");
    setAnalysis(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      margin: 0,
      padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '24px 0',
          borderBottom: '1px solid #1f1f1f'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#ffffff',
              margin: 0,
              marginBottom: '4px'
            }}>
              Welcome back, {user?.name || 'User'}
            </h1>
            <p style={{ 
              color: '#888888', 
              fontSize: '16px',
              margin: 0
            }}>
              Ready to analyze your interview performance?
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #333333',
              background: '#1a1a1a',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#262626';
              e.target.style.borderColor = '#404040';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#1a1a1a';
              e.target.style.borderColor = '#333333';
            }}
          >
            Logout
          </button>
        </header>

        {/* Main Content */}
        <main style={{ paddingTop: '40px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 400px', 
            gap: '40px',
            '@media (max-width: 1200px)': {
              gridTemplateColumns: '1fr',
              gap: '24px'
            }
          }}>
            {/* Left Column - Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Interview Reflection Card */}
              <div style={{ 
                background: '#111111', 
                border: '1px solid #1f1f1f',
                borderRadius: '12px', 
                padding: '24px'
              }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#ffffff',
                  marginBottom: '16px',
                  margin: 0
                }}>
                  Interview Reflection
                </h2>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Describe what happened in your interview... What went wrong? What could you have done better? Be specific about mistakes, missed opportunities, or areas where you struggled."
                  style={{
                    width: '100%',
                    height: '160px',
                    padding: '16px',
                    background: '#0a0a0a',
                    border: '1px solid #1f1f1f',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    marginTop: '12px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#333333'}
                  onBlur={(e) => e.target.style.borderColor = '#1f1f1f'}
                />
              </div>

              {/* Email Card */}
              <div style={{ 
                background: '#111111', 
                border: '1px solid #1f1f1f',
                borderRadius: '12px', 
                padding: '24px'
              }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#ffffff',
                  marginBottom: '16px',
                  margin: 0
                }}>
                  Email (Auto-filled)
                </h2>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: '#0a0a0a',
                    border: '1px solid #1f1f1f',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    marginTop: '12px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#333333'}
                  onBlur={(e) => e.target.style.borderColor = '#1f1f1f'}
                />
                <p style={{ color: '#666666', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>
                  This helps track your progress over time
                </p>
              </div>

              {/* Past Mistakes Card */}
              <div style={{ 
                background: '#111111', 
                border: '1px solid #1f1f1f',
                borderRadius: '12px', 
                padding: '24px'
              }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#ffffff',
                  marginBottom: '16px',
                  margin: 0
                }}>
                  Known Past Mistakes
                </h2>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <input
                    type="text"
                    value={newMistake}
                    onChange={(e) => setNewMistake(e.target.value)}
                    placeholder="e.g., Poor communication, Lack of preparation"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: '#0a0a0a',
                      border: '1px solid #1f1f1f',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMistake()}
                    onFocus={(e) => e.target.style.borderColor = '#333333'}
                    onBlur={(e) => e.target.style.borderColor = '#1f1f1f'}
                  />
                  <button
                    onClick={handleAddMistake}
                    style={{
                      padding: '12px 20px',
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#e5e5e5'}
                    onMouseOut={(e) => e.target.style.background = '#ffffff'}
                  >
                    Add
                  </button>
                </div>
                
                {pastMistakes.length > 0 && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {pastMistakes.map((mistake, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        background: '#0a0a0a', 
                        padding: '12px 16px', 
                        borderRadius: '8px',
                        border: '1px solid #1f1f1f'
                      }}>
                        <span style={{ color: '#ffffff', fontSize: '14px' }}>{mistake}</span>
                        <button
                          onClick={() => handleRemoveMistake(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#666666',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseOver={(e) => e.target.style.color = '#ffffff'}
                          onMouseOut={(e) => e.target.style.color = '#666666'}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !reflection.trim()}
                  style={{
                    flex: 1,
                    padding: '16px 24px',
                    background: loading || !reflection.trim() ? '#333333' : '#ffffff',
                    color: loading || !reflection.trim() ? '#666666' : '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: loading || !reflection.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!loading && reflection.trim()) {
                      e.target.style.background = '#e5e5e5';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading && reflection.trim()) {
                      e.target.style.background = '#ffffff';
                    }
                  }}
                >
                  {loading ? "Analyzing..." : "Analyze Interview"}
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '16px 24px',
                    background: '#1a1a1a',
                    color: '#ffffff',
                    border: '1px solid #333333',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    fontWeight: '500',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#262626';
                    e.target.style.borderColor = '#404040';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#1a1a1a';
                    e.target.style.borderColor = '#333333';
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right Column - Results & Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {analysis ? (
                <div style={{ 
                  background: '#111111', 
                  border: '1px solid #1f1f1f',
                  borderRadius: '12px', 
                  padding: '24px'
                }}>
                  <h2 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#ffffff',
                    marginBottom: '20px',
                    margin: 0
                  }}>
                    Analysis Results
                  </h2>
                  
                  {analysis.category && (
                    <div style={{ 
                      marginBottom: '20px', 
                      padding: '16px', 
                      background: '#0a0a0a', 
                      borderRadius: '8px',
                      border: '1px solid #1f1f1f'
                    }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        color: '#ffffff',
                        fontSize: '14px',
                        margin: '0 0 8px 0'
                      }}>Issue Category:</h3>
                      <p style={{ color: '#cccccc', margin: 0, fontSize: '14px' }}>{analysis.category}</p>
                    </div>
                  )}

                  {analysis.suggestions && analysis.suggestions.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        color: '#ffffff', 
                        marginBottom: '12px',
                        fontSize: '14px',
                        margin: '0 0 12px 0'
                      }}>Improvement Suggestions:</h3>
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} style={{ 
                            color: '#cccccc', 
                            paddingLeft: '16px', 
                            borderLeft: '2px solid #333333',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.actionItems && analysis.actionItems.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        color: '#ffffff', 
                        marginBottom: '12px',
                        fontSize: '14px',
                        margin: '0 0 12px 0'
                      }}>Action Items:</h3>
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {analysis.actionItems.map((item, index) => (
                          <li key={index} style={{ 
                            color: '#cccccc', 
                            paddingLeft: '16px', 
                            borderLeft: '2px solid #333333',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.confidence && (
                    <div style={{ 
                      padding: '16px', 
                      background: '#0a0a0a', 
                      borderRadius: '8px',
                      border: '1px solid #1f1f1f'
                    }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        color: '#ffffff',
                        fontSize: '14px',
                        margin: '0 0 12px 0'
                      }}>Confidence Level:</h3>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          flex: 1, 
                          background: '#333333', 
                          borderRadius: '4px', 
                          height: '8px',
                          marginRight: '12px'
                        }}>
                          <div style={{ 
                            background: '#ffffff', 
                            height: '8px', 
                            borderRadius: '4px',
                            width: `${analysis.confidence}%`,
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '14px', color: '#cccccc' }}>{analysis.confidence}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ 
                  background: '#111111', 
                  border: '1px solid #1f1f1f',
                  borderRadius: '12px', 
                  padding: '40px 24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                  <h2 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#ffffff',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>
                    Ready for Analysis
                  </h2>
                  <p style={{ 
                    color: '#666666',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    Enter your interview reflection and click "Analyze Interview" to get AI-powered feedback and improvement suggestions.
                  </p>
                </div>
              )}

              {/* Quick Tips */}
              <div style={{ 
                background: '#111111', 
                border: '1px solid #1f1f1f',
                borderRadius: '12px', 
                padding: '24px'
              }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#ffffff',
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}>
                  Quick Tips
                </h2>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  color: '#cccccc',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <li>• Be specific about what went wrong</li>
                  <li>• Mention the type of interview (technical, behavioral, etc.)</li>
                  <li>• Include your preparation level</li>
                  <li>• Note any recurring patterns from past interviews</li>
                  <li>• Track your email to build a progress history</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}