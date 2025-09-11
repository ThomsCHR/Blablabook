export class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
    }
}

// 400 Bad request
export class HttpBadRequestError extends HttpError {
    constructor(message='Requête invalide. Vérifiez les données envoyées.') {
        super(message, httpStatusCodes.BAD_REQUEST);
    }
}

// 401 Unauthorized
export class HttpUnauthorizedError extends HttpError {
    constructor(message='Authentification requise. Veuillez vous connecter.') {
        super(message, httpStatusCodes.UNAUTHORIZED);
    }
}

// 403 Forbidden
export class HttpForbiddenError extends HttpError {
    constructor(message='Accès interdit. Vous n\'avez pas les permissions nécessaires.') {
        super(message, httpStatusCodes.FORBIDDEN);
    }
}

// 404 Not found
export class HttpNotFoundError extends HttpError {
    constructor(message='Ressource introuvable. La page ou l\'élément demandé n\'existe pas.') {
        super(message, httpStatusCodes.NOT_FOUND);
    }
}

// 409 Conflict
export class HttpConflictError extends HttpError {
    constructor(message='Conflit détecté. Cette action ne peut pas être effectuée.') {
        super(message, httpStatusCodes.CONFLICT);
    }
}

// Stocker les status code
export const httpStatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
    
};