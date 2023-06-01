"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.successResponse = exports.errorResponse = void 0;
function errorResponse(res, statusCode, error) {
    const resobj = { statusCode, error };
    return res.status(statusCode).send(resobj);
}
exports.errorResponse = errorResponse;
function successResponse(res, statusCode, message, data = []) {
    const resobj = { statusCode, message, data };
    return res.status(statusCode).send(resobj);
}
exports.successResponse = successResponse;
function handleError(req, error) {
    console.log(`
        Errormessage: ${JSON.stringify(error.message)},caught at: ${JSON.stringify(req.path)}
    `);
}
exports.handleError = handleError;
//# sourceMappingURL=response.js.map