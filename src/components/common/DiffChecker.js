function DiffChecker(original, current) {
    if (!current || !current.data) return original

    // Copy global settings
    if (current.data.header) {
        if (current.data.header.darkMode !== undefined)
            original.data.header.darkMode = current.data.header.darkMode
        if (current.data.header.isBookmarkFilterRequired !== undefined)
            original.data.header.isBookmarkFilterRequired =
                current.data.header.isBookmarkFilterRequired
    }

    // Maps to track progress
    const questionProgressMap = {}
    const contentProgressMap = {}

    // Build the progress maps from current data
    if (current.data.content) {
        current.data.content.forEach((content) => {
            if (content.contentPath) {
                contentProgressMap[content.contentPath] = {
                    contentUserNotes: content.contentUserNotes || '',
                }
            }
            if (content.categoryList) {
                content.categoryList.forEach((category) => {
                    if (category.questionList) {
                        category.questionList.forEach((question) => {
                            if (question.questionId) {
                                questionProgressMap[question.questionId] = {
                                    isDone: question.isDone,
                                    isBookmarked: question.isBookmarked,
                                    userNotes: question.userNotes,
                                }
                            }
                        })
                    }
                })
            }
        })
    }

    let totalCompleted = 0

    // Apply progress to original data and recalculate counts
    original.data.content.forEach((content) => {
        const savedContentProgress = contentProgressMap[content.contentPath]
        if (savedContentProgress) {
            content.contentUserNotes = savedContentProgress.contentUserNotes || ''
        }

        let contentCompleted = 0
        content.categoryList.forEach((category) => {
            let categoryCompleted = 0
            category.questionList.forEach((question) => {
                const savedQuestionProgress = questionProgressMap[question.questionId]
                if (savedQuestionProgress) {
                    question.isDone = savedQuestionProgress.isDone || false
                    question.isBookmarked = savedQuestionProgress.isBookmarked || false
                    question.userNotes = savedQuestionProgress.userNotes || ''
                }
                if (question.isDone) {
                    categoryCompleted++
                }
            })
            category.categoryCompletedQuestions = categoryCompleted
            contentCompleted += categoryCompleted
        })
        content.contentCompletedQuestions = contentCompleted
        totalCompleted += contentCompleted
    })

    original.data.header.completedQuestions = totalCompleted

    return original
}

export default DiffChecker


