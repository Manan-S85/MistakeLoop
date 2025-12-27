import { useState, useRef, useEffect } from "react";
import Icons from "../components/Icons.jsx";
import homeTitleImg from "../assets/home_title.png";

export default function InterviewDiagnostic({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationState, setConversationState] = useState("greeting");
  const [userContext, setUserContext] = useState({
    status: "",
    skills: "",
    sentiment: "",
    interviewReflection: "",
    pastMistakes: []
  });
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  };

  useEffect(() => {
    // Initial greeting message
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: "ai",
          content: `Welcome back, ${user?.name || 'User'}! I'm your AI Interview Coach, and I'm here to help you transform your interview experiences into your next success story. I know interviews can feel overwhelming, but remember - every experience is a stepping stone toward your goals.\n\nLet's start by getting to know you better. What's your current situation? Are you a student preparing for placements, someone looking to switch careers, or perhaps a recent graduate navigating the job market? I want to understand your journey so I can provide the most relevant guidance.`,
          timestamp: new Date()
        }
      ]);
    }
  }, [user, messages.length]);

  useEffect(() => {
    // Only scroll if there are messages and after a brief delay to ensure DOM is updated
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: currentInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const inputValue = currentInput.trim();
    setCurrentInput("");
    setLoading(true);

    // Process user input based on conversation state
    let aiResponse = "";
    let nextState = conversationState;

    try {
      switch (conversationState) {
        case "greeting":
          setUserContext(prev => ({ ...prev, status: inputValue }));
          
          // Add thinking delay for better UX
          setLoading(true);
          setTimeout(() => {
            aiResponse = `I understand you're ${inputValue.toLowerCase()}. That context really helps me tailor my guidance to your specific situation!\n\nNow, let's dive into the technical side - what specific skills, technologies, or role were you interviewing for? The more specific you can be (like "Full Stack Developer with React and Node.js" or "Data Scientist with Python and Machine Learning"), the better I can understand the expectations and challenges you faced.`;
            nextState = "skills";
            
            const aiMessage = {
              id: Date.now() + 1,
              type: "ai",
              content: aiResponse,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setConversationState(nextState);
            setLoading(false);
          }, 1000);
          return; // Exit early
          break;

        case "skills":
          setUserContext(prev => ({ ...prev, skills: inputValue }));
          
          setLoading(true);
          setTimeout(() => {
            aiResponse = `Perfect! ${inputValue} - I have a clear picture of the technical landscape you're navigating. These skills are definitely in demand, which is great!\n\nNow, I want to understand how you're feeling about all this. Job searching and interviews can be an emotional rollercoaster - are you feeling anxious about your performance, frustrated with the process, excited but nervous, or maybe overwhelmed? There's no wrong answer here, and understanding your emotional state helps me provide the right kind of support.`;
            nextState = "sentiment";
            
            const aiMessage = {
              id: Date.now() + 1,
              type: "ai",
              content: aiResponse,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setConversationState(nextState);
            setLoading(false);
          }, 1200);
          return; // Exit early
          break;

        case "sentiment":
          setUserContext(prev => ({ ...prev, sentiment: inputValue }));
          
          setLoading(true);
          setTimeout(() => {
            const contextualResponse = generateContextualResponse();
            aiResponse = `${contextualResponse}\n\nNow that I understand your background and how you're feeling, I'm ready to dive into the main event - your interview experience. Take your time and tell me everything that happened. I want to hear about:\n\n• The questions that caught you off guard\n• Moments when you felt confident\n• Times when you stumbled or felt uncertain\n• Technical challenges you faced\n• Anything you wish you had said differently\n\nRemember, there's no judgment here - every detail helps me understand your experience better and provide more personalized guidance. The more honest and detailed you are, the better I can help you turn this experience into preparation for your next success.`;
            nextState = "reflection";
            
            const aiMessage = {
              id: Date.now() + 1,
              type: "ai",
              content: aiResponse,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setConversationState(nextState);
            setLoading(false);
          }, 1500);
          return; // Exit early
          break;

        case "reflection":
          setUserContext(prev => ({ ...prev, interviewReflection: inputValue }));
          
          // Add thinking delay for reflection processing
          setLoading(true);
          const thinkingMessage = {
            id: Date.now(),
            type: "ai",
            content: "Let me carefully read through your interview experience and understand what happened...\n\n*Reading and processing your reflection...*",
            timestamp: new Date(),
            isThinking: true
          };
          setMessages(prev => [...prev, thinkingMessage]);
          
          // Simulate thinking time
          setTimeout(() => {
            setMessages(prev => prev.filter(m => !m.isThinking));
            aiResponse = `Thank you for sharing your interview experience so openly. I can tell you've put real thought into reflecting on what happened, and that self-awareness is already a huge strength.\n\nBefore I analyze your experience, are there any recurring patterns or mistakes from past interviews that you'd like me to consider? For example, things like "I always get nervous with coding challenges" or "I struggle with behavioral questions" or "I tend to ramble in my answers"?\n\nYou can either tell me about any patterns you've noticed, or just say "none" or "let's proceed" if you'd prefer to jump straight into the analysis.`;
            nextState = "pastMistakes";
            
            const aiMessage = {
              id: Date.now() + 1,
              type: "ai",
              content: aiResponse,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setConversationState(nextState);
            setLoading(false);
          }, 2500);
          return; // Exit early to prevent duplicate message
          break;

        case "pastMistakes":
          if (inputValue.toLowerCase().includes("none") || inputValue.toLowerCase().includes("proceed")) {
            setUserContext(prev => ({ ...prev, pastMistakes: [] }));
          } else {
            const mistakes = inputValue.split(',').map(m => m.trim()).filter(m => m.length > 0);
            setUserContext(prev => ({ ...prev, pastMistakes: mistakes }));
          }
          
          aiResponse = "Perfect! I now have all the context I need. Let me analyze your interview experience and provide personalized feedback and actionable strategies. This might take a moment as I'm processing everything you've shared...";
          nextState = "analyzing";
          
          // Start analysis
          setTimeout(() => {
            handleAnalysis();
          }, 1000);
          break;

        case "completed":
          // Handle post-analysis conversation
          setLoading(true);
          
          setTimeout(() => {
            let contextualResponse = "";
            
            // Check if user is asking about higher studies vs job
            if (inputValue.toLowerCase().includes('higher studies') || inputValue.toLowerCase().includes('masters') || inputValue.toLowerCase().includes('phd')) {
              contextualResponse = `That's a great question about higher studies vs job opportunities! Based on our previous conversation about your interview experiences, I can definitely help you think through this decision.\n\nHere are some key factors to consider:\n\n**For Higher Studies:**\n• **Specialization**: Advanced degrees allow deeper expertise in your field\n• **Research opportunities**: If you're interested in innovation and cutting-edge work\n• **Long-term career growth**: Some roles require advanced degrees\n• **Network building**: Academic connections can be valuable\n\n**For Job First:**\n• **Real-world experience**: Practical skills and industry exposure\n• **Financial independence**: Start earning and gaining work experience\n• **Immediate impact**: Apply your current skills right away\n• **Learning while working**: Many companies offer continuous learning opportunities\n\n**Hybrid approaches to consider:**\n• Part-time masters while working\n• Company-sponsored education programs\n• Industry certifications alongside work experience\n\nWhat specific field are you considering for higher studies? And what are your main concerns about choosing between the two paths?`;
            } else if (inputValue.toLowerCase().includes('another interview') || inputValue.toLowerCase().includes('new interview')) {
              contextualResponse = `Absolutely! I'd love to help you with another interview experience. Every interview is a learning opportunity, and analyzing multiple experiences helps us identify patterns and track your growth.\n\nTo provide you with the most relevant guidance, let's start fresh:\n\n**What's the context for this new interview experience?**\n• Was this a recent interview or one you're preparing for?\n• Same type of role/company as before, or something different?\n• How did you feel going into this one compared to your previous interviews?\n\nI'll use insights from our previous analysis to give you even more personalized advice this time around. Tell me everything about this interview experience!`;
              
              // Reset context for new interview analysis
              setUserContext(prev => ({
                ...prev,
                interviewReflection: "",
                pastMistakes: prev.pastMistakes // Keep past patterns for better analysis
              }));
              setConversationState("reflection");
            } else {
              // General follow-up conversation
              contextualResponse = `I'm here to help with any follow-up questions about your interview analysis or career guidance! \n\nYou could ask me about:\n• **Specific advice** from the analysis you'd like me to elaborate on\n• **Higher education vs job decisions** and career planning\n• **Another interview experience** you'd like to discuss\n• **Preparation strategies** for upcoming interviews\n• **Industry-specific guidance** for your field\n\nWhat would you like to explore further?`;
            }
            
            const aiMessage = {
              id: Date.now() + 1,
              type: "ai",
              content: contextualResponse,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setLoading(false);
          }, 1200);
          
          return; // Exit early to prevent duplicate message
          break;

        default:
          aiResponse = "I'm not sure how to respond to that. Could you please try again?";
      }

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationState(nextState);

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "I apologize, but I encountered an error processing your message. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateContextualResponse = () => {
    const { sentiment } = userContext;
    let response = `Thank you for being so open about how you're feeling. `;
    
    if (sentiment.toLowerCase().includes('nervous') || sentiment.toLowerCase().includes('anxious')) {
      response += "Feeling nervous is completely natural - it shows you care about this opportunity and your career growth. That nervousness often comes from a place of passion, which is actually a strength.";
    } else if (sentiment.toLowerCase().includes('frustrated') || sentiment.toLowerCase().includes('disappointed')) {
      response += "I can really understand that frustration. Job searching can feel like an uphill battle sometimes, but every interview - even the challenging ones - teaches us something valuable about ourselves and the process.";
    } else if (sentiment.toLowerCase().includes('confident') || sentiment.toLowerCase().includes('excited')) {
      response += "I love hearing that confidence! That positive mindset is such an asset in interviews and will serve you well throughout your career journey.";
    } else if (sentiment.toLowerCase().includes('overwhelmed')) {
      response += "Feeling overwhelmed is so understandable - there's a lot of pressure in interviews, especially when you're passionate about the role. Let's break this down together and make it feel more manageable.";
    } else {
      response += "I appreciate you sharing your feelings with me. Understanding your emotional state helps me provide the right kind of support.";
    }

    return response;
  };

  const handleAnalysis = async () => {
    try {
      // Add analyzing steps with delays
      const analyzingSteps = [
        "Analyzing your interview experience...",
        "Processing your responses and identifying patterns...", 
        "Generating personalized insights and recommendations...",
        "Finalizing your custom action plan..."
      ];
      
      for (let i = 0; i < analyzingSteps.length; i++) {
        const stepMessage = {
          id: Date.now() + i,
          type: "ai", 
          content: analyzingSteps[i],
          timestamp: new Date(),
          isThinking: true
        };
        
        setMessages(prev => {
          // Remove previous thinking message and add new one
          const filtered = prev.filter(m => !m.isThinking);
          return [...filtered, stepMessage];
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reflection: userContext.interviewReflection,
          pastMistakes: userContext.pastMistakes,
          userContext: {
            status: userContext.status,
            skills: userContext.skills,
            sentiment: userContext.sentiment
          }
        }),
      });

      const data = await response.json();
      
      // Remove thinking message
      setMessages(prev => prev.filter(m => !m.isThinking));
      
      if (data.category || data.suggestions || data.actionItems) {
        const analysisMessage = formatAnalysisResponse(data);
        const aiMessage = {
          id: Date.now(),
          type: "ai",
          content: analysisMessage,
          timestamp: new Date(),
          isAnalysis: true
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setConversationState("completed");
      } else {
        throw new Error(data.error || "Analysis failed");
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Remove thinking message
      setMessages(prev => prev.filter(m => !m.isThinking));
      
      const errorMessage = {
        id: Date.now(),
        type: "ai",
        content: `I apologize, but I'm having trouble analyzing your interview right now. Let me try to provide some general guidance based on what you've shared:\n\n**From your situation**: As a final year student with 4 interviews in 6 months, you're actively engaging in the job market, which is great experience.\n\n**Key areas to focus on**:\n• **Application strategy**: Consider quality over quantity - research companies thoroughly\n• **Interview skills**: Practice common questions and technical challenges\n• **Follow-up**: Always send thank-you notes and follow up professionally\n\n**Next steps**:\n• Practice mock interviews with career services\n• Get feedback from previous interviews if possible\n• Consider networking events and job fairs\n\nWould you like to discuss any specific aspect of your interviews in more detail?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setConversationState("completed");
    }
  };

  const formatAnalysisResponse = (analysis) => {
    let response = "**Interview Analysis Complete**\n\n";
    
    if (analysis.category) {
      response += `**Primary Focus Area:** ${analysis.category}\n\n`;
    }

    if (analysis.confidence) {
      const confidenceLevel = analysis.confidence >= 80 ? "High" : 
                              analysis.confidence >= 60 ? "Good" : 
                              analysis.confidence >= 40 ? "Moderate" : "Limited";
      response += `**Analysis Confidence:** ${analysis.confidence}% (${confidenceLevel})\n\n`;
    }

    if (analysis.suggestions && analysis.suggestions.length > 0) {
      response += "💡 **Key Insights & Strategies:**\n\n";
      analysis.suggestions.forEach((suggestion, index) => {
        response += `${index + 1}. ${suggestion}\n\n`;
      });
    }

    if (analysis.actionItems && analysis.actionItems.length > 0) {
      response += "🎯 **Your Action Plan:**\n\n";
      analysis.actionItems.forEach((item, index) => {
        response += `**Step ${index + 1}:** ${item}\n\n`;
      });
    }

    response += "\n---\n\n**Remember:** Every interview experience, whether it feels successful or challenging, is building your skills and resilience. You're taking the right steps by reflecting and seeking feedback. Keep going - your breakthrough is closer than you think!\n\nWould you like to discuss any specific part of this analysis further, or start a new interview reflection?";

    return response;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setCurrentInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const resetConversation = () => {
    setMessages([{
      id: 1,
      type: "ai",
      content: `Welcome back! I'm ready to help you with another interview reflection. Let's start fresh - what's your current situation? Are you a student, employed, or actively job hunting?`,
      timestamp: new Date()
    }]);
    setUserContext({
      status: "",
      skills: "",
      sentiment: "",
      interviewReflection: "",
      pastMistakes: []
    });
    setConversationState("greeting");
    setCurrentInput("");
  };

  const formatMessageContent = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/• (.*?)(?=\n|$)/g, '• <span style="margin-left: 8px;">$1</span>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements - Subtle and Professional */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '800px',
        height: '800px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 1
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-15%',
        width: '600px',
        height: '600px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 25s ease-in-out infinite reverse',
        zIndex: 1
      }}></div>

      {/* Main Container - Full Width ChatGPT Style */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header */}
        <header style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}><img src="/logo.png" alt="AI" style={{width: '40px', height: '40px', objectFit: 'cover'}} /></div>
            <div>
              <img 
                src={homeTitleImg} 
                alt="MistakeLoop AI Coach" 
                style={{
                  height: '32px',
                  objectFit: 'contain'
                }}
              />
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                margin: 0
              }}>Transform your interview experiences into success</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {conversationState === "completed" && (
              <button
                onClick={resetConversation}
                style={{
                  padding: '12px 24px',
                  borderRadius: '50px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
                }}
              >
                New Session
              </button>
            )}
            <button
              onClick={onLogout}
              style={{
                padding: '12px 24px',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.1)';
                e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Chat Messages Area */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(0, 0, 0, 0.02)',
          minHeight: 0 // Important: allows flex child to shrink below its content size
        }}>
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: messages.length === 0 ? 'center' : 'flex-start'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              paddingBottom: '24px'
            }}>
            {messages.map((message) => (
              <div key={message.id} style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {message.type === 'ai' ? <img src="/logo.png" alt="AI" style={{width: '40px', height: '40px', objectFit: 'cover'}} /> : <Icons.User size={18} />}
                </div>

                {/* Message Content */}
                <div style={{
                  background: message.type === 'ai' 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
                    : 'linear-gradient(135deg, rgba(65, 105, 225, 0.4) 0%, rgba(135, 206, 235, 0.3) 100%)',
                  border: message.type === 'ai'
                    ? '1px solid rgba(255, 255, 255, 0.15)'
                    : '1px solid rgba(65, 105, 225, 0.5)',
                  borderRadius: message.type === 'ai' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  padding: '20px 24px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  flex: 1,
                  maxWidth: '75%',
                  marginLeft: message.type === 'user' ? 'auto' : '0',
                  marginRight: message.type === 'ai' ? 'auto' : '0'
                }}>
                  <div style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }} dangerouslySetInnerHTML={{
                    __html: formatMessageContent(message.content)
                  }}></div>

                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    marginTop: '12px'
                  }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  overflow: 'hidden'
                }}><img src="/logo.png" alt="AI" style={{width: '40px', height: '40px', objectFit: 'cover'}} /></div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4169E1',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4169E1',
                    animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4169E1',
                    animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                  }}></div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', marginLeft: '8px' }}>
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            </div>
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </div>
        </div>

        {/* Input Area */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px',
          flexShrink: 0
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '16px 20px',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-end'
            }}>
              <textarea
                ref={textareaRef}
                value={currentInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={
                  conversationState === "analyzing" || loading 
                    ? "Please wait while I analyze your interview..." 
                    : "Type your message here... (Press Enter to send, Shift+Enter for new line)"
                }
                disabled={conversationState === "analyzing" || loading}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                  minHeight: '24px',
                  maxHeight: '120px',
                  overflow: 'auto'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || loading || conversationState === "analyzing"}
                style={{
                  background: (!currentInput.trim() || loading || conversationState === "analyzing")
                    ? 'rgba(100, 100, 100, 0.3)'
                    : 'linear-gradient(135deg, #4169E1 0%, #87CEEB 100%)',
                  color: (!currentInput.trim() || loading || conversationState === "analyzing")
                    ? 'rgba(255, 255, 255, 0.4)'
                    : '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  cursor: (!currentInput.trim() || loading || conversationState === "analyzing") 
                    ? 'not-allowed' 
                    : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  flexShrink: 0
                }}
                onMouseOver={(e) => {
                  if (currentInput.trim() && !loading && conversationState !== "analyzing") {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 14px 0 rgba(65, 105, 225, 0.39)';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentInput.trim() && !loading && conversationState !== "analyzing") {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }
        
        /* Firefox Scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #667eea rgba(0, 0, 0, 0.1);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .chat-container {
            padding: 16px;
          }
          
          .message-content {
            padding: 16px 20px;
          }
          
          .input-area {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}