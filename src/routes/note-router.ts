import { NextFunction, Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import { ApiError } from "../errors/api-error";
import { Note } from "../models/note/note.model";
import { tokenMiddleware } from "../utils/jwt";


const noteRouter = Router();
const { OK, CREATED, BAD_REQUEST } = StatusCodes;

noteRouter.post('/', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { name, description, image, category, status } = req.body;
    Note.findOne({ name, description, category, status }).then((noteFound) => {
        if (!noteFound) {
            Note.findOne({ status }).sort({ order: -1 }).then((noteFound) => {
                const newNote = {
                    name,
                    description,
                    image,
                    category,
                    status,
                    order: !noteFound ? 1 : noteFound.order + 1
                };
                Note.create(newNote).then((createdNote) => {
                    res.status(CREATED).json(createdNote);
                });
            });
        }
        else {
            next(ApiError.badRequest(['DUPLICATED_NOTE']));
        }
    });
});

noteRouter.get('/', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    Note.find({}).then((notes) => {
        res.status(OK).json(notes);
    });
});

noteRouter.get('/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    Note.findOne({ _id: id }).then((note) => {
        if (!note) {
            next(ApiError.badRequest(['NON_EXISTENT_NOTE']));
        }
        else {
            res.status(OK).json(note);
        }
    });
});

noteRouter.delete('/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    Note.findOne({ _id: id }).then((noteFound) => {
        if (!noteFound) {
            next(ApiError.badRequest(['NON_EXISTENT_NOTE']));
        }
        else {
            Note.deleteOne({ _id: id }).then(() => {
                res.status(OK).json();
            });
        }
    });
});

noteRouter.patch('/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description, image, category, status, order } = req.body;
    const valueUpdated = {
        name,
        description,
        image,
        category,
        status,
        order
    };
    const condition = {
        _id: id
    }
    Note.findOne(condition).then((noteFound) => {
        if (!noteFound) {
            next(ApiError.badRequest(['NON_EXISTENT_NOTE']));
        }
        else {
            const newNote = {
                ...noteFound,
                ...valueUpdated
            };
            Note.findOne({ name: newNote.name, description: newNote.description, category: newNote.category, status: newNote.status, _id: { $ne: id } }).then((duplicatedNote) => {
                if (duplicatedNote) {
                    next(ApiError.badRequest(['DUPLICATED_NOTE']));
                }
                else {
                    Note.updateOne(condition, valueUpdated, {}, (err, category) => {
                        res.status(OK).json();
                    });
                }
            })
        }
    });
});


export default noteRouter;