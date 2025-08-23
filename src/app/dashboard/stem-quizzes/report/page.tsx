"use client"
import StatCards from '@/components/Dashboard/StatCards'
import WelcomeBanner from '@/components/Dashboard/WelcomeBanner'
import AnswerEval from '@/components/Quiz/AnswerEval'
import { quizResultStats } from '@/lib/data'
import { useUser } from '@/services/UserContext'

const QuizReport = () => {
    const { user } = useUser();
    const firstName = user?.fullName?.split(" ")[0];
  return (
    <div>
        <WelcomeBanner firstName={firstName? firstName : ""}/>
        <StatCards stats={quizResultStats} />
        <AnswerEval/>
    </div>
  )
}

export default QuizReport