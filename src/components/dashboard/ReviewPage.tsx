import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import useFetchReview from "@/hooks/useFetchReview"
import { ChevronDown, ChevronUp, BriefcaseBusiness, CalendarDays, Timer, ShieldCheck, Download } from 'lucide-react'
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Review } from "@/interfaces/types"

export default function ReviewPage() {
    const interviewId = useParams().interviewId as string;
    const [reviewDetails, setReviewDetails] = useState<Review | null>(null);
    const [, setInterviewTranscript] = useState<string | null>(null);
    const { loading, getReview } = useFetchReview();

    const [isQuestionSummaryOpen, setIsQuestionSummaryOpen] = useState(false)
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
    const [isVideoOpen, setIsVideoOpen] = useState(false)

    useEffect(() => {
        getReview(interviewId).then((data) => {
            if (data.callOutcome !== "") {
                let index1 = data.callOutcome.indexOf('{')
                let index2 = data.callOutcome.lastIndexOf('}')

                setReviewDetails(JSON.parse(data.callOutcome.slice(index1, index2 + 1)));
            }
            setInterviewTranscript(data.conversationTranscript);
        })
    }, [])

    if (loading) {
        return <div>Loading....</div>
    }

    if (reviewDetails == null) {
        return <div>No Details for this interview</div>
    }

    return (
        <div className="min-h-screen w-full text-white">
            <div className="flex items-center justify-end px-6 py-4">
                <Button variant="outline" className="border-[#3D3D3D] text-black hover:bg-[#eee]">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                </Button>
            </div>
            <div className="container max-w-[70%] mx-auto py-8 px-4 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                            {/* Interview Report */}
                            <div className="space-y-4 flex-grow">
                                <h1 className="text-2xl font-semibold">Interview Report for <span className="text-purple-600">Aaron Wang</span></h1>
                                <div className="flex flex-col gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2 font-medium"><BriefcaseBusiness size={18} /> Developer Intern</div >
                                    <div className="flex items-center gap-2 font-medium"><CalendarDays size={18} /> Mar 5, 2024</div>
                                    <div className="flex items-center gap-2 font-medium"><Timer size={18} /> 9 minutes and 25 seconds</div>
                                    <div className="flex items-center gap-2 font-medium"><ShieldCheck size={18} /> No signs of unfairness detected</div>
                                </div>
                            </div>

                            {/* Overall Score */}
                            <Card className="p-6 text-center w-full lg:w-64 bg-[#2C2C2C] border-[#3D3D3D] text-white">
                                <h2 className="text-lg font-medium mb-4">Overall Hire Score</h2>
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <Progress
                                        value={reviewDetails.overall.score}
                                        className="h-32 w-32"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-4xl font-bold">{reviewDetails.overall.score}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Overall Feedback */}
                        <Card className="p-6 bg-[#2C2C2C] border-[#3D3D3D] text-white">
                            <h2 className="text-lg font-medium mb-4">Overall Feedback</h2>
                            <p className="text-gray-200">
                                {reviewDetails.overall.feedback}
                            </p>
                        </Card>

                        {/* Skill Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* {reviewDetails.skills && Object.entries(reviewDetails.skills).map((skill, index) => { */}
                            {reviewDetails.skills && Object.entries(reviewDetails.skills).map(([skill, detail], index) => {

                                // Converting Snake case to Normal 
                                skill = skill.replace("_", ' ')
                                skill = skill[0].toUpperCase() + skill.slice(1);

                                return (<Card key={index} className="p-6 bg-[#2C2C2C] border-[#3D3D3D] text-white">
                                    <div className="space-y-4">
                                        {/* <div className="text-sm text-gray-400">{skill}</div> */}
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-3xl font-medium ">{skill}</h3>
                                            <div className="relative w-16 h-16">
                                                <Progress
                                                    value={detail.score}
                                                    className="h-16 w-16 [&>div]:stroke-purple-600 [&>div]:stroke-[8]"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-bold">{detail.score}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium mb-2 text-gray-300">Feedback</div>
                                            <p className="text-sm text-gray-400">{detail.details}</p>
                                        </div>
                                    </div>
                                </Card>
                                )
                            })}
                        </div>

                        {/* Question Summary */}
                        <Card className="bg-[#2C2C2C] border-[#3D3D3D] text-white">
                            <div
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => setIsQuestionSummaryOpen(!isQuestionSummaryOpen)}
                            >
                                <h2 className="text-lg font-semibold">Question Summary</h2>
                                {isQuestionSummaryOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            {isQuestionSummaryOpen && (
                                <div className="p-6 pt-0">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-200">{reviewDetails.question_summary.question1}</p>
                                            <p className="text-gray-400">{reviewDetails.question_summary.answer1}</p>
                                        </div>
                                        <hr className="border-neutral-700" />
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-200">{reviewDetails.question_summary.question2}</p>
                                            <p className="text-gray-400">{reviewDetails.question_summary.answer2}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Transcript */}
                        <Card className="bg-[#2C2C2C] border-[#3D3D3D] text-white">
                            <div
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                            >
                                <h2 className="text-lg font-semibold">Transcript</h2>
                                {isTranscriptOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            {isTranscriptOpen && (
                                <div className="p-4 pt-0 space-y-4">
                                    {/* Transcript content */}
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <div className="text-gray-400">[00:00] Interviewer</div>
                                            <p>Hey Aaron, thanks for joining me today! I'm Alex and I'll be conducting your interview. I'm excited to get started. Can you tell me a little bit about yourself?</p>
                                        </div>
                                        <div>
                                            <div className="text-gray-400">[00:10] Candidate</div>
                                            <p>Hey, Alex. Nice to meet you. My name is Aaron. I studied computer science at Brown University. I'm really passionate about software engineering, and all things data science related. So really excited to to, again, get started here.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Video Recording */}
                        <Card className="bg-[#2C2C2C] border-[#3D3D3D] text-white">
                            <div
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => setIsVideoOpen(!isVideoOpen)}
                            >
                                <h2 className="text-lg font-semibold">Video Recording</h2>
                                {isVideoOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            {isVideoOpen && (
                                <div className="p-4 pt-0">
                                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        <video
                                            controls
                                            className="w-full h-full"
                                            poster="/placeholder.svg"
                                        >
                                            <source src="/interview-recording.mp4" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

