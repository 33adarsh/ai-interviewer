import React, { useState, useEffect } from 'react'

const RoadMapDay = ({ day }) => {
    const storageKey = `roadmap_day_${day.day}_tasks`

    const [checkedTasks, setCheckedTasks] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            return saved ? JSON.parse(saved) : {}
        } catch {
            return {}
        }
    })

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(checkedTasks))
    }, [checkedTasks, storageKey])

    const handleToggle = (taskIndex) => {
        setCheckedTasks(prev => ({
            ...prev,
            [taskIndex]: !prev[taskIndex]
        }))
    }

    return (
        <div className="roadmap-day-card">
            <div className="roadmap-day-card__header">
                <span className="roadmap-day-card__badge">Day {day.day}</span>
                <h3 className="roadmap-day-card__focus">{day.focus}</h3>
            </div>
            <div className="roadmap-day-card__body">
                <ul className="roadmap-day-card__tasks">
                    {day.tasks.map((task, i) => {
                        const isChecked = !!checkedTasks[i]
                        return (
                            <li 
                                key={i} 
                                className={`roadmap-day-card__task-item ${isChecked ? 'roadmap-day-card__task-item--checked' : ''}`}
                                onClick={() => handleToggle(i)}
                            >
                                <div className="roadmap-day-card__checkbox-wrapper">
                                    <input 
                                        type="checkbox" 
                                        checked={isChecked} 
                                        onChange={() => {}}
                                        className="roadmap-day-card__checkbox"
                                    />
                                    <span className="roadmap-day-card__checkmark"></span>
                                </div>
                                <span className="roadmap-day-card__task-text">{task}</span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default RoadMapDay
