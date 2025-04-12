 /**
 * Compare two sets of questionnaire responses and generate a progress report
 * @param {Array} oldResponses - Previous questionnaire responses
 * @param {Array} newResponses - Current questionnaire responses
 * @returns {Object} Progress report
 */
export const compareResponses = (oldResponses, newResponses) => {
    const report = {
      skinType: {
        changed: false,
        oldValue: null,
        newValue: null
      },
      concerns: {
        improved: [],
        worsened: [],
        new: [],
        resolved: []
      },
      lifestyle: {
        improvements: [],
        declines: []
      },
      overallProgress: 'stable' // stable, improved, or declined
    };
  
    // Create maps for easy comparison
    const oldResponseMap = new Map(oldResponses.map(r => [r.questionId, r.answer]));
    const newResponseMap = new Map(newResponses.map(r => [r.questionId, r.answer]));
  
    // Compare each response
    for (const [questionId, newAnswer] of newResponseMap) {
      const oldAnswer = oldResponseMap.get(questionId);
      const question = newResponses.find(r => r.questionId === questionId)?.question;
  
      if (!oldAnswer) {
        // New question in the latest questionnaire
        continue;
      }
  
      switch (question.category) {
        case 'SKIN_TYPE':
          if (oldAnswer !== newAnswer) {
            report.skinType.changed = true;
            report.skinType.oldValue = oldAnswer;
            report.skinType.newValue = newAnswer;
          }
          break;
  
        case 'CONCERNS':
          const oldConcerns = oldAnswer.split(',').map(c => c.trim());
          const newConcerns = newAnswer.split(',').map(c => c.trim());
  
          // Find resolved concerns
          report.concerns.resolved = oldConcerns.filter(c => !newConcerns.includes(c));
          
          // Find new concerns
          report.concerns.new = newConcerns.filter(c => !oldConcerns.includes(c));
  
          // For concerns that exist in both, check severity if available
          const commonConcerns = oldConcerns.filter(c => newConcerns.includes(c));
          commonConcerns.forEach(concern => {
            const oldSeverity = getConcernSeverity(oldAnswer, concern);
            const newSeverity = getConcernSeverity(newAnswer, concern);
            
            if (newSeverity < oldSeverity) {
              report.concerns.improved.push(concern);
            } else if (newSeverity > oldSeverity) {
              report.concerns.worsened.push(concern);
            }
          });
          break;
  
        case 'LIFESTYLE':
          if (isNumericalQuestion(question.type)) {
            const oldValue = parseFloat(oldAnswer);
            const newValue = parseFloat(newAnswer);
            
            if (newValue > oldValue) {
              report.lifestyle.improvements.push({
                factor: question.text,
                change: newValue - oldValue
              });
            } else if (newValue < oldValue) {
              report.lifestyle.declines.push({
                factor: question.text,
                change: oldValue - newValue
              });
            }
          }
          break;
      }
    }
  
    // Determine overall progress
    const totalImprovements = report.concerns.improved.length + report.lifestyle.improvements.length;
    const totalDeclines = report.concerns.worsened.length + report.lifestyle.declines.length;
  
    if (totalImprovements > totalDeclines) {
      report.overallProgress = 'improved';
    } else if (totalDeclines > totalImprovements) {
      report.overallProgress = 'declined';
    }
  
    return report;
  };
  
  /**
   * Helper function to extract severity from concern response
   * @param {string} response - Full response string
   * @param {string} concern - Specific concern to check
   * @returns {number} Severity level (1-5)
   */
  const getConcernSeverity = (response, concern) => {
    const severityMatch = response.match(new RegExp(`${concern}\\((\\d+)\\)`));
    return severityMatch ? parseInt(severityMatch[1]) : 1;
  };
  
  /**
   * Check if question type is numerical
   * @param {string} type - Question type
   * @returns {boolean}
   */
  const isNumericalQuestion = (type) => {
    return type === 'NUMERICAL' || type === 'RATING';
  };