import { generateInterviewReport, generateResumePdf } from '../services/ai.service.js';
import fs from 'fs';
import { extractPdfText } from '../utils/pdfReader.js';
import interviewReportModel from '../models/interviewReport.model.js';

/**
 * @description Controller to generate interview report using resume, self description and job description.
 */
async function generateInterviewReportController(req, res) {
    let filePath;
    try {
        const { selfDescription, jobDescription, title } = req.body;

        if (!req.file && (!selfDescription || !selfDescription.trim())) {
            return res.status(400).json({
                message: "Either a resume or self description is required."
            })
        }

        let resumeText = "";
        if (req.file) {
            filePath = req.file.path;
            console.log("check file response from multer->", filePath);
            try {
                resumeText = await extractPdfText(filePath);
            } finally {
                if (filePath && fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            title,
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({
            message: "Something went wrong while generating the interview report.",
            error: error.message
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({
            message: "Something went wrong while fetching the interview report.",
            error: error.message
        })
    }
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        console.error("Error fetching interview reports:", error);
        res.status(500).json({
            message: "Something went wrong while fetching the interview reports.",
            error: error.message
        })
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        res.status(500).json({
            message: "Something went wrong while generating the resume PDF.",
            error: error.message
        })
    }
}

export default {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}