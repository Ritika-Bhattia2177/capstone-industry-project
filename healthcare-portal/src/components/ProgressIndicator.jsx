const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <nav 
      aria-label="Appointment booking progress"
      style={{ marginBottom: '30px' }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'relative',
        marginBottom: '15px'
      }}>
        {/* Progress Line */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '0',
          right: '0',
          height: '4px',
          backgroundColor: '#e0e0e0',
          zIndex: 0
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#3498db',
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Step Circles */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div 
              key={stepNumber}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`Step ${stepNumber}: ${step} ${isCompleted ? '(completed)' : isCurrent ? '(current)' : ''}`}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1,
                zIndex: 1
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: isCompleted || isCurrent ? '#3498db' : '#e0e0e0',
                color: isCompleted || isCurrent ? 'white' : '#95a5a6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                border: isCurrent ? '3px solid #2980b9' : 'none',
                boxShadow: isCurrent ? '0 0 0 4px rgba(52, 152, 219, 0.2)' : 'none'
              }}>
                {isCompleted ? '✓' : stepNumber}
              </div>
              <div style={{
                marginTop: '10px',
                fontSize: '12px',
                fontWeight: isCurrent ? '600' : '500',
                color: isCurrent ? '#2c3e50' : '#7f8c8d',
                textAlign: 'center',
                maxWidth: '100px'
              }}>
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default ProgressIndicator;
