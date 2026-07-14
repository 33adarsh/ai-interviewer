import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import interviewController from '../controllers/interview.controller.js';
import upload from '../middleware/file.middleware.js';

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post('/', authMiddleware.authUser, upload.single('resume'), interviewController.generateInterviewReportController);

/**
 * @route GET /api/interview/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get('/:interviewId', authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get('/', authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route GET /api/interview/resume-pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.get('/resume-pdf/:interviewReportId', authMiddleware.authUser, interviewController.generateResumePdfController);

export default interviewRouter;