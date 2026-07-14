import React, { useState } from 'react'

const QuestionCard = ({ item, index }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={`q-card ${isOpen ? 'q-card--open' : ''}`}>
            <div className="q-card__header" onClick={() => setIsOpen(!isOpen)}>
                <div className="q-card__title-group">
                    <span className="q-card__number">Q{index + 1}</span>
                    <h3 className="q-card__question">{item.question}</h3>
                </div>
                <span className="q-card__toggle-icon">{isOpen ? '▼' : '▶'}</span>
            </div>
            {isOpen && (
                <div className="q-card__body">
                    <div className="q-card__section q-card__section--intention">
                        <h4>Interviewer Intention:</h4>
                        <p>{item.intention}</p>
                    </div>
                    <div className="q-card__section q-card__section--answer">
                        <h4>Suggested Answer:</h4>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuestionCard
