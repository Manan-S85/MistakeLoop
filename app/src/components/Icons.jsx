// SVG Icons Component - Replacing Emojis
import React from 'react';

const IconBase = ({ children, size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

// Robot Icon (replacing 🤖)
export const RobotIcon = (props) => (
  <IconBase {...props}>
    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
    <rect x="6" y="10" width="12" height="8" rx="2" />
    <circle cx="9" cy="13" r="1" />
    <circle cx="15" cy="13" r="1" />
    <path d="M9 16H15" strokeWidth="1" stroke="currentColor" fill="none" />
  </IconBase>
);

// Target Icon (replacing 🎯)
export const TargetIcon = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="2"/>
    <circle cx="12" cy="12" r="6" stroke="currentColor" fill="none" strokeWidth="2"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </IconBase>
);

// Rocket Icon (replacing 🚀)
export const RocketIcon = (props) => (
  <IconBase {...props}>
    <path d="M4.5 16.5C-1.5 10.5 3 2 3 2S11 6.5 10.5 16.5"/>
    <path d="M12 15L8.5 21.5L10.5 16.5"/>
    <path d="M16 8L22 14L16.5 10.5"/>
    <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" fill="none"/>
    <circle cx="8.5" cy="7.5" r="1" fill="currentColor"/>
  </IconBase>
);

// Wave Icon (replacing 👋)
export const WaveIcon = (props) => (
  <IconBase {...props}>
    <path d="M7 13C7 15.21 8.79 17 11 17S15 15.21 15 13S13.21 9 11 9S7 10.79 7 13Z"/>
    <path d="M11 1V7M11 17V23M4.22 4.22L8.93 8.93M15.07 15.07L19.78 19.78M1 11H7M17 11H23M4.22 19.78L8.93 15.07M15.07 8.93L19.78 4.22" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
  </IconBase>
);

// Thinking Icon (replacing 🤔)
export const ThinkingIcon = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="2"/>
    <path d="M9.09 9A3 3 0 015.83 6H2V4H5.83A3 3 0 019.09 1H11.91A3 3 0 0115.17 4H19V6H15.17A3 3 0 0111.91 9H9.09Z" 
          fill="currentColor"/>
    <circle cx="12" cy="17" r="1" fill="currentColor"/>
  </IconBase>
);

// Search Icon (replacing 🔍)
export const SearchIcon = (props) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="8" stroke="currentColor" fill="none" strokeWidth="2"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" fill="none"/>
  </IconBase>
);

// Brain Icon (replacing 🧠)
export const BrainIcon = (props) => (
  <IconBase {...props}>
    <path d="M12 2C13.1 2 14 2.9 14 4C15.1 4 16 4.9 16 6C17.1 6 18 6.9 18 8C18 9.1 17.1 10 16 10V14C16 15.1 15.1 16 14 16H10C8.9 16 8 15.1 8 14V10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C8 4.9 8.9 4 10 4C10 2.9 10.9 2 12 2Z" 
          stroke="currentColor" strokeWidth="1" fill="currentColor"/>
    <circle cx="10" cy="8" r="1" fill="white"/>
    <circle cx="14" cy="8" r="1" fill="white"/>
  </IconBase>
);

// Chart Icon (replacing 📊)
export const ChartIcon = (props) => (
  <IconBase {...props}>
    <rect x="3" y="16" width="4" height="5" stroke="currentColor" fill="currentColor"/>
    <rect x="10" y="10" width="4" height="11" stroke="currentColor" fill="currentColor"/>
    <rect x="17" y="6" width="4" height="15" stroke="currentColor" fill="currentColor"/>
  </IconBase>
);

// Sparkles Icon (replacing ✨)
export const SparklesIcon = (props) => (
  <IconBase {...props}>
    <path d="M12 1L14.5 8.5L22 11L14.5 13.5L12 21L9.5 13.5L2 11L9.5 8.5L12 1Z" 
          stroke="currentColor" fill="currentColor"/>
    <path d="M19 4L20 6L22 7L20 8L19 10L18 8L16 7L18 6L19 4Z" 
          stroke="currentColor" fill="currentColor"/>
    <path d="M6 16L7 18L9 19L7 20L6 22L5 20L3 19L5 18L6 16Z" 
          stroke="currentColor" fill="currentColor"/>
  </IconBase>
);

// Star Icon (replacing 🌟)
export const StarIcon = (props) => (
  <IconBase {...props}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
          stroke="currentColor" fill="currentColor"/>
  </IconBase>
);

// Muscle Icon (replacing 💪)
export const MuscleIcon = (props) => (
  <IconBase {...props}>
    <path d="M6 12C6 10.34 7.34 9 9 9C10.66 9 12 10.34 12 12V16C12 17.66 10.66 19 9 19C7.34 19 6 17.66 6 16V12Z" 
          stroke="currentColor" fill="currentColor"/>
    <path d="M9 9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9V12" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="15" cy="10" r="3" stroke="currentColor" fill="currentColor"/>
  </IconBase>
);

// Lightbulb Icon (replacing 💡)
export const LightbulbIcon = (props) => (
  <IconBase {...props}>
    <path d="M9 21H15M12 3C8.68629 3 6 5.68629 6 9C6 10.8954 6.94604 12.5683 8.40283 13.5847C8.78374 13.8438 9 14.2776 9 14.74V16C9 16.5523 9.44772 17 10 17H14C14.5523 17 15 16.5523 15 16V14.74C15 14.2776 15.2163 13.8438 15.5972 13.5847C17.054 12.5683 18 10.8954 18 9C18 5.68629 15.3137 3 12 3Z" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
  </IconBase>
);

// X Icon (replacing ❌)
export const XIcon = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" fill="#ef4444" strokeWidth="2"/>
    <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" fill="none"/>
  </IconBase>
);

// Check Icon (replacing ✅)
export const CheckIcon = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" fill="#10b981" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" fill="none"/>
  </IconBase>
);

// User Icon (replacing 👤)
export const UserIcon = (props) => (
  <IconBase {...props}>
    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
  </IconBase>
);

// Running Icon (replacing 🏃‍♂️)
export const RunningIcon = (props) => (
  <IconBase {...props}>
    <circle cx="6" cy="4" r="2" fill="currentColor"/>
    <path d="M10 6H7L6 8H4L5 10L7 9L8.5 11.5L10 10V13L8 15L10 16L12.5 13.5L11 10.5L13 9L11 7.5L10 6Z" 
          stroke="currentColor" strokeWidth="1" fill="currentColor"/>
  </IconBase>
);

export default {
  Robot: RobotIcon,
  Target: TargetIcon,
  Rocket: RocketIcon,
  Wave: WaveIcon,
  Thinking: ThinkingIcon,
  Search: SearchIcon,
  Brain: BrainIcon,
  Chart: ChartIcon,
  Sparkles: SparklesIcon,
  Star: StarIcon,
  Muscle: MuscleIcon,
  Lightbulb: LightbulbIcon,
  X: XIcon,
  Check: CheckIcon,
  User: UserIcon,
  Running: RunningIcon
};